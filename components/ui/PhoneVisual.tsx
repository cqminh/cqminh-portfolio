'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import PhoneAppGrid, { IconTile } from './PhoneAppGrid';
import MarqueeText from './MarqueeText';
import { Language, Localized, PhoneAppChild, PhoneAppGroup, PhoneAppItem } from '@/types/content';

interface PhoneVisualProps {
  width: number;
  height: number;
  inset: number;
  radius: number;
  apps: PhoneAppItem[];
  language: Language;
  phoneNumberCopiedLabel: Localized;
}

// Proportions (relative to `width`, same convention as the status-bar
// metrics below) for laying out the 4-per-row app grid on the screen.
const GRID_TOP_FRACTION = 0.17;
const GRID_SIDE_PADDING_FRACTION = 0.09;
const GRID_GAP_FRACTION = 0.03;

const CLOCK_FONT_SIZE_FRACTION = 0.036;
const FOLDER_TITLE_FONT_SIZE_FRACTION = 0.052;

// Measured from phone.png's 194x394 source: the dynamic island sits at
// x:[73,121] y:[13,26]. The rendered phone is scaled uniformly by
// (display width / 194), so both fractions below are relative to width.
const NOTCH_LEFT_FRACTION = 73 / 194;
const NOTCH_RIGHT_FRACTION = 121 / 194;
const NOTCH_CENTER_Y_FRACTION = 19.5 / 194;

function useCurrentTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}

function useIsDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains('dark'));

    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

interface BatteryManager extends EventTarget {
  charging: boolean;
}

function useIsCharging() {
  const [charging, setCharging] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryManager> };
    if (!nav.getBattery) return;

    let battery: BatteryManager | undefined;
    const handleChange = () => setCharging(!!battery?.charging);

    nav.getBattery().then((b) => {
      battery = b;
      handleChange();
      battery.addEventListener('chargingchange', handleChange);
    });

    return () => battery?.removeEventListener('chargingchange', handleChange);
  }, []);

  return charging;
}

// Matches the fade-out duration below — closing clears `openGroupId` only
// after the fade has actually played, instead of yanking the panel away.
const FOLDER_TRANSITION_MS = 200;

// A tapped "group" tile opens like a real folder: a blurred backdrop over
// the home screen with the full (unsliced) list of that group's apps.
function useOpenFolder(apps: PhoneAppItem[]) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const open = (id: string) => {
    setOpenId(id);
    requestAnimationFrame(() => setIsVisible(true));
  };

  const close = () => {
    setIsVisible(false);
    setTimeout(() => setOpenId(null), FOLDER_TRANSITION_MS);
  };

  useEffect(() => {
    if (!openId) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [openId]);

  const group = apps.find((app): app is PhoneAppGroup => app.type === 'group' && app.id === openId) ?? null;

  return { group, isVisible, open, close };
}

// The open-folder panel is always a fixed 3x3 grid — real iOS folders don't
// resize to fit fewer items, and page instead of growing past 9. Fewer
// children just leave empty cells (grid-template-rows is fixed, not
// content-sized); more paginate via horizontal swipe, dots below to match.
const PANEL_COLS = 3;
const PANEL_ROWS = 3;
const PANEL_PAGE_SIZE = PANEL_COLS * PANEL_ROWS;
const PANEL_PADDING_FRACTION = 0.06;
const PANEL_GAP_FRACTION = 0.05;
// Row height as a multiple of icon size, so each row has room for the
// icon plus its label underneath without the grid stretching cells to fit.
const PANEL_ROW_HEIGHT_FACTOR = 1.55;
// App label text, as a fraction of the icon's own size — matches
// PhoneAppGrid's LABEL_FONT_SIZE_FRACTION for the closed-grid labels.
const PANEL_LABEL_FONT_SIZE_FRACTION = 0.19;

// Mounted fresh each time a folder opens (the parent only renders this
// while `group` is set), so `pageIndex` naturally starts back at 0 instead
// of needing an explicit reset effect.
function FolderPanel({
  group,
  language,
  panelWidth,
  panelPadding,
  panelGap,
  panelIconSize,
  panelRowHeight,
}: {
  group: PhoneAppGroup;
  language: Language;
  panelWidth: number;
  panelPadding: number;
  panelGap: number;
  panelIconSize: number;
  panelRowHeight: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [pageIndex, setPageIndex] = useState(0);

  const pageCount = Math.max(1, Math.ceil(group.children.length / PANEL_PAGE_SIZE));
  const pages: PhoneAppChild[][] = Array.from({ length: pageCount }, (_, i) =>
    group.children.slice(i * PANEL_PAGE_SIZE, (i + 1) * PANEL_PAGE_SIZE)
  );

  // Which page counts as "current" is driven by actual visibility, not a
  // scrollLeft/clientWidth ratio — that math assumes every page div reports
  // an exact integer clientWidth matching the (sub-pixel) panelWidth, which
  // isn't guaranteed and drifted the dot indicator out of sync with what
  // was actually on screen, worse the more pages there were.
  useEffect(() => {
    const root = scrollRef.current;
    if (!root || pages.length < 2) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries.reduce<IntersectionObserverEntry | null>(
          (best, entry) => (entry.intersectionRatio > (best?.intersectionRatio ?? 0.5) ? entry : best),
          null
        );
        if (!mostVisible) return;
        const index = pageRefs.current.indexOf(mostVisible.target as HTMLDivElement);
        if (index !== -1) setPageIndex(index);
      },
      { root, threshold: [0.5] }
    );

    pageRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [pages.length]);

  const goToPage = (index: number) => {
    scrollRef.current?.scrollTo({ left: index * scrollRef.current.clientWidth, behavior: 'smooth' });
  };

  return (
    <>
      <div
        ref={scrollRef}
        className="hide-scrollbar flex overflow-x-auto"
        style={{ width: panelWidth, scrollSnapType: 'x mandatory' }}
      >
        {pages.map((pageChildren, i) => (
          <div
            key={i}
            ref={(el) => {
              pageRefs.current[i] = el;
            }}
            className="grid flex-shrink-0 rounded-[10%] bg-white/15 backdrop-blur-md"
            style={{
              width: panelWidth,
              gridTemplateColumns: `repeat(${PANEL_COLS}, ${panelIconSize}px)`,
              gridTemplateRows: `repeat(${PANEL_ROWS}, ${panelRowHeight}px)`,
              alignItems: 'start',
              justifyContent: 'space-between',
              padding: panelPadding,
              columnGap: panelGap,
              rowGap: panelGap,
              scrollSnapAlign: 'start',
            }}
          >
            {pageChildren.map((child) => (
              <div key={child.id} className="flex flex-col items-center" style={{ gap: panelIconSize * 0.08 }}>
                <IconTile id={child.id} icon={child.icon} size={panelIconSize} />
                <MarqueeText
                  text={child.label[language]}
                  className="max-w-full text-center font-medium text-white"
                  style={{ fontSize: panelIconSize * PANEL_LABEL_FONT_SIZE_FRACTION, textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {pages.length > 1 && (
        <div className="mt-3 flex" style={{ gap: panelGap }}>
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Page ${i + 1}`}
              onClick={() => goToPage(i)}
              className="rounded-full"
              style={{
                width: panelIconSize * 0.12,
                height: panelIconSize * 0.12,
                backgroundColor: i === pageIndex ? 'white' : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default function PhoneVisual({ width, height, inset, radius, apps, language, phoneNumberCopiedLabel }: PhoneVisualProps) {
  const time = useCurrentTime();
  const isDark = useIsDarkMode();
  const charging = useIsCharging();
  const folder = useOpenFolder(apps);

  const iconColor = isDark ? 'white' : 'black';
  const iconH = width * 0.045;
  const iconGap = width * 0.018;
  const batteryIcon = charging ? 'battery_charge' : 'battery';

  const notchRightX = width * NOTCH_RIGHT_FRACTION;
  const screenRightEdge = width - inset;

  const gridSidePadding = width * GRID_SIDE_PADDING_FRACTION;
  const gridGap = width * GRID_GAP_FRACTION;
  const gridIconSize = (width - 2 * inset - 2 * gridSidePadding - 3 * gridGap) / 4;

  // Open-folder panel spans the same horizontal bounds as the main app grid.
  const panelWidth = width - 2 * inset - 2 * gridSidePadding;
  const panelPadding = panelWidth * PANEL_PADDING_FRACTION;
  const panelGap = panelWidth * PANEL_GAP_FRACTION;
  const panelIconSize = (panelWidth - 2 * panelPadding - (PANEL_COLS - 1) * panelGap) / PANEL_COLS;
  const panelRowHeight = panelIconSize * PANEL_ROW_HEIGHT_FACTOR;

  return (
    <div
      className="relative flex-shrink-0 overflow-hidden"
      style={{
        width,
        height,
        WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
      }}
    >
      <div
        className="absolute overflow-hidden"
        style={{
          inset,
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
          background: 'linear-gradient(to bottom right, var(--hero-gradient-from), var(--hero-gradient-via), var(--hero-gradient-to))',
        }}
      />

      {time && (
        <span
          className="font-nunito font-semibold absolute"
          style={{
            top: width * NOTCH_CENTER_Y_FRACTION,
            left: (inset + width * NOTCH_LEFT_FRACTION) / 2,
            transform: 'translate(-50%, -50%)',
            fontSize: width * CLOCK_FONT_SIZE_FRACTION,
            color: 'var(--foreground)',
          }}
        >
          {time}
        </span>
      )}

      <div
        className="absolute flex items-center"
        style={{
          top: width * NOTCH_CENTER_Y_FRACTION,
          left: (notchRightX + screenRightEdge) / 2,
          transform: 'translate(-50%, -50%)',
          gap: iconGap,
        }}
      >
        <Image src={`/signal_${iconColor}.png`} alt="" width={iconH} height={iconH} />
        <Image src={`/wifi_${iconColor}.png`} alt="" width={iconH} height={iconH} />
        <Image src={`/${batteryIcon}_${iconColor}.png`} alt="" width={iconH} height={iconH} />
      </div>

      <div
        className="absolute"
        style={{ top: inset + width * GRID_TOP_FRACTION, left: inset + gridSidePadding, right: inset + gridSidePadding }}
      >
        <PhoneAppGrid
          apps={apps}
          language={language}
          iconSize={gridIconSize}
          gap={gridGap}
          phoneNumberCopiedLabel={phoneNumberCopiedLabel}
          onGroupOpen={folder.open}
        />
      </div>

      {/* Decorative frame, painted last (on top) to sit over the screen
          content — pointer-events-none so it doesn't block clicks on the
          app icons underneath. */}
      <Image src="/phone.png" alt="" fill sizes={`${width}px`} priority className="pointer-events-none object-cover object-top" />

      {/* A tapped folder opens over everything, including the frame — same
          screen bounds (inset/radius) as the background so it reads as
          part of the phone's screen, not a page-level modal. */}
      {folder.group && (
        <div
          className="absolute overflow-hidden"
          style={{
            inset,
            borderTopLeftRadius: radius,
            borderTopRightRadius: radius,
            opacity: folder.isVisible ? 1 : 0,
            transition: `opacity ${FOLDER_TRANSITION_MS}ms ease-out`,
          }}
        >
          {/* Tap-outside-to-close catcher — decorative/pointer-only. The
              real accessible close control is the button below, so this
              doesn't also need to be reachable by keyboard/screen reader. */}
          <button type="button" tabIndex={-1} aria-hidden onClick={folder.close} className="absolute inset-0 bg-black/20 backdrop-blur-xl" />

          <div className="relative flex flex-col items-center" style={{ paddingTop: width * 0.14 }}>
            <p
              className="pointer-events-none font-semibold text-white"
              style={{ fontSize: width * FOLDER_TITLE_FONT_SIZE_FRACTION, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
            >
              {folder.group.label[language]}
            </p>

            <div className="mt-4 flex flex-col items-center">
              <FolderPanel
                group={folder.group}
                language={language}
                panelWidth={panelWidth}
                panelPadding={panelPadding}
                panelGap={panelGap}
                panelIconSize={panelIconSize}
                panelRowHeight={panelRowHeight}
              />
            </div>
          </div>

          {/* Rendered last so it stacks above the (full-width) content div
              above — otherwise that div's own top padding area, which
              visually overlaps this button's corner, intercepts the click
              first even though nothing is visibly drawn there. */}
          <button
            type="button"
            aria-label="Close folder"
            onClick={folder.close}
            className="absolute flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            style={{ top: width * 0.05, right: width * 0.05, width: width * 0.09, height: width * 0.09, fontSize: width * 0.05 }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

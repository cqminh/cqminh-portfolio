'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Language, Localized, PhoneAppItem } from '@/types/content';

interface PhoneAppGridProps {
  apps: PhoneAppItem[];
  language: Language;
  iconSize: number;
  gap: number;
  phoneNumberCopiedLabel: Localized;
  onGroupOpen: (id: string) => void;
}

const COPY_FEEDBACK_MS = 1500;

// App label / copied-tooltip text, as a fraction of the icon's own size.
const LABEL_FONT_SIZE_FRACTION = 0.19;

// The 2x2 preview inside a "group" folder tile, as fractions of the
// folder's own size. Must satisfy 2*CHILD + GAP + 2*PADDING = 1 so the
// 2x2 grid exactly fills the padded box — otherwise (border-box sizing)
// the fixed-size child tiles overflow the bottom/right edge instead of
// shrinking, since Grid won't shrink a track below its item's own size.
const GROUP_PADDING_FRACTION = 0.1;
const GROUP_GAP_FRACTION = 0.08;
const GROUP_CHILD_SIZE_FRACTION = (1 - GROUP_GAP_FRACTION - 2 * GROUP_PADDING_FRACTION) / 2;

// Solid, deterministic-per-id colors so placeholder tiles (no `icon` yet)
// still read as distinct apps instead of a wall of identical gray squares.
const PLACEHOLDER_COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

function placeholderColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return PLACEHOLDER_COLORS[hash % PLACEHOLDER_COLORS.length];
}

export function IconTile({ id, icon, size }: { id: string; icon: string; size: number }) {
  if (icon) {
    return (
      <div className="overflow-hidden rounded-[22%]" style={{ width: size, height: size }}>
        <Image src={icon} alt="" width={size} height={size} className="h-full w-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className="flex items-center justify-center rounded-[22%] font-semibold text-white"
      style={{ width: size, height: size, backgroundColor: placeholderColor(id), fontSize: size * 0.4 }}
    >
      {id.charAt(0).toUpperCase()}
    </div>
  );
}

export default function PhoneAppGrid({ apps, language, iconSize, gap, phoneNumberCopiedLabel, onGroupOpen }: PhoneAppGridProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // A `tel:` link has nowhere to go on a non-touch device — there's no
  // dialer to hand it to, and it'd either do nothing or hand off to
  // whatever calling app happens to be registered (Skype, Teams...). So
  // there we copy the number instead of navigating. Touch devices — the
  // ones that actually have a dialer — get the real tel: link untouched.
  const handleAppClick = (id: string, href: string) => (e: React.MouseEvent) => {
    if (!href.startsWith('tel:')) return;
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    e.preventDefault();
    navigator.clipboard.writeText(href.slice('tel:'.length));
    setCopiedId(id);
    setTimeout(() => setCopiedId((current) => (current === id ? null : current)), COPY_FEEDBACK_MS);
  };

  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: `repeat(4, ${iconSize}px)`, columnGap: gap, rowGap: gap * 1.4, justifyContent: 'space-between' }}
    >
      {apps.map((app) => {
        const tileContent = (
          <>
            {app.type === 'app' ? (
              <IconTile id={app.id} icon={app.icon} size={iconSize} />
            ) : (
              <div
                className="grid grid-cols-2 rounded-[22%] bg-white/15 backdrop-blur-sm"
                style={{
                  width: iconSize,
                  height: iconSize,
                  padding: iconSize * GROUP_PADDING_FRACTION,
                  gap: iconSize * GROUP_GAP_FRACTION,
                }}
              >
                {app.children.slice(0, 4).map((child) => (
                  <IconTile key={child.id} id={child.id} icon={child.icon} size={iconSize * GROUP_CHILD_SIZE_FRACTION} />
                ))}
              </div>
            )}
            <span
              className="max-w-full truncate text-center font-medium text-white"
              style={{ fontSize: iconSize * LABEL_FONT_SIZE_FRACTION, textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}
            >
              {app.label[language]}
            </span>
          </>
        );

        if (app.type === 'app') {
          // tel:/mailto: hand off to another app rather than navigate a page —
          // opening those in a new tab just leaves a blank one behind.
          const opensNewTab = app.href.startsWith('http');
          return (
            <a
              key={app.id}
              href={app.href}
              target={opensNewTab ? '_blank' : undefined}
              rel={opensNewTab ? 'noopener noreferrer' : undefined}
              onClick={handleAppClick(app.id, app.href)}
              className="relative flex flex-col items-center"
              style={{ gap: iconSize * 0.08 }}
            >
              {tileContent}
              {copiedId === app.id && (
                <span
                  className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-white"
                  style={{ fontSize: iconSize * LABEL_FONT_SIZE_FRACTION }}
                >
                  {phoneNumberCopiedLabel[language]}
                </span>
              )}
            </a>
          );
        }

        return (
          <button
            key={app.id}
            type="button"
            onClick={() => onGroupOpen(app.id)}
            className="flex flex-col items-center"
            style={{ gap: iconSize * 0.08 }}
          >
            {tileContent}
          </button>
        );
      })}
    </div>
  );
}

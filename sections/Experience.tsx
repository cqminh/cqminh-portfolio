'use client';

import { siteContent } from '@/content/site-content';
import { useLanguage } from '@/components/providers/LanguageProvider';
import type { ExperienceCardColor } from '@/types/content';

// Maps each closed-set preset (see ExperienceCardColor) to the light/dark
// CSS var trio defined in globals.css — the card itself only ever reaches
// for these var() references, never a raw hex, so presets stay correct
// across both themes automatically.
const CARD_COLOR_VARS: Record<ExperienceCardColor, { bg: string; border: string; glowRgb: string }> = {
  blue: { bg: 'var(--exp-blue-bg)', border: 'var(--exp-blue-border)', glowRgb: 'var(--exp-blue-glow-rgb)' },
  purple: { bg: 'var(--exp-purple-bg)', border: 'var(--exp-purple-border)', glowRgb: 'var(--exp-purple-glow-rgb)' },
  green: { bg: 'var(--exp-green-bg)', border: 'var(--exp-green-border)', glowRgb: 'var(--exp-green-glow-rgb)' },
  amber: { bg: 'var(--exp-amber-bg)', border: 'var(--exp-amber-border)', glowRgb: 'var(--exp-amber-glow-rgb)' },
  rose: { bg: 'var(--exp-rose-bg)', border: 'var(--exp-rose-border)', glowRgb: 'var(--exp-rose-glow-rgb)' },
};

interface ExperienceProps {
  // Scroll-scrubbed 0 -> 1 driving the timeline traversal, owned by
  // MainSections (which pins this section the same way it pins About and
  // Projects). Mapped below to a float across item indices so each entry's
  // card slides up and settles into the stack as the value moves.
  progress: number;
  // Scroll-scrubbed 0 -> 1 covering just the brief hold before `progress`
  // itself starts climbing — drives the desktop rail's one-shot slide-in
  // from the left as this section's pin engages (handoff from Projects),
  // separate from `progress`'s job of driving the entry-to-entry crossfade.
  entryProgress: number;
}

export default function Experience({ progress, entryProgress }: ExperienceProps) {
  const { language } = useLanguage();
  const content = siteContent.experience;
  const items = content.items;
  const itemCount = items.length;

  // 0 at the first item, itemCount - 1 at the last — the whole-number position
  // sits exactly on one item, fractional values are mid-crossfade to the next.
  const activeFloat = itemCount > 1 ? progress * (itemCount - 1) : 0;
  const travelFraction = itemCount > 1 ? activeFloat / (itemCount - 1) : 1;

  const getItemOpacity = (index: number) => Math.max(0, Math.min(1, 1 - Math.abs(activeFloat - index)));

  // Card stack panel: the active card sits flush at the bottom of its slot;
  // each item still ahead of activeFloat is parked one slot-height below the
  // frame and rides up into place as `progress` reaches it (eased, see
  // SLIDE_EASE_POWER below — fast at first, settling in slower rather than
  // at constant speed), landing on top of (i.e. later in DOM/z-index than)
  // whatever was already settled. Once an item falls behind activeFloat it
  // doesn't vanish — it eases back into a fanned pile peeking out from
  // behind the active card (shrunk, dimmed, nudged up, and rotated/offset
  // to alternating sides like a spread of tarot cards) for up to STACK_DEPTH
  // items, so the pile visibly builds up instead of hard-cutting away.
  const STACK_DEPTH = 3;
  const PEEK_STEP_PX = 14;
  const CARD_HEIGHT_PX = 420;
  const STACK_RESERVE_PX = STACK_DEPTH * PEEK_STEP_PX + 8;
  // Ease-out power applied to the incoming card's slide progress: near 1
  // (far below frame) it covers ground fast, tapering off as it nears 0
  // (settled) instead of moving at constant speed the whole way.
  const SLIDE_EASE_POWER = 2;
  // Fan spread for settled/receding cards — alternates by item index so a
  // given card always leans the same direction as it recedes, rather than
  // flipping sides mid-scroll.
  const FAN_ROTATE_DEG = 1.6;
  const FAN_SHIFT_PX = 8;
  const FAN_INSET_PX = 24;

  return (
    <div className="flex flex-col gap-6">
      {/* Compact horizontal stepper — below md the vertical rail (further
          down) is hidden for space, so this is the only place all years are
          visible at once on narrow windows instead of just the single
          active year inline in the panel. */}
      <div className="md:hidden flex items-center px-1">
        {items.map((exp, index) => {
          const passed = activeFloat >= index - 0.001;
          const isActive = getItemOpacity(index) > 0.5;
          const segmentFraction = Math.max(0, Math.min(1, activeFloat - index));
          return (
            <div key={exp.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <span
                  className="block w-2.5 h-2.5 rounded-full border-2 transition-colors duration-300"
                  style={{
                    borderColor: passed ? 'var(--accent)' : 'var(--card-border)',
                    backgroundColor: passed ? 'var(--accent)' : 'var(--card-bg)',
                    transform: isActive ? 'scale(1.3)' : 'scale(1)',
                  }}
                />
                <span
                  className="whitespace-nowrap text-[10px] font-medium transition-colors duration-300"
                  style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}
                >
                  {exp.startYear}
                </span>
              </div>
              {index < itemCount - 1 && (
                <div className="relative flex-1 h-px mx-1.5" style={{ backgroundColor: 'var(--card-border)' }}>
                  <div
                    className="absolute left-0 top-0 h-px"
                    style={{ width: `${segmentFraction * 100}%`, backgroundColor: 'var(--accent)' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-12 items-center">
        {/* Timeline rail — slides in from off-screen left as the Experience
            pin engages (entryProgress), independent of the entry-to-entry
            crossfade below (progress); stays fully in place for the rest of
            the section once entryProgress reaches 1. */}
        <div
          className="relative hidden md:block h-[420px] ml-3"
          style={{ opacity: entryProgress, transform: `translateX(${(1 - entryProgress) * -8}vw)` }}
        >
          {/* Unlit trunk. Only the top is rounded — the bottom edge sits
              flush under the last dot, since rounding it too stacks with
              the dot's own circle and reads as an oversized blob. */}
          <div className="absolute left-0 top-0 bottom-0 w-1 -translate-x-1/2 rounded-t-full bg-[var(--card-border)]" />
          {/* Lit trunk — grows with scroll and glows like it's charging up
              rather than sitting flat. Bottom edge deliberately unrounded
              for the same reason as above; it also often stops mid-line
              between nodes during the crossfade, where a rounded cap would
              float oddly. The gradient is sized/pinned to the rail's full
              420px height (not this div's own, growing height) so the color
              at a given point stays fixed as more of it is revealed, rather
              than the whole gradient restretching — reuses the same
              blue -> purple -> sky brand gradient as the resume button and
              hero heading, instead of a flat accent fill. */}
          <div
            className="absolute left-0 top-0 w-1 -translate-x-1/2 rounded-t-full transition-[height] duration-300 ease-out"
            style={{
              height: `${travelFraction * 100}%`,
              backgroundImage:
                'linear-gradient(180deg, var(--btn-resume-grad-1), var(--btn-resume-grad-2), var(--btn-resume-grad-3))',
              backgroundSize: '100% 420px',
              backgroundPosition: 'top',
              boxShadow: '0 0 10px 1px rgba(var(--accent-rgb), 0.55)',
            }}
          />
          {items.map((exp, index) => {
            const dotPosition = itemCount > 1 ? (index / (itemCount - 1)) * 100 : 0;
            const passed = activeFloat >= index - 0.001;
            const isActive = getItemOpacity(index) > 0.5;
            return (
              <div key={exp.id} className="absolute left-0" style={{ top: `${dotPosition}%` }}>
                {isActive && (
                  // Wrapper centers the ping via className translate only —
                  // animate-ping's own keyframe (transform: scale(2)) fully
                  // replaces whatever transform sits on the animated element
                  // itself, so if the -50%/-50% centering lived there too,
                  // it would get interpolated away mid-animation and the
                  // ripple would drift off-center as it grows.
                  <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 block w-2.5 h-2.5">
                    <span
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{ backgroundColor: 'var(--accent)', opacity: 0.6 }}
                    />
                  </span>
                )}
                <span
                  className="absolute left-0 top-1/2 z-10 block w-2.5 h-2.5 rounded-full border-2 transition-all duration-300"
                  style={{
                    borderColor: passed ? 'var(--accent)' : 'var(--card-border)',
                    backgroundColor: passed ? 'var(--accent)' : 'var(--card-bg)',
                    boxShadow: isActive
                      ? '0 0 0 4px rgba(var(--accent-rgb), 0.18), 0 0 13px 2px rgba(var(--accent-rgb), 0.6)'
                      : passed
                        ? '0 0 6px rgba(var(--accent-rgb), 0.35)'
                        : 'none',
                    transform: `translate(-50%, -50%) ${isActive ? 'scale(1.3)' : 'scale(1)'}`,
                  }}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-medium transition-colors duration-300"
                  style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}
                >
                  {exp.startYear} - {exp.endYear ?? content.presentLabel[language]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Stacking card panel — see STACK_DEPTH comment above. Extra top
            space (STACK_RESERVE_PX) is reserved so settled cards have room
            to peek out above the active one instead of getting clipped by
            the overflow-hidden frame. */}
        <div className="relative overflow-hidden" style={{ height: `${CARD_HEIGHT_PX + STACK_RESERVE_PX}px` }}>
          {items.map((exp, index) => {
            const diff = index - activeFloat;
            const isFront = diff >= 0;
            const slideT = isFront ? Math.min(1, diff) : 0;
            const depth = isFront ? 0 : Math.min(STACK_DEPTH, -diff);
            if (!isFront && depth >= STACK_DEPTH) return null;

            const slideEase = Math.pow(slideT, SLIDE_EASE_POWER);
            const translateY = isFront ? slideEase * (CARD_HEIGHT_PX * 1.1) : -depth * PEEK_STEP_PX;
            const fanSign = index % 2 === 0 ? -1 : 1;
            const translateX = depth * FAN_SHIFT_PX * fanSign;
            const rotate = depth * FAN_ROTATE_DEG * fanSign;
            const scale = isFront ? 1 : 1 - depth * 0.035;
            const opacity = isFront ? 1 : 1 - depth / STACK_DEPTH;
            const brightness = isFront ? 1 : 1 - depth * 0.06;
            const horizontalInset = isFront ? 0 : FAN_INSET_PX;
            // Preset accent (see ExperienceCardColor) — a soft tinted
            // background/border always, plus a colored glow that's vivid on
            // the front card and fades out as items recede into the stack,
            // so depth is still read primarily through scale/dimming, not
            // competing color intensity.
            const colorVars = CARD_COLOR_VARS[exp.color];
            const glowAlpha = isFront ? 0.25 : Math.max(0, 0.14 - depth * 0.05);

            return (
              <div
                key={exp.id}
                className="absolute bottom-0 rounded-2xl border p-5 md:p-7 flex flex-col md:flex-row gap-6 md:gap-8"
                style={{
                  height: `${CARD_HEIGHT_PX}px`,
                  left: `${horizontalInset}px`,
                  right: `${horizontalInset}px`,
                  zIndex: index,
                  opacity,
                  backgroundColor: colorVars.bg,
                  borderColor: colorVars.border,
                  boxShadow: `0 20px 40px -14px rgba(0, 0, 0, 0.3), 0 10px 26px -6px rgba(${colorVars.glowRgb}, ${glowAlpha})`,
                  transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
                  transformOrigin: 'bottom center',
                  filter: brightness !== 1 ? `brightness(${brightness})` : undefined,
                }}
              >
                <div className="shrink-0 w-full md:w-56 h-40 md:h-full rounded-xl overflow-hidden bg-[var(--card-bg-hover)]">
                  {exp.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={exp.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold" style={{ color: 'var(--accent)' }}>
                      {exp.company.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1 md:flex md:flex-col md:justify-center min-w-0">
                  <h3 className="text-2xl font-semibold text-[var(--text-primary)]">{exp.title[language]}</h3>
                  <p className="text-[var(--accent)] font-medium mb-3">{exp.company}</p>
                  <p className="text-[var(--text-secondary)]">{exp.description[language]}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Particles, { ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { Engine } from '@tsparticles/engine';
import { Imperial_Script, Noto_Serif } from 'next/font/google';
import { particlesConfig } from '@/config/particles';
import { useLoading } from '@/components/providers/LoadingProvider';
import { useOnScroll } from '@/hooks/useOnScroll';

const PORTRAIT_HOLD_MS = 3000;
const PORTRAIT_SLIDE_MS = 600;
const CONTENT_FADE_MS = 600;
// Fixed sizes (not percentages of a percentage of a percentage) so every
// photo renders at exactly the same box regardless of its own source
// dimensions — no per-photo rounding drift that reads as a slight zoom.
const PORTRAIT_CENTER_SIZE = 'clamp(7.5rem, 12vw, 10rem)';
// The side/center size difference is done via transform: scale(), not a
// different `width` — on real iOS Safari (not Chrome's mobile emulation,
// which doesn't reproduce this), transitioning `width` on a descendant of
// a transform-animated ancestor (the sliding track) can "stale-paint": the
// element re-layouts but the composited layer doesn't repaint, so the old
// size visually sticks and center/side end up looking identical. scale()
// is compositor-only and never touches layout, sidestepping that bug.
const PORTRAIT_SIDE_SCALE = 0.6;
// Position (bottom offset, and right-anchored vs. centered) lives in
// globals.css under .hero-portrait-slider — it needs a responsive override
// on phones (raised up, centered instead of right-anchored) that a plain
// media query expresses far more cleanly than Tailwind/inline style can.
// Deliberately NOT set inline: an inline style would always win over the
// stylesheet's media query, no matter how it's written.

// `images` comes from the backend (hero_slider_image) and its length isn't
// guaranteed — this renders nothing for 0, a single static photo for 1, and
// a sliding 3-up carousel for 2+.
//
// The carousel's track holds the list twice back-to-back so the window can
// keep sliding forward past the last photo — once it reaches the duplicate
// copy (which looks identical to the start), it snaps back to index 0 with
// the transition switched off for one frame, giving an infinite loop
// without an obvious jump. That trick needs at least 2 photos (with 1, the
// "next" slide is the same photo, so there's nothing to loop).
function PortraitSlider({
  images,
  hasEntered,
  fadeOpacity,
}: {
  images: string[];
  hasEntered: boolean;
  fadeOpacity: number;
}) {
  const opacity = hasEntered ? fadeOpacity : 0;
  const fadeStyle = { opacity, transition: `opacity ${CONTENT_FADE_MS}ms ease` };
  const count = images.length;
  const [index, setIndex] = useState(0);
  const [skipTransition, setSkipTransition] = useState(false);
  const trackImages = count >= 2 ? [...images, ...images] : images;

  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, PORTRAIT_HOLD_MS);
    return () => clearInterval(id);
  }, [count]);

  useEffect(() => {
    if (count < 2 || index !== count) return;
    const t = setTimeout(() => {
      setSkipTransition(true);
      setIndex(0);
    }, PORTRAIT_SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, count]);

  useEffect(() => {
    if (!skipTransition) return;
    const raf = requestAnimationFrame(() => setSkipTransition(false));
    return () => cancelAnimationFrame(raf);
  }, [skipTransition]);

  if (count === 0) return null;

  if (count === 1) {
    return (
      <div
        className="hero-portrait-slider absolute z-20 overflow-hidden rounded-2xl shadow-lg"
        style={{ width: PORTRAIT_CENTER_SIZE, aspectRatio: '3 / 4', ...fadeStyle }}
      >
        <Image src={images[0]} alt="" fill className="object-cover" sizes="200px" />
      </div>
    );
  }

  return (
    <div
      className="hero-portrait-slider absolute z-20 overflow-hidden"
      style={{ width: `calc(3 * ${PORTRAIT_CENTER_SIZE})`, ...fadeStyle }}
    >
      <div
        className="flex items-end"
        style={{
          transform: `translateX(calc(-${index} * ${PORTRAIT_CENTER_SIZE}))`,
          transition: skipTransition ? 'none' : `transform ${PORTRAIT_SLIDE_MS}ms ease`,
        }}
      >
        {trackImages.map((src, i) => {
          const isCenter = i === index + 1;
          return (
            <div key={i} className="flex justify-center flex-shrink-0 px-1" style={{ width: PORTRAIT_CENTER_SIZE }}>
              <div
                className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 ease-out"
                style={{
                  width: PORTRAIT_CENTER_SIZE,
                  aspectRatio: '3 / 4',
                  transform: isCenter ? 'scale(1)' : `scale(${PORTRAIT_SIDE_SCALE})`,
                  transformOrigin: 'bottom center',
                  filter: isCenter ? 'grayscale(0)' : 'grayscale(1)',
                  opacity: isCenter ? 1 : 0.6,
                }}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="200px" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const TITLE_HOLD_MS = 3000;
const TITLE_TRANSITION_MS = 1000;
// Exit and enter each get half the transition and never overlap in time —
// the old word fully leaves before the new one starts arriving — otherwise
// two differently-shaped words are visible at once and read as a jumble.
const TITLE_PHASE_MS = TITLE_TRANSITION_MS / 2;
const LETTER_ANIM_MS = 300;

// Spreads each letter's flight across its phase so the word reads as a wave
// instead of every letter moving in lockstep.
function letterDelaySeconds(mode: 'enter' | 'exit', index: number, total: number) {
  const staggerWindow = TITLE_PHASE_MS - LETTER_ANIM_MS;
  const withinPhaseMs = total <= 1 ? 0 : (staggerWindow * index) / (total - 1);
  const phaseOffsetMs = mode === 'exit' ? 0 : TITLE_PHASE_MS;
  return (phaseOffsetMs + withinPhaseMs) / 1000;
}

function titleLetterAnimation(mode: 'enter' | 'exit', index: number, total: number) {
  // "both" (not just "forwards") backward-fills the "from" keyframe during
  // the pre-animation delay — without it, an entering letter sits at the
  // browser's default opacity:1 for its whole delay and shows up early,
  // overlapping the still-exiting letters it's supposed to wait out.
  return `${mode === 'exit' ? 'letterExitUp' : 'letterEnterUp'} ${LETTER_ANIM_MS}ms ${
    mode === 'exit' ? 'ease-in' : 'ease-out'
  } ${letterDelaySeconds(mode, index, total)}s both`;
}

// Each word lays out its own letters normally (tight, real glyph spacing) —
// pairing old/new letters by index instead would force every slot to the
// width of whichever letter is wider, padding out the shorter one and
// reading as extra gaps between letters.
function TitleWord({ text, mode }: { text: string; mode: 'enter' | 'exit' }) {
  const chars = text.split('');
  return (
    <>
      {chars.map((char, i) => (
        <span
          key={i}
          className="inline-block"
          style={{ animation: titleLetterAnimation(mode, i, chars.length) }}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </>
  );
}

// The old and new words are two independent layers sharing one grid cell —
// the cell sizes itself to the wider word (so the shorter one never gets
// clipped or forces a collapse) while each word keeps its own natural
// letter spacing. They never visually mix because exit finishes before
// enter starts.
function TitleTransition({ currentText, exitingText }: { currentText: string; exitingText: string | null }) {
  return (
    <span className="relative inline-grid">
      <span style={{ gridArea: '1 / 1' }}>
        <TitleWord text={currentText} mode="enter" />
      </span>
      {exitingText !== null && (
        <span style={{ gridArea: '1 / 1' }}>
          <TitleWord text={exitingText} mode="exit" />
        </span>
      )}
    </span>
  );
}

const imperialScript = Imperial_Script({
  subsets: ['vietnamese'],
  weight: '400',
  display: 'swap',
});

const notoSerif = Noto_Serif({
  subsets: ['vietnamese'],
  weight: '700',
  style: 'italic',
  display: 'swap',
});

// "Châu Quang" and "MINH" both slide in from off-screen left once the
// loading screen is gone (not on Hero's own mount — Hero mounts underneath
// the loading overlay, long before it's visible, so timing off mount meant
// the entrance had already finished by the time the overlay faded out).
// Opacity is paired with the offset (not just relying on translateX
// clearing the viewport) so there's no chance of either peeking at the
// left edge before the entrance actually fires. MINH's transition-delay
// makes it lag slightly behind on the way in.
//
// Both then track scroll position directly — scrolling down nudges them
// further right, scrolling back up pulls them back — rather than a
// one-shot animation, so it reverses in lockstep with the user's scroll
// direction. MINH uses a smaller factor/max than the name, so it travels a
// shorter distance overall — which also means that scrolling back up, it
// has less ground to cover and settles back to rest sooner.
const NAME_ENTRANCE_MS = 1000;
const MINH_ENTRANCE_DELAY_MS = 180;
const NAME_SCROLL_FACTOR = 0.8;
const NAME_SCROLL_MAX_PX = 480;
const MINH_SCROLL_FACTOR = 0.5;
const MINH_SCROLL_MAX_PX = 300;
// The job title and portrait slider don't slide — they just fade in on
// entrance, then fade out as the user scrolls the hero out of view, and
// back in on the way up (opacity is a direct function of scrollY, same
// reversible-with-scroll approach as the name's position).
const CONTENT_FADE_SCROLL_PX = 400;

export default function Hero({ titles, sliderImages }: { titles: string[]; sliderImages: string[] }) {
  const particlesInit = async (engine: Engine) => {
    await loadSlim(engine);
  };

  const { isLoading } = useLoading();
  const [nameHasEntered, setNameHasEntered] = useState(false);
  // Flips slightly after nameHasEntered — used only to drop MINH's
  // transition-delay once its delayed entrance has actually played out, so
  // it doesn't also lag behind on every later scroll-driven update.
  const [minhHasEntered, setMinhHasEntered] = useState(false);
  const [nameScrollOffset, setNameScrollOffset] = useState(0);
  const [minhScrollOffset, setMinhScrollOffset] = useState(0);
  const [contentFadeOpacity, setContentFadeOpacity] = useState(1);

  useEffect(() => {
    if (isLoading) return;
    const raf = requestAnimationFrame(() => setNameHasEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [isLoading]);

  useEffect(() => {
    if (!nameHasEntered) return;
    const t = setTimeout(() => setMinhHasEntered(true), MINH_ENTRANCE_DELAY_MS);
    return () => clearTimeout(t);
  }, [nameHasEntered]);

  useOnScroll(
    useCallback(() => {
      setNameScrollOffset(Math.min(window.scrollY * NAME_SCROLL_FACTOR, NAME_SCROLL_MAX_PX));
      setMinhScrollOffset(Math.min(window.scrollY * MINH_SCROLL_FACTOR, MINH_SCROLL_MAX_PX));
      setContentFadeOpacity(Math.max(0, 1 - window.scrollY / CONTENT_FADE_SCROLL_PX));
    }, [])
  );

  const [titleIndex, setTitleIndex] = useState(0);
  const [exitingTitleIndex, setExitingTitleIndex] = useState<number | null>(null);
  const titleIndexRef = useRef(titleIndex);

  useEffect(() => {
    titleIndexRef.current = titleIndex;
  }, [titleIndex]);

  useEffect(() => {
    if (titles.length < 2) return;
    let holdTimer: ReturnType<typeof setTimeout>;
    let transitionTimer: ReturnType<typeof setTimeout>;

    const scheduleHold = () => {
      holdTimer = setTimeout(() => {
        const current = titleIndexRef.current;
        setExitingTitleIndex(current);
        setTitleIndex((current + 1) % titles.length);

        transitionTimer = setTimeout(() => {
          setExitingTitleIndex(null);
          scheduleHold();
        }, TITLE_TRANSITION_MS);
      }, TITLE_HOLD_MS);
    };

    scheduleHold();
    return () => {
      clearTimeout(holdTimer);
      clearTimeout(transitionTimer);
    };
  }, [titles.length]);

  return (
    <section
      id="hero"
      className="relative w-full min-h-dvh flex items-center justify-center text-[var(--text-primary)]"
      style={{
        clipPath: 'inset(0)',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom right, var(--hero-gradient-from), var(--hero-gradient-via), var(--hero-gradient-to))',
      }}
    >
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none" style={{ clipPath: 'inset(0)' }}>
        <div className="absolute inset-0 w-full h-full particles-wrapper">
          <ParticlesProvider init={particlesInit}>
            <Particles id="tsparticles" options={particlesConfig} />
          </ParticlesProvider>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ backgroundColor: 'var(--hero-glow-1)' }}></div>
        <div className="absolute bottom-0 -right-4 w-72 h-72 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ backgroundColor: 'var(--hero-glow-2)' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite', backgroundColor: 'var(--hero-glow-3)' }}></div>
      </div>

      <div className="relative z-10 w-full min-h-dvh flex flex-col items-start px-6 sm:px-10 md:px-16 xl:px-24 2xl:px-32 pt-24 sm:pt-28 md:pt-32">
        <h1
          className="leading-tight font-bold"
          style={{
            fontSize: 'clamp(4rem, 12vw, 11rem)',
            textShadow: 'var(--hero-text-shadow)',
          }}
        >
          <span
            className={`${imperialScript.className} block text-[var(--accent-text)]`}
            style={{
              fontSize: 'clamp(6rem, 18vw, 16rem)',
              lineHeight: 0.7,
              transform: `translateX(${nameHasEntered ? `${nameScrollOffset}px` : '-70vw'})`,
              opacity: nameHasEntered ? 1 : 0,
              transition: `transform ${NAME_ENTRANCE_MS}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${NAME_ENTRANCE_MS}ms ease-out`,
            }}
          >
            Châu Quang
          </span>
          <span
            className="hero-minh-wrap relative inline-block group"
            style={{
              transform: `translateX(${nameHasEntered ? `${minhScrollOffset}px` : '-70vw'})`,
              opacity: nameHasEntered ? 1 : 0,
              transition: minhHasEntered
                ? `transform ${NAME_ENTRANCE_MS}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${NAME_ENTRANCE_MS}ms ease-out`
                : `transform ${NAME_ENTRANCE_MS}ms cubic-bezier(0.16, 1, 0.3, 1) ${MINH_ENTRANCE_DELAY_MS}ms, opacity ${NAME_ENTRANCE_MS}ms ease-out ${MINH_ENTRANCE_DELAY_MS}ms`,
            }}
          >
            <span className={`${notoSerif.className} hero-minh-gradient hero-minh-slit font-bold italic`}>
              MINH
            </span>
            <span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex w-max items-center justify-center whitespace-nowrap bg-transparent pointer-events-none [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-500 delay-0 ease-out group-hover:[clip-path:inset(0_0%_0_0)] group-hover:delay-500"
              style={{ height: '0.2em' }}
            >
              <span className="font-courier not-italic normal-case tracking-[0.3em] text-sm sm:text-base md:text-lg text-[var(--text-primary)]">
                marcus
              </span>
            </span>
          </span>
        </h1>
        <div
          style={{
            opacity: nameHasEntered ? contentFadeOpacity : 0,
            transition: `opacity ${CONTENT_FADE_MS}ms ease`,
          }}
        >
          {titles.length > 0 && (
            <div
              key={titleIndex}
              className="relative -mt-2 sm:-mt-3 md:-mt-4 overflow-hidden font-nunito font-semibold tracking-wide text-[var(--text-secondary)] flex"
              style={{ fontSize: 'clamp(1.25rem, 3vw, 2rem)' }}
              aria-hidden="true"
            >
              <TitleTransition
                currentText={titles[titleIndex]}
                exitingText={exitingTitleIndex !== null ? titles[exitingTitleIndex] : null}
              />
            </div>
          )}
          {titles.length > 0 && <span className="sr-only">{titles[titleIndex]}</span>}
        </div>
      </div>

      <PortraitSlider
        images={sliderImages}
        hasEntered={nameHasEntered}
        fadeOpacity={contentFadeOpacity}
      />
    </section>
  );
}

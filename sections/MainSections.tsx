'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import SectionTag from '@/components/ui/SectionTag';
import { Localized, PhoneAppItem, ProjectItem } from '@/types/content';
import About from '@/sections/About';
import Projects from '@/sections/Projects';
import Experience from '@/sections/Experience';
import { useOnScroll } from '@/hooks/useOnScroll';

// About, Projects and Experience used to be three independently-scrolling
// sections, each owning its own SectionTag. They're now one continuous
// pinned sequence sharing a single tag: it types "About" in, erases it and
// types "Projects" in as About hands off (screen stays put throughout —
// only opacity changes), then Projects gets its own pin where the grid
// fades/rises into place in one frame (no scrolling past it), then erases
// again and types "Experience" back in across the trailing spacer before
// releasing into Experience's own pin — a vertical timeline on the left
// with a crossfading company info/image panel on the right, screen and tag
// held still throughout while scroll drives which entry is active (see
// Experience.tsx). Contact, right after, is unaffected — it keeps its own
// independent local tag exactly as before.

// About's pinned reveal (phone rising, everything fading in) plays out over
// this many pixels of scroll once the pin engages.
const REVEAL_SCROLL_PX = 700;
// The pin then holds for this much *extra* scroll after the reveal is done,
// so a fast/flung scroll can't outrun it and hand off mid-animation.
const PIN_HOLD_PX = 200;
// After the hold, the pin stays put for this much further scroll while
// About crossfades into Projects — the tag erases "About" then types
// "Projects" back in, so the handoff reads as one terminal "erase, then
// retype" rather than Projects scrolling up from below.
const EXIT_SCROLL_PX = 350;
// Projects' pin engages right as the tag finishes typing back in — this
// holds the (still-empty) grid on screen for a bit before the reveal
// starts, so the handoff doesn't feel like the cards are yanked into view.
const PROJECTS_ENTRY_HOLD_PX = 80;
// The grid cards fade/rise into view over this many pixels once the entry
// hold is done — mirrors About's REVEAL_SCROLL_PX. The grid has to fit one
// viewport since there's no scroll room to reveal cards below the fold.
const PROJECTS_REVEAL_PX = 500;
// Same idea as PIN_HOLD_PX — holds the fully-revealed grid on screen for a
// bit of extra scroll before releasing into the exit spacer below.
const PROJECTS_PIN_HOLD_PX = 200;
// Trailing spacer before Experience: screen holds while the shared tag
// erases "Projects" then types "Experience" back in, before releasing into
// Experience's own pin below. Unlike the pin wrappers above, this spacer
// isn't sticky — it's pure scroll budget for the tag animation, not a
// viewport to hold in place — so its height is just this value, with no
// extra 100dvh. (An earlier version padded it by 100dvh, which left a
// content-less, tag-less dead zone between the tag finishing "Experience"
// and Experience's own pin engaging.)
const PROJECTS_EXIT_SCROLL_PX = 500;
// Experience's pin engages right as its tag finishes typing in. Unlike
// PROJECTS_ENTRY_HOLD_PX (a plain pause), this window doubles as the rail's
// slide-in-from-left scroll budget (see Experience's entryProgress), so it
// needs to be wide enough to actually read as scroll-linked motion rather
// than a snap — a couple hundred pixels, not a handful.
const EXPERIENCE_ENTRY_HOLD_PX = 400;
// The timeline crossfades through every entry over this many pixels once
// the entry hold is done — a fixed total budget regardless of item count
// (more entries just means a faster crossfade per entry), same convention
// as PROJECTS_REVEAL_PX.
const EXPERIENCE_REVEAL_PX = 900;
// Holds the fully-traversed (last entry) state on screen for a bit of extra
// scroll before releasing into Contact — same idea as PROJECTS_PIN_HOLD_PX.
const EXPERIENCE_PIN_HOLD_PX = 200;

const ABOUT_TAG: Localized = { en: 'About', vi: 'GioiThieu' };
const PROJECTS_TAG: Localized = { en: 'Projects', vi: 'DuAn' };
const EXPERIENCE_TAG: Localized = { en: 'Experience', vi: 'KinhNghiem' };

// Admin-managed via the DB (see lib/site-content.ts) — passed down from
// app/page.tsx, then handed straight to About.
interface MainSectionsProps {
  aboutIntro: Localized[];
  aboutApps: PhoneAppItem[];
  projectItems: ProjectItem[];
}

export default function MainSections({ aboutIntro, aboutApps, projectItems }: MainSectionsProps) {
  const aboutPinRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [exitProgress, setExitProgress] = useState(0);

  const projectsPinRef = useRef<HTMLDivElement>(null);
  const [projectsProgress, setProjectsProgress] = useState(0);

  const projectsExitPinRef = useRef<HTMLDivElement>(null);
  const [projectsExitProgress, setProjectsExitProgress] = useState(0);

  const experiencePinRef = useRef<HTMLDivElement>(null);
  const [experienceProgress, setExperienceProgress] = useState(0);
  // 0 -> 1 over just the EXPERIENCE_ENTRY_HOLD_PX stretch (before
  // experienceProgress itself starts climbing) — drives the timeline rail's
  // one-shot slide-in from the left as Experience's pin engages, separately
  // from experienceProgress's job of driving the entry-to-entry crossfade.
  const [experienceEntryProgress, setExperienceEntryProgress] = useState(0);
  // True for exactly as long as the Experience pin is engaged (its wrapper
  // covers the viewport) — used to keep the shared tag shown at full
  // "Experience" for the whole pin, then hide it once Contact takes over.
  const [experienceActive, setExperienceActive] = useState(false);

  // The pin's default extra-scroll budget only leaves PROJECTS_PIN_HOLD_PX
  // of slack for `position: sticky` to keep the grid pinned once revealed.
  // If the grid ends up taller than the viewport (more projects than fit
  // on one screen), that slack isn't enough — sticky runs out of room and
  // the cards start scrolling away mid-reveal instead of settling first.
  // This measures the actual rendered grid and pads the budget by however
  // much it overflows the viewport, so the reveal always finishes (and
  // holds) while still properly pinned, no matter how many projects there
  // are.
  const projectsContentRef = useRef<HTMLDivElement>(null);
  const [projectsExtraPx, setProjectsExtraPx] = useState(
    PROJECTS_ENTRY_HOLD_PX + PROJECTS_REVEAL_PX + PROJECTS_PIN_HOLD_PX
  );

  useEffect(() => {
    const contentEl = projectsContentRef.current;
    if (!contentEl) return;

    const recomputeExtraPx = () => {
      const overflowPx = Math.max(0, contentEl.offsetHeight - window.innerHeight);
      setProjectsExtraPx(PROJECTS_ENTRY_HOLD_PX + PROJECTS_REVEAL_PX + PROJECTS_PIN_HOLD_PX + overflowPx);
    };

    recomputeExtraPx();
    const observer = new ResizeObserver(recomputeExtraPx);
    observer.observe(contentEl);
    window.addEventListener('resize', recomputeExtraPx);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', recomputeExtraPx);
    };
  }, []);

  const handleScroll = useCallback(() => {
    const aboutEl = aboutPinRef.current;
    if (aboutEl) {
      const scrollPx = -aboutEl.getBoundingClientRect().top;
      setProgress(Math.max(0, Math.min(1, scrollPx / REVEAL_SCROLL_PX)));
      setExitProgress(Math.max(0, Math.min(1, (scrollPx - REVEAL_SCROLL_PX - PIN_HOLD_PX) / EXIT_SCROLL_PX)));
    }

    const projectsEl = projectsPinRef.current;
    if (projectsEl) {
      const scrollPx = -projectsEl.getBoundingClientRect().top;
      setProjectsProgress(Math.max(0, Math.min(1, (scrollPx - PROJECTS_ENTRY_HOLD_PX) / PROJECTS_REVEAL_PX)));
    }

    const projectsExitEl = projectsExitPinRef.current;
    if (projectsExitEl) {
      const scrollPx = -projectsExitEl.getBoundingClientRect().top;
      setProjectsExitProgress(Math.max(0, Math.min(1, scrollPx / PROJECTS_EXIT_SCROLL_PX)));
    }

    const experienceEl = experiencePinRef.current;
    if (experienceEl) {
      const rect = experienceEl.getBoundingClientRect();
      const scrollPx = -rect.top;
      setExperienceEntryProgress(Math.max(0, Math.min(1, scrollPx / EXPERIENCE_ENTRY_HOLD_PX)));
      setExperienceProgress(Math.max(0, Math.min(1, (scrollPx - EXPERIENCE_ENTRY_HOLD_PX) / EXPERIENCE_REVEAL_PX)));
      setExperienceActive(rect.top <= 0 && rect.bottom > 0);
    }
  }, []);

  // Shared scroll source (see useOnScroll) doesn't invoke the callback on
  // subscribe, so this section still needs its own initial computation on
  // mount — otherwise progress stays at its default 0 until the first
  // scroll event, even if the page loads already mid-scroll (e.g. an
  // anchor-link navigation or a scroll-position restore).
  useEffect(() => {
    handleScroll();
  }, [handleScroll]);

  useOnScroll(handleScroll);

  // Exit crossfade splits into two halves: first About's tag erases and its
  // content fades out (eraseProgress), then the Projects tag types back in
  // (typeInProgress). Both stay scroll-scrubbed off exitProgress so the
  // whole thing reverses cleanly on scroll-up.
  const eraseProgress = Math.max(0, Math.min(1, exitProgress / 0.5));
  const typeInProgress = Math.max(0, Math.min(1, (exitProgress - 0.5) / 0.5));

  // Same erase-then-type split as above, but for the trailing Projects ->
  // Experience handoff: "Projects" erases across the first half of the
  // exit spacer, then "Experience" types back in across the second half —
  // Experience no longer types its own tag in independently, it just
  // renders the already-fully-typed result once this crossfade lands it.
  const projectsEraseProgress = Math.max(0, Math.min(1, projectsExitProgress / 0.5));
  const experienceTypeInProgress = Math.max(0, Math.min(1, (projectsExitProgress - 0.5) / 0.5));

  // Background tint: fades in across the whole About->Projects crossfade
  // (tracking exitProgress), holds through the Projects pin, then fades
  // back out across the trailing spacer as Projects hands off to
  // Experience (tracking projectsExitProgress) — same reversible,
  // scroll-scrubbed approach as the rest of this handoff.
  const projectsBgTint = projectsExitProgress > 0 ? 1 - projectsExitProgress : exitProgress;

  let tagName: Localized | null = null;
  let tagProps: { active?: boolean; progressOverride?: number } = {};
  if (progress > 0 && exitProgress === 0) {
    tagName = ABOUT_TAG;
    tagProps = { active: true };
  } else if (exitProgress > 0 && exitProgress < 0.5) {
    tagName = ABOUT_TAG;
    tagProps = { progressOverride: 1 - eraseProgress };
  } else if (exitProgress >= 0.5 && projectsExitProgress === 0) {
    tagName = PROJECTS_TAG;
    tagProps = { progressOverride: typeInProgress };
  } else if (projectsExitProgress > 0 && projectsExitProgress < 0.5) {
    tagName = PROJECTS_TAG;
    tagProps = { progressOverride: 1 - projectsEraseProgress };
  } else if (projectsExitProgress >= 0.5 && projectsExitProgress < 1) {
    tagName = EXPERIENCE_TAG;
    tagProps = { progressOverride: experienceTypeInProgress };
  } else if (experienceActive && experienceProgress < 1) {
    // Stops short of the trailing PIN_HOLD_PX stretch — once the last entry
    // is fully reached, the tag drops instead of staying anchored while the
    // hold plays out, so it doesn't feel glued to the screen while nothing
    // about the tag itself is still transitioning.
    tagName = EXPERIENCE_TAG;
    tagProps = { progressOverride: 1 };
  }

  return (
    <>
      {/* Background tint layer: sits behind every section here (z-0, while
          the sections themselves are z-10) so it can wash the whole
          viewport without disturbing Hero/Contact above and below, which
          never see it since its opacity is 0 outside this range. */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ backgroundColor: 'var(--background-projects)', opacity: projectsBgTint }}
      />

      {/* Top vignette: once Projects' pin releases and the overflow rows
          scroll normally (see projectsExtraPx above), cards pass directly
          under the tag/navbar instead of staying pinned below them — this
          blurs and fades them out as they approach that zone so card text
          never visually collides with the tag. The tag sits at top-24
          (96px) — the mask holds full blur strength past that point
          (0-65% of the box) before tapering off, so the blur has actually
          kicked in by the time content reaches the tag instead of already
          fading out there. mask-image fades the blur itself, not just a
          flat color, since the navbar is a translucent floating pill
          rather than a solid bar. Opacity is tied to projectsBgTint (same
          signal as the background wash) so it's only present for Projects
          — invisible during About and Experience/Contact. */}
      <div
        className="fixed inset-x-0 top-0 h-52 z-20 pointer-events-none"
        style={{
          opacity: projectsBgTint,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 65%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 65%, transparent 100%)',
        }}
      />

      {/* The one shared tag: viewport-fixed so it stays in the same spot
          whether About's pin, the crossfade, or Projects' pin is
          underneath it. */}
      {tagName && (
        <div className="fixed inset-0 z-30 pointer-events-none">
          <div className="relative h-full max-w-6xl 2xl:max-w-7xl mx-auto px-6">
            <SectionTag name={tagName} topClassName="top-24" {...tagProps} />
          </div>
        </div>
      )}

      <section id="about" className="relative z-10">
        <div ref={aboutPinRef} style={{ height: `calc(100dvh + ${REVEAL_SCROLL_PX + PIN_HOLD_PX + EXIT_SCROLL_PX}px)` }}>
          <div className="sticky top-0 pt-40 pb-20 px-6 max-w-6xl 2xl:max-w-7xl mx-auto">
            <About progress={progress} eraseProgress={eraseProgress} intro={aboutIntro} phoneApps={aboutApps} />
          </div>
        </div>
      </section>

      <section id="projects" className="relative z-10">
        <div ref={projectsPinRef} style={{ height: `calc(100dvh + ${projectsExtraPx}px)` }}>
          {/* pt-[25vh] (not a fixed px value like About's pt-40) so the
              first row lands at a fixed fraction of the viewport regardless
              of screen height, matching where the reveal animation settles. */}
          <div ref={projectsContentRef} className="sticky top-0 pt-[25vh] pb-20 px-6 max-w-6xl 2xl:max-w-7xl mx-auto">
            <Projects progress={projectsProgress} items={projectItems} />
          </div>
        </div>
      </section>

      {/* Blank spacer: holds scroll while the shared fixed tag erases
          "Projects" and types "Experience" back in, before releasing into
          Experience's own pin below. */}
      <div ref={projectsExitPinRef} style={{ height: `${PROJECTS_EXIT_SCROLL_PX}px` }} />

      <section id="experience" className="relative z-10">
        <div
          ref={experiencePinRef}
          style={{ height: `calc(100dvh + ${EXPERIENCE_ENTRY_HOLD_PX + EXPERIENCE_REVEAL_PX + EXPERIENCE_PIN_HOLD_PX}px)` }}
        >
          <div className="sticky top-0 pt-40 pb-20 px-6 max-w-6xl 2xl:max-w-7xl mx-auto">
            <Experience progress={experienceProgress} entryProgress={experienceEntryProgress} />
          </div>
        </div>
      </section>
    </>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { siteContent } from '@/content/site-content';
import { useLanguage } from '@/components/providers/LanguageProvider';
import SectionTag from '@/components/ui/SectionTag';
import PhoneVisual from '@/components/ui/PhoneVisual';

// arrow.png's natural size is 856x488 — keep that ratio so the swoosh isn't stretched.
const ARROW_WIDTH = 150;
const ARROW_HEIGHT = Math.round((ARROW_WIDTH * 488) / 856);

// One shared scroll progress (0 -> 1) drives every reveal in this section:
// the phone slides up from below the viewport via translateY, everything
// else fades via opacity — same value, driven directly off scroll position
// with no CSS transition smoothing, so the visuals never lag behind where
// the math says they should be. The offset is a viewport-height fraction
// (not a fixed px amount) so the phone always starts fully off-screen below
// the fold, regardless of device.

// The section pins in place (position: sticky) once its top reaches the
// viewport top. The reveal (phone rising, everything else fading in) plays
// out over this many pixels of scroll into the pinned range — it's blank
// at the moment the pin starts and fully revealed by the time this is used up.
const REVEAL_SCROLL_PX = 700;
// The pin then holds for this much *extra* scroll after the reveal is done
// before releasing into the next section — a buffer so a fast/flung scroll
// can't outrun the reveal and hand off to the next section while it's still
// mid-animation.
const PIN_HOLD_PX = 200;

export default function About() {
  const { language } = useLanguage();
  const content = siteContent.about;
  const pinRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = pinRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      setProgress(Math.max(0, Math.min(1, -top / REVEAL_SCROLL_PX)));
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const revealStyle = { opacity: progress };

  const caption = (
    <p className="font-fuzzy-bubbles text-3xl font-bold text-yellow-500" style={revealStyle}>
      {content.phoneCaption.before[language]}
      <span className="relative isolate inline-block px-1">
        <Image src="/painting_color.png" alt="" fill sizes="150px" className="-z-10 object-fill" />
        {content.phoneCaption.highlight[language]}
      </span>
      {content.phoneCaption.after[language]}
    </p>
  );

  const intro = (
    <div className="space-y-2" style={revealStyle}>
      {content.intro.map((sentence, index) => (
        <p key={index} className="text-lg leading-relaxed text-[var(--text-secondary)]">
          {sentence[language]}
        </p>
      ))}
    </div>
  );

  const quotes = (
    <div className="space-y-6" style={revealStyle}>
      {content.quotes.map((quote) => (
        <blockquote key={quote.id} className="border-l-2 border-yellow-500/50 pl-4">
          <p className="text-base italic text-[var(--text-secondary)]">&ldquo;{quote.content[language]}&rdquo;</p>
          <footer className="mt-2 text-sm text-[var(--text-secondary)]/70">— {quote.author}</footer>
        </blockquote>
      ))}
    </div>
  );

  return (
    <section id="about" className="relative border-t border-[var(--border)]">
      <div ref={pinRef} style={{ height: `calc(100vh + ${REVEAL_SCROLL_PX + PIN_HOLD_PX}px)` }}>
        <div className="sticky top-0 pt-40 pb-20 px-6 max-w-6xl mx-auto">
          <SectionTag name={{ en: 'About', vi: 'GioiThieu' }} topClassName="top-24" active={progress > 0} />

          {/* Mobile: caption on top, phone, then intro below */}
          <div className="flex flex-col items-center text-center gap-6 md:hidden">
            {caption}
            <div style={{ transform: `translateY(${(1 - progress) * 100}vh)` }}>
              <PhoneVisual
                width={260}
                height={378}
                inset={10}
                radius={26}
                apps={content.phoneApps}
                language={language}
                phoneNumberCopiedLabel={content.phoneNumberCopiedLabel}
              />
            </div>
            {intro}
            <div className="flex w-full flex-col items-end text-left">{quotes}</div>
          </div>

          {/* Desktop: phone on the left, arrow + caption + intro on the right */}
          <div className="relative hidden items-stretch gap-16 md:flex">
            <div style={{ transform: `translateY(${(1 - progress) * 100}vh)` }}>
              <PhoneVisual
                width={440}
                height={640}
                inset={16}
                radius={44}
                apps={content.phoneApps}
                language={language}
                phoneNumberCopiedLabel={content.phoneNumberCopiedLabel}
              />
            </div>

            {/* Tail sits by the caption text; the pointed head aims back at the phone. */}
            <Image
              src="/arrow.png"
              alt=""
              width={ARROW_WIDTH}
              height={ARROW_HEIGHT}
              className="absolute pointer-events-none select-none"
              style={{
                top: '-30px',
                left: '335px',
                transform: 'rotate(-14deg)',
                transformOrigin: '6% 31%',
                opacity: progress,
              }}
            />

            <div className="flex min-w-0 flex-1 flex-col">
              <div>
                {caption}
                <div className="mt-16">{intro}</div>
              </div>
              <div className="mt-auto self-end">{quotes}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

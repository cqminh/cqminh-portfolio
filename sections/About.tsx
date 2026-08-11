'use client';

import Image from 'next/image';
import { siteContent } from '@/content/site-content';
import { useLanguage } from '@/components/providers/LanguageProvider';
import PhoneVisual from '@/components/ui/PhoneVisual';

// arrow.png's natural size is 856x488 — keep that ratio so the swoosh isn't stretched.
const ARROW_WIDTH = 150;
const ARROW_HEIGHT = Math.round((ARROW_WIDTH * 488) / 856);

interface AboutProps {
  // Scroll progress (0 -> 1) driving the phone's rise + fade-in, and the
  // mirrored fade-out as About hands off to Projects. Both are computed by
  // MainSections (which owns the pin + the shared section tag across
  // About/Projects/Experience) and just passed down here.
  progress: number;
  eraseProgress: number;
}

export default function About({ progress, eraseProgress }: AboutProps) {
  const { language } = useLanguage();
  const content = siteContent.about;

  const revealStyle = { opacity: Math.min(progress, 1 - eraseProgress) };

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

  return (
    <>
      {/* Mobile: caption on top, phone, then intro below */}
      <div className="flex flex-col items-center text-center gap-6 md:hidden">
        {caption}
        <div style={{ transform: `translateY(${(1 - progress) * 100}vh)`, opacity: revealStyle.opacity }}>
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
      </div>

      {/* Desktop: phone on the left, arrow + caption + intro on the right */}
      <div className="relative hidden items-stretch gap-16 md:flex">
        <div style={{ transform: `translateY(${(1 - progress) * 100}vh)`, opacity: revealStyle.opacity }}>
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
            opacity: revealStyle.opacity,
          }}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          {caption}
          <div className="mt-16">{intro}</div>
        </div>
      </div>
    </>
  );
}

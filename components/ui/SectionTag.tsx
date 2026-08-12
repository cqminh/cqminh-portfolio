'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Localized } from '@/types/content';

interface SectionTagProps {
  name: Localized;
  topClassName?: string;
  // The caller drives the typing trigger directly, in one of two mutually
  // exclusive ways:
  // `active` — type in/out on a fixed schedule as this flips true/false.
  active?: boolean;
  // `progressOverride` — scroll-scrubbed: displayed length is derived
  // straight from this value (0 -> 1) on every render, no timers involved.
  // Takes precedence over `active`. Used for a section's pinned exit, where
  // the tag must clear in lockstep with scroll position rather than animate
  // on a fixed schedule — so a nav jump mid-section never leaves it
  // mid-animation.
  progressOverride?: number;
}

const TYPE_SPEED_MS = 45;

export default function SectionTag({ name, topClassName = 'top-6', active, progressOverride }: SectionTagProps) {
  const { language } = useLanguage();
  const fullText = `<${name[language]} />`;

  const prevTextRef = useRef(fullText);
  const [displayedLength, setDisplayedLength] = useState(0);

  // Language switched: keep the tag fully shown if it already was, otherwise stay empty.
  useEffect(() => {
    if (progressOverride !== undefined) return;
    setDisplayedLength((prev) => {
      const wasFull = prev >= prevTextRef.current.length;
      prevTextRef.current = fullText;
      return wasFull ? fullText.length : 0;
    });
  }, [fullText, progressOverride]);

  // Externally controlled mode: type in/out as `active` flips, in lockstep
  // with whatever scroll-progress value the caller is already driving.
  useEffect(() => {
    if (progressOverride !== undefined || active === undefined) return;

    const typingIn = active;
    const id = setInterval(() => {
      setDisplayedLength((prev) => {
        const next = Math.max(0, Math.min(fullText.length, typingIn ? prev + 1 : prev - 1));
        if (next === prev) clearInterval(id);
        return next;
      });
    }, TYPE_SPEED_MS);

    return () => clearInterval(id);
  }, [active, fullText, progressOverride]);

  const renderedLength =
    progressOverride !== undefined ? Math.round(fullText.length * Math.max(0, Math.min(1, progressOverride))) : displayedLength;

  return (
    <span
      className={`absolute ${topClassName} left-6 font-courier text-xs sm:text-sm tracking-wide select-none pointer-events-none`}
      style={{ color: 'var(--success)' }}
    >
      {fullText.slice(0, renderedLength)}
      <span className="terminal-cursor" />
    </span>
  );
}

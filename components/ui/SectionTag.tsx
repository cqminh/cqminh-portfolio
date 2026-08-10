'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { Localized } from '@/types/content';

interface SectionTagProps {
  name: Localized;
  topClassName?: string;
  // When provided, the caller drives the typing trigger directly instead of
  // the internal viewport-center IntersectionObserver — lets a section sync
  // the tag with its own scroll-progress reveal (e.g. About's phone visual)
  // instead of typing in on its own schedule.
  active?: boolean;
}

const TYPE_SPEED_MS = 45;

export default function SectionTag({ name, topClassName = 'top-6', active }: SectionTagProps) {
  const { language } = useLanguage();
  const fullText = `<${name[language]} />`;

  const spanRef = useRef<HTMLSpanElement>(null);
  const directionRef = useScrollDirection();
  const observerTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevTextRef = useRef(fullText);
  const [displayedLength, setDisplayedLength] = useState(0);

  // Language switched: keep the tag fully shown if it already was, otherwise stay empty.
  useEffect(() => {
    setDisplayedLength((prev) => {
      const wasFull = prev >= prevTextRef.current.length;
      prevTextRef.current = fullText;
      return wasFull ? fullText.length : 0;
    });
  }, [fullText]);

  // Externally controlled mode: type in/out as `active` flips, in lockstep
  // with whatever scroll-progress value the caller is already driving.
  useEffect(() => {
    if (active === undefined) return;

    const typingIn = active;
    const id = setInterval(() => {
      setDisplayedLength((prev) => {
        const next = Math.max(0, Math.min(fullText.length, typingIn ? prev + 1 : prev - 1));
        if (next === prev) clearInterval(id);
        return next;
      });
    }, TYPE_SPEED_MS);

    return () => clearInterval(id);
  }, [active, fullText]);

  // Default mode: type in/out as the tag itself crosses the viewport center.
  useEffect(() => {
    if (active !== undefined) return;

    const element = spanRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        if (observerTimerRef.current) clearInterval(observerTimerRef.current);

        const typingIn = directionRef.current !== 'up';
        observerTimerRef.current = setInterval(() => {
          setDisplayedLength((prev) => {
            const next = Math.max(0, Math.min(fullText.length, typingIn ? prev + 1 : prev - 1));
            if (next === prev && observerTimerRef.current) {
              clearInterval(observerTimerRef.current);
              observerTimerRef.current = null;
            }
            return next;
          });
        }, TYPE_SPEED_MS);
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      if (observerTimerRef.current) clearInterval(observerTimerRef.current);
    };
  }, [fullText, directionRef, active]);

  return (
    <span
      ref={spanRef}
      className={`absolute ${topClassName} left-6 font-courier text-xs sm:text-sm tracking-wide select-none pointer-events-none`}
      style={{ color: 'var(--success)' }}
    >
      {fullText.slice(0, displayedLength)}
      <span className="terminal-cursor" />
    </span>
  );
}

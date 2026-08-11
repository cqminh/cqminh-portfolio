import { useCallback, useState } from 'react';
import { useOnScroll } from './useOnScroll';

// Whether the page has scrolled past `thresholdPx` — shared by any UI chrome
// that toggles visibility off a single scroll-position threshold (navbar
// pill, back-to-top button). Components that also need the live scroll
// position for their own math (e.g. CustomScrollbar's thumb drag, BackToTop's
// enter/exit state machine) subscribe via useOnScroll directly instead.
export function useScrollPast(thresholdPx: number) {
  const [isPast, setIsPast] = useState(() => typeof window !== 'undefined' && window.scrollY > thresholdPx);
  useOnScroll(useCallback(() => setIsPast(window.scrollY > thresholdPx), [thresholdPx]));
  return isPast;
}

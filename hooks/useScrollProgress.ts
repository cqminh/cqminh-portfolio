import { RefObject, useEffect, useState } from 'react';

interface ScrollProgressOptions {
  // Fraction of the viewport height where progress = 0, measured from the
  // element's top. 1 = element's top at the viewport's bottom edge.
  startVh?: number;
  // Fraction of the viewport height where progress = 1. 0.5 = element's top
  // at the viewport's vertical middle.
  endVh?: number;
}

// Continuous, reversible scroll-linked progress (0 -> 1) based on how far an
// element's top has traveled between startVh and endVh. Recomputed on every
// scroll event and clamped, so it settles once fully in and unwinds smoothly
// on the way back out — same approach as Hero's scroll-driven offsets.
export function useScrollProgress(ref: RefObject<HTMLElement | null>, { startVh = 1, endVh = 0.5 }: ScrollProgressOptions = {}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = ref.current;
      if (!el) return;
      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top;
      const raw = (startVh * vh - top) / ((startVh - endVh) * vh);
      setProgress(Math.max(0, Math.min(1, raw)));
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref, startVh, endVh]);

  return progress;
}

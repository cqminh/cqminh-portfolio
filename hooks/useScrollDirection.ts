import { useCallback, useEffect, useRef } from 'react';
import { useOnScroll } from './useOnScroll';

export type ScrollDirection = 'up' | 'down';

// `enabled` lets a caller that only sometimes needs direction tracking (see
// SectionTag, which only reads this in its default IntersectionObserver
// mode) skip the tracking work entirely otherwise, instead of paying for it
// when the result never gets read.
export const useScrollDirection = (enabled = true) => {
  const directionRef = useRef<ScrollDirection>('down');
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (enabled) lastScrollY.current = window.scrollY;
  }, [enabled]);

  useOnScroll(
    useCallback(() => {
      if (!enabled) return;
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        directionRef.current = 'down';
      } else if (currentScrollY < lastScrollY.current) {
        directionRef.current = 'up';
      }
      lastScrollY.current = currentScrollY;
    }, [enabled])
  );

  return directionRef;
};

import { useEffect, useRef } from 'react';

export type ScrollDirection = 'up' | 'down';

export const useScrollDirection = () => {
  const directionRef = useRef<ScrollDirection>('down');
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        directionRef.current = 'down';
      } else if (currentScrollY < lastScrollY.current) {
        directionRef.current = 'up';
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return directionRef;
};

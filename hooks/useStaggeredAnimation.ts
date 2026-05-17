import { useEffect, useRef, useState } from 'react';

export const useStaggeredAnimation = (itemCount: number = 1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return {
    ref,
    isVisible,
    getItemStyle: (index: number) => ({
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0px)' : 'translateY(30px)',
      transition: `all 0.6s ease-out ${index * 0.1}s`,
    }),
  };
};

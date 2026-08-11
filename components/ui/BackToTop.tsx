'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';
import GlassButton from './GlassButton';
import { useOnScroll } from '@/hooks/useOnScroll';

// How long the slide-out animation plays before the button actually
// unmounts — has to match the keyframe's own duration below, otherwise it
// either unmounts mid-slide or lingers invisible after finishing.
const HIDE_DELAY_MS = 2000;

export default function BackToTop() {
  const isInitiallyAtTop = typeof window === 'undefined' || window.scrollY === 0;
  const [shouldRender, setShouldRender] = useState(!isInitiallyAtTop);
  const [isAnimatingIn, setIsAnimatingIn] = useState(!isInitiallyAtTop);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useOnScroll(
    useCallback(() => {
      const isAtTop = window.scrollY === 0;
      if (!isAtTop) {
        setShouldRender(true);
        setIsAnimatingIn(true);
        setIsAnimatingOut(false);
      } else {
        setIsAnimatingIn(false);
        setIsAnimatingOut(true);
      }
    }, [])
  );

  useEffect(() => {
    if (isAnimatingOut) {
      const timer = setTimeout(() => setShouldRender(false), HIDE_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [isAnimatingOut]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!shouldRender) return null;

  return (
    <GlassButton
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 overflow-hidden"
      style={{
        animation: isAnimatingIn
          ? 'slideInBackToTop 2s var(--ease-bounce) forwards'
          : 'slideOutBackToTop 2s var(--ease-bounce) forwards',
      }}
      aria-label="Back to top"
    >
      <div className="relative w-5 h-5 overflow-hidden">
        {/* Primary arrow - moves up on hover */}
        <ArrowUp className="absolute inset-0 w-5 h-5 text-[var(--text-primary)] transition-transform duration-300 ease-out group-hover:-translate-y-full" />
        {/* Secondary arrow - comes from below on hover */}
        <ArrowUp className="absolute inset-0 w-5 h-5 text-[var(--text-primary)] transition-transform duration-300 ease-out translate-y-full group-hover:translate-y-0" />
      </div>

      <style>{`
        @keyframes slideInBackToTop {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideOutBackToTop {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(20px);
            opacity: 0;
          }
        }
      `}</style>
    </GlassButton>
  );
}

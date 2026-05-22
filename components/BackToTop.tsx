'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const handleScroll = useCallback(() => {
    const isAtTop = window.scrollY === 0;

    if (!isAtTop) {
      setShouldRender(true);
      setIsAnimatingIn(true);
      setIsAnimatingOut(false);
    } else {
      setIsAnimatingIn(false);
      setIsAnimatingOut(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (isAnimatingOut) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAnimatingOut]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!shouldRender) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-[rgba(255,255,255,0.2)] dark:bg-[rgba(17,24,39,0.2)] backdrop-blur-[12px] hover:bg-[rgba(255,255,255,0.3)] dark:hover:bg-[rgba(17,24,39,0.3)] border border-[var(--nav-border)] transition-all duration-300 transform hover:scale-110 flex items-center justify-center group overflow-hidden"
      style={{
        boxShadow: '0 8px 16px var(--shadow-lg), inset 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 -2px 4px rgba(0, 0, 0, 0.05)',
        animation: isAnimatingIn
          ? 'slideInBackToTop 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
          : isAnimatingOut
          ? 'slideOutBackToTop 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
          : 'none',
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
    </button>
  );
}

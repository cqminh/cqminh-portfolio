'use client';

import { useState, useEffect, useRef, type CSSProperties } from 'react';
import { Sun, Moon, SunMoon, X } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';
import { useLanguage } from '../providers/LanguageProvider';
import GlassButton from './GlassButton';

// Vertical spacing between stacked buttons (button height + gap), in px.
const STACK_OFFSET = 56;

const THEME_CYCLE = ['auto', 'light', 'dark'] as const;

export default function FloatingSettingsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  const close = () => {
    setIsOpen(false);
    setIsAnimatingOut(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isOpen) close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleOpen = () => {
    if (isOpen) {
      close();
    } else {
      setShouldRender(true);
      setIsOpen(true);
      setIsAnimatingOut(false);
    }
  };

  useEffect(() => {
    if (isAnimatingOut) {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isAnimatingOut]);

  const cycleTheme = () => {
    const next = THEME_CYCLE[(THEME_CYCLE.indexOf(theme) + 1) % THEME_CYCLE.length];
    setTheme(next);
  };

  const themeIcon =
    theme === 'auto' ? <SunMoon className="w-4 h-4" /> : theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />;

  return (
    <div ref={containerRef} className="fixed bottom-6 left-6 z-50">
      <GlassButton onClick={toggleOpen}>
        <svg
          className="w-5 h-5 text-[var(--text-primary)] transition-transform duration-300 group-hover:rotate-90"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </GlassButton>

      {shouldRender && (
        <>
          {/* Theme toggle — closest to the settings button */}
          <div
            className="absolute bottom-0 left-0"
            style={{
              '--offset': `${STACK_OFFSET}px`,
              animation: isAnimatingOut
                ? 'stackBounceOut 0.3s ease-in forwards'
                : 'stackBounceIn 0.35s ease-out forwards',
              animationDelay: isAnimatingOut ? '60ms' : '0ms',
            } as CSSProperties}
          >
            <GlassButton onClick={cycleTheme} title={`Theme: ${theme}`}>
              <span className="text-[var(--text-primary)]">{themeIcon}</span>
            </GlassButton>
          </div>

          {/* Language toggle — middle */}
          <div
            className="absolute bottom-0 left-0"
            style={{
              '--offset': `${STACK_OFFSET * 2}px`,
              animation: isAnimatingOut
                ? 'stackBounceOut 0.3s ease-in forwards'
                : 'stackBounceIn 0.35s ease-out forwards',
              animationDelay: isAnimatingOut ? '30ms' : '60ms',
            } as CSSProperties}
          >
            <GlassButton
              onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
              title="Language"
            >
              <span className="text-[11px] font-bold tracking-tight text-[var(--text-primary)]">
                {language === 'en' ? 'EN' : 'VI'}
              </span>
            </GlassButton>
          </div>

          {/* Close — topmost */}
          <div
            className="absolute bottom-0 left-0"
            style={{
              '--offset': `${STACK_OFFSET * 3}px`,
              animation: isAnimatingOut
                ? 'stackBounceOut 0.3s ease-in forwards'
                : 'stackBounceIn 0.35s ease-out forwards',
              animationDelay: isAnimatingOut ? '0ms' : '120ms',
            } as CSSProperties}
          >
            <GlassButton
              onClick={close}
              title="Close"
              className="close-btn"
              style={{ borderColor: 'rgba(239,68,68,0.35)' }}
            >
              <X className="w-4 h-4 text-[var(--error)]" />
            </GlassButton>
          </div>
        </>
      )}

      <style jsx>{`
        .close-btn {
          background: rgba(239, 68, 68, 0.15);
        }
        .close-btn:hover {
          background: rgba(239, 68, 68, 0.28);
        }
        .close-btn:active {
          background: rgba(239, 68, 68, 0.45);
        }

        @keyframes stackBounceIn {
          0% {
            transform: translateY(0) scale(0.3);
            opacity: 0;
          }
          65% {
            transform: translateY(calc(-1 * var(--offset) - 12px)) scale(1.08);
            opacity: 1;
          }
          100% {
            transform: translateY(calc(-1 * var(--offset))) scale(1);
            opacity: 1;
          }
        }

        @keyframes stackBounceOut {
          0% {
            transform: translateY(calc(-1 * var(--offset))) scale(1);
            opacity: 1;
          }
          35% {
            transform: translateY(calc(-1 * var(--offset) - 10px)) scale(1.05);
            opacity: 1;
          }
          100% {
            transform: translateY(0) scale(0.3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

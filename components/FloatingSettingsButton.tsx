'use client';

import { useState, useEffect, useRef } from 'react';
import { Sun, Moon, SunMoon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';

export default function FloatingSettingsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isOpen) {
          setIsOpen(false);
          setIsAnimatingIn(false);
          setIsAnimatingOut(true);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleOpen = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsAnimatingIn(false);
      setIsAnimatingOut(true);
    } else {
      setShouldRender(true);
      setIsOpen(true);
      setIsAnimatingIn(true);
      setIsAnimatingOut(false);
    }
  };

  useEffect(() => {
    if (isAnimatingOut) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isAnimatingOut]);

  return (
    <div ref={containerRef} className="fixed bottom-6 left-6 z-50">
      <button
        onClick={toggleOpen}
        className="relative w-10 h-10 rounded-full bg-[rgba(255,255,255,0.2)] dark:bg-[rgba(17,24,39,0.2)] backdrop-blur-[12px] hover:bg-[rgba(255,255,255,0.3)] dark:hover:bg-[rgba(17,24,39,0.3)] border border-[var(--nav-border)] transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
        style={{
          boxShadow: '0 8px 16px var(--shadow-lg), inset 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 -2px 4px rgba(0, 0, 0, 0.05)'
        }}
      >
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
      </button>

      {shouldRender && (
        <div
          className="absolute bottom-12 left-0 bg-[var(--card-bg)]/60 backdrop-blur-[12px] rounded-xl shadow-2xl p-3 border border-[var(--card-border)]"
          style={{
            animation: isAnimatingIn
              ? 'expandFromButton 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
              : isAnimatingOut
              ? 'collapseToButton 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
              : 'none',
            transformOrigin: 'bottom left',
            transformBox: 'fill-box',
            width: '220px'
          }}
        >
          <nav className="flex flex-col gap-3">
            {/* Language */}
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-2">Language</label>
              <button
                onClick={() => setLanguage(language === 'en' ? 'vi' : 'en')}
                className="w-full mt-2 px-3 py-2 bg-[var(--card-bg)] hover:bg-[var(--card-bg-hover)] text-[var(--text-primary)] rounded-lg transition-all duration-150 font-medium text-sm border border-[var(--card-border)]"
              >
                {language === 'en' ? 'English' : 'Tiếng Việt'}
              </button>
            </div>

            {/* Theme */}
            <div>
              <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-2">Theme</label>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setTheme('auto')}
                  className={`flex-1 px-3 py-2 rounded-lg transition-all duration-150 font-medium text-sm flex items-center justify-center ${
                    theme === 'auto'
                      ? 'bg-[var(--accent)] text-[var(--text-inverse)]'
                      : 'bg-[var(--card-bg)] text-[var(--text-primary)] hover:bg-[var(--card-bg-hover)] border border-[var(--card-border)]'
                  }`}
                  title="Auto"
                >
                  <SunMoon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`flex-1 px-3 py-2 rounded-lg transition-all duration-150 font-medium text-sm flex items-center justify-center ${
                    theme === 'light'
                      ? 'bg-[var(--accent)] text-[var(--text-inverse)]'
                      : 'bg-[var(--card-bg)] text-[var(--text-primary)] hover:bg-[var(--card-bg-hover)] border border-[var(--card-border)]'
                  }`}
                  title="Light"
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex-1 px-3 py-2 rounded-lg transition-all duration-150 font-medium text-sm flex items-center justify-center ${
                    theme === 'dark'
                      ? 'bg-[var(--accent)] text-[var(--text-inverse)]'
                      : 'bg-[var(--card-bg)] text-[var(--text-primary)] hover:bg-[var(--card-bg-hover)] border border-[var(--card-border)]'
                  }`}
                  title="Dark"
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}

      <style jsx>{`
        @keyframes expandFromButton {
          from {
            opacity: 0;
            transform: scale(0.3) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes collapseToButton {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.3) translateY(10px);
          }
        }
      `}</style>
    </div>
  );
}

'use client';

import Logo from './Logo';
import { siteContent } from '@/content/site-content';
import { useLanguage } from '../providers/LanguageProvider';
import { useScrollPast } from '@/hooks/useScrollPast';

const SCROLL_THRESHOLD_PX = 50;

export default function Navbar() {
  const { language } = useLanguage();
  const content = siteContent.navbar;
  const isScrolled = useScrollPast(SCROLL_THRESHOLD_PX);

  return (
    <nav
      className={`fixed z-50 flex justify-between items-center ${
        isScrolled ? 'navbar-scroll' : 'navbar-unscroll'
      }`}
      style={{
        top: isScrolled ? '1rem' : '0',
        width: isScrolled ? 'min(80%, 56rem)' : '100%',
        left: isScrolled ? '50%' : '0',
        transform: isScrolled ? 'translateX(-50%)' : 'translateX(0)',
        borderRadius: isScrolled ? '9999px' : '0',
        backgroundColor: isScrolled ? 'var(--nav-bg)' : 'var(--nav-bg-transparent)',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        border: isScrolled ? '1px solid var(--nav-border)' : 'none',
        boxShadow: isScrolled ? '0 10px 30px var(--shadow-lg)' : 'none',
        padding: isScrolled ? '0.75rem 1.5rem' : '1rem 1.5rem',
        transition: 'all 1s var(--ease-bounce)',
      }}
    >
      {/* Logo / Brand */}
      <Logo variant="full" isScrolled={isScrolled} />

      {/* Resume Button - Right */}
      <div className="flex-shrink-0">
        <a
          href="#"
          style={{
            padding: isScrolled ? '0.375rem 1.25rem' : '0.5rem 1.5rem',
            fontSize: isScrolled ? '0.875rem' : '1rem',
            backgroundColor: isScrolled ? undefined : 'var(--nav-bg)',
            backdropFilter: isScrolled ? undefined : 'blur(12px)',
            color: isScrolled ? 'var(--text-inverse)' : 'var(--text-primary)',
            border: isScrolled ? 'none' : '2px solid var(--nav-border)',
            borderRadius: isScrolled ? '9999px' : '0.5rem',
            boxShadow: isScrolled
              ? '0 8px 20px rgba(var(--accent-rgb), 0.35)'
              : '0 8px 16px var(--shadow-lg), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            transition:
              'background-color 1s var(--ease-bounce), border-color 1s var(--ease-bounce), color 1s var(--ease-bounce), padding 1s var(--ease-bounce), font-size 1s var(--ease-bounce), border-radius 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s ease, box-shadow 0.3s ease',
          }}
          className={`group relative inline-flex items-center justify-center overflow-hidden font-medium hover:scale-105 active:brightness-125 ${
            isScrolled ? 'btn-resume' : 'hover:shadow-xl'
          }`}
        >
          <span className="relative z-10">{content.resumeLabel[language]}</span>
          {isScrolled ? (
            /* Glitter sparkles (island state only) */
            <span aria-hidden className="pointer-events-none absolute inset-0">
              <span className="spark" style={{ top: '20%', left: '12%', animationDelay: '0s', animationDuration: '2.2s' }} />
              <span className="spark" style={{ top: '65%', left: '28%', animationDelay: '0.6s', animationDuration: '2.8s', width: '3px', height: '3px' }} />
              <span className="spark" style={{ top: '30%', left: '50%', animationDelay: '1.1s', animationDuration: '2.4s', width: '4px', height: '4px' }} />
              <span className="spark" style={{ top: '70%', left: '68%', animationDelay: '0.3s', animationDuration: '3s' }} />
              <span className="spark" style={{ top: '25%', left: '85%', animationDelay: '1.6s', animationDuration: '2.5s', width: '3px', height: '3px' }} />
              <span className="spark" style={{ top: '55%', left: '92%', animationDelay: '0.9s', animationDuration: '2.9s' }} />
            </span>
          ) : (
            /* Shine sweep on hover (top-of-page glass state only) */
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full transition-transform duration-700 ease-out group-hover:translate-x-full"
              style={{
                background: 'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.45) 50%, transparent 60%)',
              }}
            />
          )}
        </a>
      </div>
    </nav>
  );
}

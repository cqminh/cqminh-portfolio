'use client';

import { useState, useEffect } from 'react';
import Logo from './Logo';
import { siteContent } from '@/content/site-content';
import { useLanguage } from '../providers/LanguageProvider';

export default function Navbar() {
  const { language } = useLanguage();
  const content = siteContent.navbar;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed z-50 flex justify-between items-center ${
        isScrolled ? 'navbar-scroll' : 'navbar-unscroll'
      }`}
      style={{
        top: isScrolled ? '1rem' : '0',
        width: isScrolled ? '80%' : '100%',
        left: isScrolled ? '50%' : '0',
        transform: isScrolled ? 'translateX(-50%)' : 'translateX(0)',
        borderRadius: isScrolled ? '9999px' : '0',
        backgroundColor: isScrolled ? 'var(--nav-bg)' : 'var(--nav-bg-transparent)',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        border: isScrolled ? '1px solid var(--nav-border)' : 'none',
        boxShadow: isScrolled ? '0 10px 30px var(--shadow-lg)' : 'none',
        padding: isScrolled ? '0.75rem 1.5rem' : '1rem 1.5rem',
        transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
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
            backgroundColor: isScrolled ? 'rgba(var(--accent-rgb), 0.55)' : 'var(--nav-bg)',
            backdropFilter: 'blur(12px)',
            color: isScrolled ? 'var(--text-inverse)' : 'var(--text-primary)',
            border: `2px solid ${isScrolled ? 'var(--accent)' : 'var(--nav-border)'}`,
            borderRadius: isScrolled ? '9999px' : '0.5rem',
            boxShadow: '0 8px 16px var(--shadow-lg), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            transition:
              'background-color 1s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 1s cubic-bezier(0.34, 1.56, 0.64, 1), color 1s cubic-bezier(0.34, 1.56, 0.64, 1), padding 1s cubic-bezier(0.34, 1.56, 0.64, 1), font-size 1s cubic-bezier(0.34, 1.56, 0.64, 1), border-radius 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease',
          }}
          className="group relative inline-flex items-center justify-center overflow-hidden font-medium hover:scale-105 hover:shadow-xl active:brightness-125"
        >
          <span className="relative z-10">{content.resumeLabel[language]}</span>
          {/* Shine sweep on hover */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full transition-transform duration-700 ease-out group-hover:translate-x-full"
            style={{
              background: 'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.45) 50%, transparent 60%)',
            }}
          />
        </a>
      </div>
    </nav>
  );
}

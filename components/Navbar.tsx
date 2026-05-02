'use client';

import { useState, useEffect } from 'react';

export default function Navbar() {
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
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0)',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        border: isScrolled ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
        boxShadow: isScrolled ? '0 10px 30px rgba(0, 0, 0, 0.2)' : 'none',
        padding: isScrolled ? '0.75rem 1.5rem' : '1rem 1.5rem',
        transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Logo / Brand */}
      <div className="flex-shrink-0">
        <h1
          className="font-bold transition-all"
          style={{
            fontSize: isScrolled ? '1.125rem' : '1.5rem',
            color: isScrolled ? '#ffffff' : '#ffffff',
            transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          Portfolio
        </h1>
      </div>

      {/* Resume Button - Right */}
      <div className="flex-shrink-0">
        <a
          href="#"
          style={{
            padding: isScrolled ? '0.375rem 1.25rem' : '0.5rem 1.5rem',
            fontSize: isScrolled ? '0.875rem' : '1rem',
            backgroundColor: isScrolled ? '#2563eb' : 'transparent',
            color: '#ffffff',
            border: isScrolled ? 'none' : '2px solid white',
            borderRadius: isScrolled ? '9999px' : '0.5rem',
            transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          className="font-medium hover:opacity-80"
        >
          Resume
        </a>
      </div>
    </nav>
  );
}

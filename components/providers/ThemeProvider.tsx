'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';

type Theme = 'auto' | 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('auto');
  const [mounted, setMounted] = useState(false);
  const isInitialMount = useRef(true);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const applyTheme = useCallback((currentTheme: Theme) => {
    const root = document.documentElement;
    let finalTheme = currentTheme;

    if (currentTheme === 'auto') {
      finalTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    if (finalTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
  }, [theme, mounted, applyTheme]);

  // Save to localStorage (skip on initial mount to avoid race condition)
  useEffect(() => {
    if (!mounted) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  // Listen to system preference changes when in auto mode
  useEffect(() => {
    if (!mounted || theme !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const root = document.documentElement;
      if (e.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

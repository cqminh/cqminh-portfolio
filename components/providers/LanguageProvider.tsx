'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { Language } from '@/types/content';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);
  const isInitialMount = useRef(true);

  // Initialize language from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Keep <html lang="..."> in sync
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = language;
  }, [language, mounted]);

  // Save to localStorage (skip on initial mount to avoid race condition)
  useEffect(() => {
    if (!mounted) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem('language', language);
  }, [language, mounted]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

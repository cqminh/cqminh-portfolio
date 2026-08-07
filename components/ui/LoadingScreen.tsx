'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useLoading } from '@/components/providers/LoadingProvider';
import { siteContent } from '@/content/site-content';

export default function LoadingScreen() {
  const { language } = useLanguage();
  const { finishLoading: notifyLoadingComplete } = useLoading();
  const messages = siteContent.loadingScreen.messages;
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const progressRef = useRef(0);
  // finishLoading below is deliberately kept dependency-free (its identity
  // must stay stable so the interval effect doesn't restart) — this ref
  // lets it still call whatever the current context function is.
  const notifyLoadingCompleteRef = useRef(notifyLoadingComplete);
  useEffect(() => {
    notifyLoadingCompleteRef.current = notifyLoadingComplete;
  }, [notifyLoadingComplete]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (isLoading) {
      const scrollY = window.scrollY;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.documentElement.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY ? -parseInt(scrollY, 10) : 0);
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
    };
  }, [isLoading]);

  const finishLoading = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsComplete(true);

    const flashTimeout = setTimeout(() => {
      setIsClosing(true);
      const closeTimeout = setTimeout(() => {
        setIsLoading(false);
        notifyLoadingCompleteRef.current();
      }, 400);
      timeoutRefs.current.push(closeTimeout);
    }, 450);
    timeoutRefs.current.push(flashTimeout);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        let next = prev;
        // 0-83%, fast
        if (prev < 83) {
          next = prev + 2;
        }
        // 83-92%, congested/slow
        else if (prev < 92) {
          next = prev + 0.15;
        }
        // 92-100%, fast again
        else if (prev < 100) {
          next = prev + 2;
        } else {
          next = 100;
        }

        progressRef.current = next;

        if (next >= 100 && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          finishLoading();
        }

        return next;
      });
    }, 50);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
    };
  }, [finishLoading]);

  if (!isLoading) return null;

  const grayscale = Math.max(0, 100 - progress);
  const messageIndex = progress < 50 ? 0 : progress < 85 ? 1 : 2;

  return (
    <div
      className="fixed inset-0 bg-[var(--background)] z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{
        opacity: isClosing ? 0 : 1,
        transition: 'opacity 0.4s ease-out',
      }}
    >
      {/* Logo Container */}
      <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
        {/* Ambient glow, grows with progress */}
        <div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{
            background: 'radial-gradient(circle, var(--accent), transparent 70%)',
            opacity: (progress / 100) * 0.7,
          }}
        />

        {/* Completion flash */}
        {isComplete && (
          <div
            className="absolute inset-0 rounded-full loading-flash pointer-events-none"
            style={{ background: 'radial-gradient(circle, var(--accent), transparent 70%)' }}
          />
        )}

        {/* Logo: grayscale at 0%, full color at 100% */}
        <div
          className="relative w-24 h-24"
          style={{
            filter: `grayscale(${grayscale}%) ${isComplete ? 'brightness(1.4)' : ''}`,
            transition: isComplete ? 'filter 0.4s ease-out' : undefined,
          }}
        >
          <Image
            src="/logo.png"
            alt="Logo"
            fill
            priority
            className="object-contain"
            sizes="96px"
          />
        </div>
      </div>

      {/* Loading Text */}
      <p className="text-[var(--text-primary)] text-sm tracking-widest uppercase loading-text-blink">
        {messages[messageIndex][language]}
      </p>

      {/* Progress Bar */}
      <div className="w-48 h-1 bg-[var(--border)] rounded-full mt-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress Text */}
      <p className="text-[var(--text-muted)] text-xs mt-3">{Math.round(progress)}%</p>
    </div>
  );
}

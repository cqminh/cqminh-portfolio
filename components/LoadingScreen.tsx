'use client';

import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Pause at 80-85%
        if (prev >= 80 && prev < 85) {
          return prev + 0.3; // Slow down
        }
        // After 85%, move faster to 100%
        if (prev >= 85 && prev < 100) {
          return prev + 1.5;
        }
        // 0-80%, normal speed
        if (prev < 80) {
          return prev + 1;
        }
        return 100;
      });
    }, 50);

    // When progress reaches 100%, finish loading
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }

    return () => clearInterval(interval);
  }, [progress]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center overflow-hidden">
      {/* Logo Container */}
      <div className="relative w-32 h-32 mb-8">
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle, #3b82f6, transparent)`,
            opacity: progress > 10 ? (progress - 10) / 90 : 0,
          }}
        />

        {/* Logo SVG */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          style={{
            filter: progress < 10 ? 'grayscale(100%)' : `grayscale(${Math.max(0, 100 - (progress - 10) * 10)})`,
            transition: 'filter 0.3s ease-out',
          }}
        >
          {/* SVG Circle Design */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="url(#fillGradient)"
            strokeWidth="3"
          />
          <circle
            cx="100"
            cy="100"
            r="60"
            fill="url(#fillGradient)"
            opacity="0.3"
          />
          <text
            x="100"
            y="110"
            fontSize="48"
            fontWeight="bold"
            textAnchor="middle"
            fill="url(#fillGradient)"
            fontFamily="Arial, sans-serif"
          >
            P
          </text>

          {/* Animated Fill Gradient */}
          <defs>
            <linearGradient id="fillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#9ca3af', stopOpacity: 1 }} />
              <stop
                offset={`${progress}%`}
                style={{ stopColor: '#3b82f6', stopOpacity: 1 }}
              />
              <stop offset={`${progress}%`} style={{ stopColor: '#9ca3af', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#9ca3af', stopOpacity: 1 }} />
            </linearGradient>
          </defs>

          {/* Animated circle mask for fill effect */}
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="white"
            opacity="0"
            style={{
              maskImage: `linear-gradient(to top, black ${progress}%, transparent ${progress}%)`,
              WebkitMaskImage: `linear-gradient(to top, black ${progress}%, transparent ${progress}%)`,
            }}
          />
        </svg>
      </div>

      {/* Loading Text */}
      <p
        className="text-white text-sm tracking-widest uppercase"
        style={{
          opacity: progress < 80 ? 1 : 0.5,
          transition: 'opacity 0.3s ease-out',
        }}
      >
        Loading Portfolio
      </p>

      {/* Progress Bar */}
      <div className="w-48 h-1 bg-gray-700 rounded-full mt-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress Text */}
      <p className="text-gray-500 text-xs mt-3">{Math.round(progress)}%</p>
    </div>
  );
}

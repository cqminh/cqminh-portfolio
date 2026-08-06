'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Particles, { ParticlesProvider } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { Engine } from '@tsparticles/engine';
import { PORTRAIT_IMAGES } from '@/content/assets';
import { particlesConfig } from '@/config/particles';
import { siteContent } from '@/content/site-content';
import { useLanguage } from '@/components/providers/LanguageProvider';

export default function Hero() {
  const { language } = useLanguage();
  const content = siteContent.hero;
  const [portraitSrc, setPortraitSrc] = useState<string>(PORTRAIT_IMAGES[0]);

  useEffect(() => {
    const randomImage = PORTRAIT_IMAGES[Math.floor(Math.random() * PORTRAIT_IMAGES.length)];
    setPortraitSrc(randomImage);
  }, []);

  const particlesInit = async (engine: Engine) => {
    await loadSlim(engine);
  };

  const refreshImage = () => {
    const randomImage = PORTRAIT_IMAGES[Math.floor(Math.random() * PORTRAIT_IMAGES.length)];
    setPortraitSrc(randomImage);
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center text-[var(--text-primary)]"
      style={{
        clipPath: 'inset(0)',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom right, var(--hero-gradient-from), var(--hero-gradient-via), var(--hero-gradient-to))',
      }}
    >
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none" style={{ clipPath: 'inset(0)' }}>
        <div className="absolute inset-0 w-full h-full particles-wrapper">
          <ParticlesProvider init={particlesInit}>
            <Particles id="tsparticles" options={particlesConfig} />
          </ParticlesProvider>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ backgroundColor: 'var(--hero-glow-1)' }}></div>
        <div className="absolute bottom-0 -right-4 w-72 h-72 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ backgroundColor: 'var(--hero-glow-2)' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite', backgroundColor: 'var(--hero-glow-3)' }}></div>
      </div>

      <div className="relative z-10 flex items-start px-6 max-w-7xl w-full min-h-screen gap-12">
        {/* Left side: Portrait */}
        <div className="w-2/5 flex flex-col justify-end h-screen pt-20">
          <div style={{ opacity: 1, transform: 'translateX(-20px)', transition: 'all 0.8s ease-out' }}>
            <div style={{ width: '380px', maxWidth: '100%' }}>
              {portraitSrc && (
                <img
                  src={portraitSrc}
                  alt={content.name}
                  className="object-cover w-full h-auto block"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right side: Text */}
        <div className="w-3/5 flex flex-col justify-center h-screen">
          <div style={{ opacity: 1, transform: 'translateY(0px)', transition: 'all 0.8s ease-out' }}>
            <p className="text-base md:text-lg text-[var(--text-secondary)] tracking-wide mb-2 font-bold">
              {content.greeting[language]}
            </p>
          </div>

          <div style={{ opacity: 1, transform: 'translateY(0px)', transition: 'all 0.8s ease-out' }}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-blue-400">{content.name}</span>
            </h1>
          </div>

          <div style={{ opacity: 1, transform: 'translateY(0px)', transition: 'all 0.8s ease-out 0.2s' }}>
            <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-8 leading-relaxed">
              {content.title[language]}
            </p>
          </div>

          <div style={{ opacity: 1, transform: 'translateY(0px)', transition: 'all 0.8s ease-out 0.4s' }}>
            <p className="text-lg text-[var(--text-muted)] mb-12 max-w-2xl leading-relaxed">
              {content.description[language]}
            </p>
          </div>

          <div style={{ opacity: 1, transform: 'translateY(0px)', transition: 'all 0.8s ease-out 0.6s' }} className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
              {content.ctaPrimary[language]}
            </button>
            <button className="px-8 py-4 border-2 border-blue-400 text-blue-400 hover:bg-blue-400/10 rounded-lg font-semibold transition-all">
              {content.ctaSecondary[language]}
            </button>
          </div>
        </div>
      </div>

    </section>
  );
}

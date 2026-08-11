'use client';

import Image from 'next/image';

interface LogoProps {
  variant?: 'icon' | 'full';
  isScrolled?: boolean;
}

export default function Logo({ variant = 'full', isScrolled = false }: LogoProps) {
  const iconSize = isScrolled ? 32 : 40;
  const containerGap = isScrolled ? 'gap-2' : 'gap-3';
  const nameWidth = isScrolled ? '100px' : '120px';

  if (variant === 'icon') {
    return (
      <div className="flex-shrink-0 relative" style={{ width: iconSize, height: iconSize }}>
        <Image
          src="/logo.png"
          alt="Logo"
          fill
          priority
          className="object-contain"
          sizes={`${iconSize}px`}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center ${containerGap} flex-shrink-0`}>
      <div className="relative flex-shrink-0" style={{ width: iconSize, height: iconSize }}>
        <Image
          src="/logo.png"
          alt="Logo"
          fill
          priority
          className="object-contain"
          sizes={`${iconSize}px`}
        />
      </div>
      <div
        className="hidden sm:block relative"
        style={{
          width: nameWidth,
          height: '40px',
          transition: 'all 1s var(--ease-bounce)',
          overflow: 'hidden',
        }}
      >
        <Image
          src="/name.png"
          alt="Châu Quang Minh"
          fill
          priority
          className="object-contain"
          sizes="120px"
        />
      </div>
    </div>
  );
}

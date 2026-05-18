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
      <div className="flex-shrink-0">
        <Image
          src="/logo.png"
          alt="Logo"
          width={iconSize}
          height={iconSize}
          priority
          className="rounded-full"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center ${containerGap} flex-shrink-0`}>
      <Image
        src="/logo.png"
        alt="Logo"
        width={iconSize}
        height={iconSize}
        priority
        className="rounded-full"
      />
      <div
        className="hidden sm:block"
        style={{
          width: nameWidth,
          height: 'auto',
          transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
          overflow: 'hidden',
        }}
      >
        <img
          src="/name.png"
          alt="Châu Quang Minh"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
}

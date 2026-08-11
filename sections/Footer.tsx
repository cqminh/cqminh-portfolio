'use client';

import Image from 'next/image';
import { siteContent } from '@/content/site-content';

// How many [logo, name] pairs make up one half of the marquee track — needs
// to be wide enough that the loop never shows empty space on tall/ultrawide
// viewports before it repeats.
const MARQUEE_REPEAT = 6;

function MarqueeSequence({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="flex items-center" aria-hidden={ariaHidden}>
      {Array.from({ length: MARQUEE_REPEAT }).map((_, i) => (
        <div key={i} className="flex flex-shrink-0 items-center gap-6 px-3 sm:gap-10 sm:px-5">
          <div className="relative h-5 w-5 flex-shrink-0 sm:h-8 sm:w-8">
            <Image src="/logo.png" alt={i === 0 && !ariaHidden ? 'Logo' : ''} fill className="object-contain" sizes="32px" />
          </div>
          <div className="relative h-3.5 w-[70px] flex-shrink-0 sm:h-5 sm:w-[105px]">
            <Image
              src="/name.png"
              alt={i === 0 && !ariaHidden ? 'Châu Quang Minh' : ''}
              fill
              className="object-contain"
              sizes="105px"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Footer() {
  const content = siteContent.footer;

  return (
    <footer className="relative">
      <div
        className="overflow-hidden py-3 sm:py-4"
        style={{
          backgroundColor: 'var(--background-projects)',
          maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <div className="footer-marquee-track flex w-max">
          <MarqueeSequence />
          <MarqueeSequence ariaHidden />
        </div>
      </div>

      {/* Fixed neutral gray — deliberately not a --var() theme token, so
          this bar stays the same in both light and dark mode. */}
      <div className="flex min-h-[32px] items-center justify-center px-6" style={{ backgroundColor: '#27272a' }}>
        <p className="text-center text-xs sm:text-sm" style={{ color: '#a1a1aa' }}>
          {content.copyright}
        </p>
      </div>
    </footer>
  );
}

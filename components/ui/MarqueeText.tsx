'use client';

import { useEffect, useRef, useState } from 'react';

interface MarqueeTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

// How fast the label crawls once it overflows (px/s) — keeps the crawl
// speed roughly constant instead of a fixed duration that reads slow for a
// two-letter overflow and rushed for a long one.
const PIXELS_PER_SECOND = 22;
const MIN_DURATION_S = 3;

// A label too wide for its fixed-width slot bounces left/right to reveal
// the clipped part instead of trailing off into "…" — for spots with no
// other way to ever read the full text (e.g. the phone mockup's folder
// popup, which has no tooltip/hover affordance on touch).
export default function MarqueeText({ text, className, style }: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [overflow, setOverflow] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;

    const measure = () => setOverflow(Math.max(0, textEl.scrollWidth - container.clientWidth));
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [text]);

  const duration = Math.max(MIN_DURATION_S, (overflow / PIXELS_PER_SECOND) * 2);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className ?? ''}`}
      style={{ ...style, textAlign: overflow > 0 ? 'left' : 'center' }}
    >
      <span
        ref={textRef}
        className="inline-block whitespace-nowrap"
        style={
          overflow > 0
            ? ({
                animation: `labelMarquee ${duration}s ease-in-out infinite`,
                '--marquee-shift': `-${overflow}px`,
              } as React.CSSProperties)
            : undefined
        }
      >
        {text}
      </span>
    </div>
  );
}

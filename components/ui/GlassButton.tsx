'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';

// No position utility here on purpose: Tailwind emits `.relative` after `.fixed`/`.absolute`
// in its stylesheet, so baking `relative` in would silently outrank a consumer's `fixed`/`absolute`
// className regardless of attribute order. Let each consumer own its own positioning.
const GLASS_BASE_CLASSES =
  'w-10 h-10 rounded-full bg-[rgba(255,255,255,0.2)] dark:bg-[rgba(17,24,39,0.2)] backdrop-blur-[12px] hover:bg-[rgba(255,255,255,0.3)] dark:hover:bg-[rgba(17,24,39,0.3)] active:bg-[rgba(255,255,255,0.5)] dark:active:bg-[rgba(17,24,39,0.5)] border border-[var(--nav-border)] transition-all duration-300 flex items-center justify-center group';

const GLASS_SHADOW =
  '0 8px 16px var(--shadow-lg), inset 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 -2px 4px rgba(0, 0, 0, 0.05)';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Set false to opt out of the shared hover scale-up, e.g. when a button needs its own hover motion instead. */
  scaleOnHover?: boolean;
}

/**
 * Shared "liquid glass" chrome (blur, tint, border, shadow) for circular icon buttons.
 * Each consumer keeps its own hover animation on its icon content via group-hover classes.
 */
const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className = '', scaleOnHover = true, style, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${GLASS_BASE_CLASSES} ${scaleOnHover ? 'transform hover:scale-110' : ''} ${className}`}
        style={{ boxShadow: GLASS_SHADOW, ...style }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GlassButton.displayName = 'GlassButton';

export default GlassButton;

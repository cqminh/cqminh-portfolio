import { useEffect } from 'react';

// Subscribes `callback` to window scroll events for the component's
// lifetime — the passive-listener-plus-cleanup boilerplate shared by every
// scroll-driven hook/component in this codebase. `callback` should be
// stable (wrap it in useCallback) so this doesn't resubscribe every render.
export function useOnScroll(callback: () => void) {
  useEffect(() => {
    window.addEventListener('scroll', callback, { passive: true });
    return () => window.removeEventListener('scroll', callback);
  }, [callback]);
}

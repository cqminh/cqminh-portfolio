import { useEffect } from 'react';

// Module-level pub-sub: every scroll-driven hook/component in the app
// subscribes here instead of registering its own `window` listener, so no
// matter how many consumers there are (navbar, back-to-top, custom
// scrollbar, hero, the pinned-sections controller...) the page only ever
// has exactly one real 'scroll' listener attached to `window`. The real
// listener is added on the first subscriber and torn down once the last
// one leaves.
const listeners = new Set<() => void>();
let detachWindowListener: (() => void) | null = null;

function dispatch() {
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  if (!detachWindowListener) {
    window.addEventListener('scroll', dispatch, { passive: true });
    detachWindowListener = () => window.removeEventListener('scroll', dispatch);
  }
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0 && detachWindowListener) {
      detachWindowListener();
      detachWindowListener = null;
    }
  };
}

// Subscribes `callback` to window scroll events for the component's
// lifetime. `callback` should be stable (wrap it in useCallback) so this
// doesn't resubscribe every render. Doesn't call `callback` on mount — a
// caller that needs an accurate value before the first scroll event should
// either compute its initial state directly (see useScrollPast) or call it
// once itself in a mount effect (see MainSections).
export function useOnScroll(callback: () => void) {
  useEffect(() => subscribe(callback), [callback]);
}

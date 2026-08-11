import { useEffect, useState } from "react";

/**
 * Tracks a brief "just saved" window after a useActionState result flips to
 * ok:true. The ok->true detection happens during render (React's documented
 * pattern for deriving state from a changed value) so only the auto-hide
 * timer needs an effect.
 */
export function useJustSaved(state: { ok: boolean }): boolean {
  const [prevState, setPrevState] = useState(state);
  const [justSaved, setJustSaved] = useState(false);

  if (state !== prevState) {
    setPrevState(state);
    if (state.ok) setJustSaved(true);
  }

  useEffect(() => {
    if (!justSaved) return;
    const timeout = setTimeout(() => setJustSaved(false), 2000);
    return () => clearTimeout(timeout);
  }, [justSaved]);

  return justSaved;
}

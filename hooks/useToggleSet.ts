import { useState } from "react";

/**
 * A Set<T> plus a toggle function that adds a value if absent or removes it
 * if present — the open/closed state behind admin content forms' per-row
 * preview toggles.
 */
export function useToggleSet<T>(): [Set<T>, (value: T) => void] {
  const [values, setValues] = useState<Set<T>>(new Set());

  const toggle = (value: T) => {
    setValues((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  return [values, toggle];
}

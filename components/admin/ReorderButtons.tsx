"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

// Shared by the admin content-editor forms wherever a row list's order is
// what the public site renders in (About's apps/groups and group items,
// Projects, Experience) — up/down is enough since these lists stay short,
// and skips pulling in a drag-and-drop dependency for it.
export function ReorderButtons({
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: {
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  return (
    <div className="flex shrink-0 flex-col">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={!canMoveUp}
        aria-label="Move up"
        className="flex h-5 w-9 items-center justify-center rounded-t-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--card-bg-hover)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronUp className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={!canMoveDown}
        aria-label="Move down"
        className="flex h-5 w-9 items-center justify-center rounded-b-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--card-bg-hover)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-30"
      >
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

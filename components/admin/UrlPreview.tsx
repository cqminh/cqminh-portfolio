"use client";

import { Eye, EyeOff } from "lucide-react";

// Shared by the admin content forms (Hero/About/Projects) wherever an admin
// pastes a plain image URL (a Cloudinary link) — toggles a small inline
// thumbnail instead of navigating away to check it loaded correctly.
export function UrlPreviewButton({ url, open, onToggle }: { url: string; open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={!url}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--card-bg-hover)] disabled:cursor-not-allowed disabled:opacity-40"
      aria-label={open ? "Hide preview" : "Show preview"}
    >
      {open ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );
}

export function UrlPreviewImage({ url, className }: { url: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- arbitrary external URL, admin-only preview
    <img src={url} alt="" className={className ?? "h-16 w-16 rounded-lg border border-[var(--card-border)] object-cover"} />
  );
}

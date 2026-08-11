"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Plus, X } from "lucide-react";
import { saveHeroAction, type SaveHeroState } from "./actions";
import { SaveButton } from "@/components/admin/SaveButton";
import { useJustSaved } from "@/hooks/useJustSaved";

const initialState: SaveHeroState = { ok: false };

let nextId = 0;
function makeRow(value: string) {
  nextId += 1;
  return { id: nextId, value };
}

export function HeroForm({ titles, images }: { titles: string[]; images: string[] }) {
  const [state, formAction, pending] = useActionState(saveHeroAction, initialState);
  const justSaved = useJustSaved(state);

  const [titleRows, setTitleRows] = useState(() => (titles.length ? titles.map(makeRow) : [makeRow("")]));
  const [imageRows, setImageRows] = useState(() => (images.length ? images.map(makeRow) : [makeRow("")]));
  const [previewIds, setPreviewIds] = useState<Set<number>>(new Set());

  const togglePreview = (id: number) => {
    setPreviewIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-[var(--text-primary)]">Job titles</span>
        <div className="flex flex-col gap-2">
          {titleRows.map((row) => (
            <div key={row.id} className="flex items-center gap-2">
              <input
                name="title"
                value={row.value}
                onChange={(e) =>
                  setTitleRows((rows) => rows.map((r) => (r.id === row.id ? { ...r, value: e.target.value } : r)))
                }
                placeholder="e.g. Mobile Developer"
                className="flex-1 rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)]"
              />
              <button
                type="button"
                onClick={() => setTitleRows((rows) => rows.filter((r) => r.id !== row.id))}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--card-bg-hover)] hover:text-red-500"
                aria-label="Remove title"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setTitleRows((rows) => [...rows, makeRow("")])}
          className="flex w-fit items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--accent-text)] transition-colors hover:bg-[var(--card-bg-hover)]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add title
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-[var(--text-primary)]">Slider images</span>
        <p className="text-xs text-[var(--text-muted)]">Paste each Cloudinary image link below.</p>
        <div className="flex flex-col gap-2">
          {imageRows.map((row) => {
            const showPreview = previewIds.has(row.id);
            return (
              <div key={row.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    name="image"
                    type="url"
                    value={row.value}
                    onChange={(e) =>
                      setImageRows((rows) => rows.map((r) => (r.id === row.id ? { ...r, value: e.target.value } : r)))
                    }
                    placeholder="https://res.cloudinary.com/..."
                    className="flex-1 rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)]"
                  />
                  <button
                    type="button"
                    onClick={() => togglePreview(row.id)}
                    disabled={!row.value}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--card-bg-hover)] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={showPreview ? "Hide preview" : "Show preview"}
                  >
                    {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageRows((rows) => rows.filter((r) => r.id !== row.id))}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--card-bg-hover)] hover:text-red-500"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {showPreview && row.value && (
                  // eslint-disable-next-line @next/next/no-img-element -- arbitrary external URL, no remotePatterns setup needed for an admin-only preview
                  <img
                    src={row.value}
                    alt=""
                    className="h-40 w-32 rounded-lg border border-[var(--card-border)] object-cover"
                  />
                )}
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setImageRows((rows) => [...rows, makeRow("")])}
          className="flex w-fit items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--accent-text)] transition-colors hover:bg-[var(--card-bg-hover)]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add image
        </button>
      </div>

      {state.error && <p className="text-sm text-red-500">Each image needs to be a valid URL.</p>}

      <SaveButton pending={pending} justSaved={justSaved} />
    </form>
  );
}

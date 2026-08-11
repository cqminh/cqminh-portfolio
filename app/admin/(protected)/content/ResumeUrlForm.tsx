"use client";

import { useActionState, useState } from "react";
import { ExternalLink } from "lucide-react";
import { saveResumeAction, type SaveResumeState } from "./actions";
import { SaveButton } from "@/components/admin/SaveButton";
import { useJustSaved } from "@/hooks/useJustSaved";

const initialState: SaveResumeState = { ok: false };

export function ResumeUrlForm({ url }: { url: string }) {
  const [state, formAction, pending] = useActionState(saveResumeAction, initialState);
  const justSaved = useJustSaved(state);
  const [value, setValue] = useState(url);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1">
        <span className="text-xs text-[var(--text-muted)]">CV link (e.g. a Google Drive share link)</span>
        <input
          name="resume-url"
          type="url"
          placeholder="https://drive.google.com/..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)]"
        />
      </label>

      {state.error && <p className="text-sm text-red-500">Enter a valid URL, or leave empty to disable the button.</p>}

      <div className="flex items-center gap-3">
        <SaveButton pending={pending} justSaved={justSaved} />
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-[var(--card-border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--card-bg-hover)]"
          >
            <ExternalLink className="h-4 w-4" />
            Review
          </a>
        )}
      </div>
    </form>
  );
}

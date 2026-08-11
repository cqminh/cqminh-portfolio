"use client";

import { useActionState } from "react";
import { saveLoadingScreenAction, type SaveLoadingScreenState } from "./actions";
import { SaveButton } from "@/components/admin/SaveButton";
import { useJustSaved } from "@/hooks/useJustSaved";
import type { Localized } from "@/types/content";

const STAGE_LABELS = ["Message 1 (0–50%)", "Message 2 (50–85%)", "Message 3 (85–100%)"];
const initialState: SaveLoadingScreenState = { ok: false };

export function LoadingScreenForm({ messages }: { messages: Localized[] }) {
  const [state, formAction, pending] = useActionState(saveLoadingScreenAction, initialState);
  const justSaved = useJustSaved(state);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {STAGE_LABELS.map((label, i) => (
        <div key={i} className="flex flex-col gap-2">
          <span className="text-sm font-medium text-[var(--text-primary)]">{label}</span>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[var(--text-muted)]">English</span>
              <input
                name={`message-${i}-en`}
                defaultValue={messages[i]?.en ?? ""}
                required
                className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)]"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-[var(--text-muted)]">Tiếng Việt</span>
              <input
                name={`message-${i}-vi`}
                defaultValue={messages[i]?.vi ?? ""}
                required
                className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)]"
              />
            </label>
          </div>
        </div>
      ))}

      {state.error && <p className="text-sm text-red-500">All fields are required.</p>}

      <SaveButton pending={pending} justSaved={justSaved} />
    </form>
  );
}

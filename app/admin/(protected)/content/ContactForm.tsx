"use client";

import { useActionState } from "react";
import { saveContactAction, type SaveContactState } from "./actions";
import { SaveButton } from "@/components/admin/SaveButton";
import { useJustSaved } from "@/hooks/useJustSaved";
import type { Localized } from "@/types/content";

const initialState: SaveContactState = { ok: false };

export function ContactForm({ intro }: { intro: Localized }) {
  const [state, formAction, pending] = useActionState(saveContactAction, initialState);
  const justSaved = useJustSaved(state);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[var(--text-muted)]">English</span>
          <textarea
            name="contact-intro-en"
            defaultValue={intro.en}
            rows={3}
            required
            className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)]"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-[var(--text-muted)]">Tiếng Việt</span>
          <textarea
            name="contact-intro-vi"
            defaultValue={intro.vi}
            rows={3}
            required
            className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)]"
          />
        </label>
      </div>

      {state.error && <p className="text-sm text-red-500">Both languages are required.</p>}

      <SaveButton pending={pending} justSaved={justSaved} />
    </form>
  );
}

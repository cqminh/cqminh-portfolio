"use client";

import { useState } from "react";
import { useActionState } from "react";
import { saveContactAction, type SaveContactState } from "./actions";
import { SaveButton } from "@/components/admin/SaveButton";
import { UrlPreviewButton, UrlPreviewImage } from "@/components/admin/UrlPreview";
import { useJustSaved } from "@/hooks/useJustSaved";
import type { Localized } from "@/types/content";

const initialState: SaveContactState = { ok: false };

export function ContactForm({ intro, avatar }: { intro: Localized; avatar: string }) {
  const [state, formAction, pending] = useActionState(saveContactAction, initialState);
  const justSaved = useJustSaved(state);
  const [avatarValue, setAvatarValue] = useState(avatar);
  const [previewOpen, setPreviewOpen] = useState(false);

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

      <label className="flex flex-col gap-1">
        <span className="text-xs text-[var(--text-muted)]">Avatar image (optional — link ảnh, để trống dùng logo mặc định)</span>
        <div className="flex items-center gap-2">
          <input
            type="url"
            name="contact-avatar"
            value={avatarValue}
            onChange={(e) => setAvatarValue(e.target.value)}
            placeholder="https://res.cloudinary.com/..."
            className="flex-1 rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text-primary)]"
          />
          <UrlPreviewButton url={avatarValue} open={previewOpen} onToggle={() => setPreviewOpen((prev) => !prev)} />
        </div>
      </label>
      {previewOpen && avatarValue && (
        <UrlPreviewImage url={avatarValue} className="h-16 w-16 rounded-full border border-[var(--card-border)] object-cover" />
      )}

      {state.error && <p className="text-sm text-red-500">{state.error === "invalid" ? "Avatar link không hợp lệ." : "Both languages are required."}</p>}

      <SaveButton pending={pending} justSaved={justSaved} />
    </form>
  );
}

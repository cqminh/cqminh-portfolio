"use server";

import { verifySession } from "@/lib/dal";
import { saveLoadingScreenContent, saveResumeContent } from "@/lib/site-content";

export interface SaveLoadingScreenState {
  ok: boolean;
  error?: string;
}

export async function saveLoadingScreenAction(
  _prevState: SaveLoadingScreenState,
  formData: FormData
): Promise<SaveLoadingScreenState> {
  await verifySession();

  const messages = [0, 1, 2].map((i) => ({
    en: String(formData.get(`message-${i}-en`) ?? "").trim(),
    vi: String(formData.get(`message-${i}-vi`) ?? "").trim(),
  }));

  if (messages.some((m) => !m.en || !m.vi)) {
    return { ok: false, error: "empty" };
  }

  await saveLoadingScreenContent({ messages });
  return { ok: true };
}

export interface SaveResumeState {
  ok: boolean;
  error?: string;
}

export async function saveResumeAction(
  _prevState: SaveResumeState,
  formData: FormData
): Promise<SaveResumeState> {
  await verifySession();

  const url = String(formData.get("resume-url") ?? "").trim();

  if (url) {
    try {
      new URL(url);
    } catch {
      return { ok: false, error: "invalid" };
    }
  }

  await saveResumeContent({ url });
  return { ok: true };
}

"use server";

import { verifySession } from "@/lib/dal";
import { saveHeroContent, saveLoadingScreenContent, saveResumeContent } from "@/lib/site-content";

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

export interface SaveHeroState {
  ok: boolean;
  error?: string;
}

export async function saveHeroAction(_prevState: SaveHeroState, formData: FormData): Promise<SaveHeroState> {
  await verifySession();

  const titles = formData
    .getAll("title")
    .map((v) => String(v).trim())
    .filter(Boolean);

  const images = formData
    .getAll("image")
    .map((v) => String(v).trim())
    .filter(Boolean);

  for (const image of images) {
    try {
      new URL(image);
    } catch {
      return { ok: false, error: "invalid" };
    }
  }

  await saveHeroContent({ titles, sliderImages: images });
  return { ok: true };
}

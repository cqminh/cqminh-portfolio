"use server";

import { verifySession } from "@/lib/dal";
import { saveAboutContent, saveHeroContent, saveLoadingScreenContent, saveResumeContent } from "@/lib/site-content";
import type { Localized, PhoneAppChild, PhoneAppItem } from "@/types/content";

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

export interface SaveAboutState {
  ok: boolean;
  error?: string;
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseLocalized(value: unknown): Localized {
  const v = (value ?? {}) as Record<string, unknown>;
  return { en: str(v.en), vi: str(v.vi) };
}

// Drops rows missing required text — the client only ever sends fully-typed
// rows or fully-blank placeholder rows, so this just filters out the latter
// rather than erroring the whole save over one empty row.
function parseIntro(value: unknown): Localized[] {
  if (!Array.isArray(value)) return [];
  return value.map(parseLocalized).filter((row) => row.en && row.vi);
}

function parseChild(value: unknown): PhoneAppChild | null {
  const v = (value ?? {}) as Record<string, unknown>;
  const id = str(v.id);
  const label = parseLocalized(v.label);
  if (!id || !label.en || !label.vi) return null;
  return { id, label, icon: str(v.icon) };
}

function parseItem(value: unknown): PhoneAppItem | null {
  const v = (value ?? {}) as Record<string, unknown>;
  const id = str(v.id);
  const label = parseLocalized(v.label);
  if (!id || !label.en || !label.vi) return null;

  if (v.type === "group") {
    const children = Array.isArray(v.children) ? v.children.map(parseChild).filter((c): c is PhoneAppChild => c !== null) : [];
    return { type: "group", id, label, children };
  }

  const href = str(v.href);
  if (!href) return null;
  return { type: "app", id, label, icon: str(v.icon), href };
}

export async function saveAboutAction(_prevState: SaveAboutState, formData: FormData): Promise<SaveAboutState> {
  await verifySession();

  let parsed: unknown;
  try {
    parsed = JSON.parse(String(formData.get("about-data") ?? ""));
  } catch {
    return { ok: false, error: "invalid" };
  }

  const data = (parsed ?? {}) as Record<string, unknown>;
  const intro = parseIntro(data.intro);
  const phoneApps = Array.isArray(data.phoneApps)
    ? data.phoneApps.map(parseItem).filter((item): item is PhoneAppItem => item !== null)
    : [];

  await saveAboutContent({ intro, phoneApps });
  return { ok: true };
}

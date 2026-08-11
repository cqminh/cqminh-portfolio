"use server";

import { verifySession } from "@/lib/dal";
import {
  saveAboutContent,
  saveHeroContent,
  saveLoadingScreenContent,
  saveProjectsContent,
  saveResumeContent,
  saveTechnologiesContent,
} from "@/lib/site-content";
import type { Localized, PhoneAppChild, PhoneAppItem, ProjectItem, Technology } from "@/types/content";

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

export interface SaveProjectsState {
  ok: boolean;
  error?: string;
}

function parseProjectItem(value: unknown): ProjectItem | null {
  const v = (value ?? {}) as Record<string, unknown>;
  const name = parseLocalized(v.name);
  if (!name.en || !name.vi) return null;

  const language = Array.isArray(v.language) ? v.language.map(str).filter(Boolean) : [];
  const githubLink = str(v.githubLink);
  const projectLink = str(v.projectLink);

  return {
    id: str(v.id) || crypto.randomUUID(),
    name,
    time: parseLocalized(v.time),
    description: parseLocalized(v.description),
    position: parseLocalized(v.position),
    language,
    contactImage: str(v.contactImage),
    ...(githubLink && { githubLink }),
    ...(projectLink && { projectLink }),
  };
}

export async function saveProjectsAction(_prevState: SaveProjectsState, formData: FormData): Promise<SaveProjectsState> {
  await verifySession();

  let parsed: unknown;
  try {
    parsed = JSON.parse(String(formData.get("projects-data") ?? ""));
  } catch {
    return { ok: false, error: "invalid" };
  }

  const items = Array.isArray(parsed) ? parsed.map(parseProjectItem).filter((item): item is ProjectItem => item !== null) : [];

  await saveProjectsContent({ items });
  return { ok: true };
}

export interface SaveTechnologiesState {
  ok: boolean;
  error?: string;
}

const HEX_COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export async function saveTechnologiesAction(
  _prevState: SaveTechnologiesState,
  formData: FormData
): Promise<SaveTechnologiesState> {
  await verifySession();

  const ids = formData.getAll("tech-id").map((v) => String(v).trim());
  const names = formData.getAll("tech-name").map((v) => String(v).trim());
  const colors = formData.getAll("tech-color").map((v) => String(v).trim());

  const items: Technology[] = [];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const name = names[i] ?? "";
    const color = colors[i] ?? "";
    if (!id && !name) continue;
    if (!id || !name || !HEX_COLOR_RE.test(color)) {
      return { ok: false, error: "invalid" };
    }
    items.push({ id, name, color });
  }

  await saveTechnologiesContent({ items });
  return { ok: true };
}

import { unstable_cache, updateTag } from "next/cache";
import { sql } from "@/lib/db";
import type { LoadingScreenContent, ResumeContent } from "@/types/content";

function createContentSection<T>(section: string, fallback: T) {
  const tag = `site-content:${section}`;

  const fetchContent = async (): Promise<T> => {
    const rows = await sql`SELECT data FROM site_content WHERE section = ${section}`;
    return (rows[0]?.data as T | undefined) ?? fallback;
  };

  const get = unstable_cache(fetchContent, [`${section}-content`], { tags: [tag] });

  const save = async (data: T): Promise<void> => {
    await sql`
      INSERT INTO site_content (section, data, updated_at)
      VALUES (${section}, ${JSON.stringify(data)}::jsonb, now())
      ON CONFLICT (section) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
    `;
    updateTag(tag);
  };

  return { get, save };
}

// Used only before an admin ever saves anything (empty DB row).
const DEFAULT_LOADING_SCREEN: LoadingScreenContent = {
  messages: [
    { en: "Loading...", vi: "Đang tải..." },
    { en: "Loading...", vi: "Đang tải..." },
    { en: "Loading...", vi: "Đang tải..." },
  ],
};
const DEFAULT_RESUME: ResumeContent = { url: "" };

const loadingScreenSection = createContentSection<LoadingScreenContent>("loadingScreen", DEFAULT_LOADING_SCREEN);
export const getLoadingScreenContent = loadingScreenSection.get;
export const saveLoadingScreenContent = loadingScreenSection.save;

const resumeSection = createContentSection<ResumeContent>("resume", DEFAULT_RESUME);
export const getResumeContent = resumeSection.get;
export const saveResumeContent = resumeSection.save;

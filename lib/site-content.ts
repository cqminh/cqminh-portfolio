import { unstable_cache, updateTag } from "next/cache";
import { sql } from "@/lib/db";
import type {
  AboutEditableContent,
  ContactEditableContent,
  ExperienceEditableContent,
  HeroContent,
  LoadingScreenContent,
  ProjectsEditableContent,
  ResumeContent,
  TechnologiesContent,
} from "@/types/content";

// The `fallback` below is only ever read before an admin has saved that
// section once (empty DB row) — every section already has real data in
// production, so these stay as minimal, type-safe placeholders.
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

// LoadingScreen.tsx picks messages[0/1/2] by hardcoded index, so this needs
// exactly 3 entries — everything else below is safe empty.
const loadingScreenSection = createContentSection<LoadingScreenContent>("loadingScreen", {
  messages: [
    { en: "Loading...", vi: "Đang tải..." },
    { en: "Loading...", vi: "Đang tải..." },
    { en: "Loading...", vi: "Đang tải..." },
  ],
});
export const getLoadingScreenContent = loadingScreenSection.get;
export const saveLoadingScreenContent = loadingScreenSection.save;

const resumeSection = createContentSection<ResumeContent>("resume", { url: "" });
export const getResumeContent = resumeSection.get;
export const saveResumeContent = resumeSection.save;

const heroSection = createContentSection<HeroContent>("hero", { titles: [], sliderImages: [] });
export const getHeroContent = heroSection.get;
export const saveHeroContent = heroSection.save;

const aboutSection = createContentSection<AboutEditableContent>("about", { intro: [], phoneApps: [] });
export const getAboutContent = aboutSection.get;
export const saveAboutContent = aboutSection.save;

const projectsSection = createContentSection<ProjectsEditableContent>("projects", { items: [] });
export const getProjectsContent = projectsSection.get;
export const saveProjectsContent = projectsSection.save;

const technologiesSection = createContentSection<TechnologiesContent>("technologies", { items: [] });
export const getTechnologiesContent = technologiesSection.get;
export const saveTechnologiesContent = technologiesSection.save;

const experienceSection = createContentSection<ExperienceEditableContent>("experience", { items: [] });
export const getExperienceContent = experienceSection.get;
export const saveExperienceContent = experienceSection.save;

const contactSection = createContentSection<ContactEditableContent>("contact", { intro: { en: "", vi: "" }, avatar: "" });
export const getContactContent = contactSection.get;
export const saveContactContent = contactSection.save;

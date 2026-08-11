import { unstable_cache, updateTag } from "next/cache";
import { sql } from "@/lib/db";
import type { AboutEditableContent, HeroContent, LoadingScreenContent, ResumeContent } from "@/types/content";

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

// Used only before an admin ever saves anything (empty DB row) — the same
// placeholder titles/photos the hero previously shipped with as static content.
const DEFAULT_HERO: HeroContent = {
  titles: ["Mobile Developer", "Flutter Developer", "React Native Developer"],
  sliderImages: ["/picture_1.png", "/picture_2.png", "/picture_3.jpg", "/picture_4.jpg", "/picture_5.jpg"],
};

const loadingScreenSection = createContentSection<LoadingScreenContent>("loadingScreen", DEFAULT_LOADING_SCREEN);
export const getLoadingScreenContent = loadingScreenSection.get;
export const saveLoadingScreenContent = loadingScreenSection.save;

const resumeSection = createContentSection<ResumeContent>("resume", DEFAULT_RESUME);
export const getResumeContent = resumeSection.get;
export const saveResumeContent = resumeSection.save;

const heroSection = createContentSection<HeroContent>("hero", DEFAULT_HERO);
export const getHeroContent = heroSection.get;
export const saveHeroContent = heroSection.save;

// Used only before an admin ever saves anything (empty DB row) — the same
// intro sentence and phone app grid the About section previously shipped
// with as static content.
const DEFAULT_ABOUT: AboutEditableContent = {
  intro: [
    {
      en: "Mobile developer focused on building smooth, native-feeling apps with Flutter and React Native — from first line of code to App Store release.",
      vi: "Lập trình viên mobile, tập trung xây dựng ứng dụng mượt mà, cảm giác native với Flutter và React Native — từ dòng code đầu tiên đến khi lên App Store.",
    },
  ],
  phoneApps: [
    { type: "app", id: "phone", label: { en: "Phone", vi: "Điện thoại" }, icon: "", href: "tel:+84869934393" },
    { type: "app", id: "map", label: { en: "Map", vi: "Bản đồ" }, icon: "", href: "https://maps.app.goo.gl/eKWkurCACrFLq9P96" },
    { type: "app", id: "linkedin", label: { en: "LinkedIn", vi: "LinkedIn" }, icon: "", href: "https://www.linkedin.com/in/cqminh/" },
    { type: "app", id: "github", label: { en: "GitHub", vi: "GitHub" }, icon: "", href: "https://github.com/cqminh" },
    { type: "app", id: "gmail", label: { en: "Gmail", vi: "Gmail" }, icon: "", href: "mailto:cqminh.it@gmail.com" },
    { type: "app", id: "facebook", label: { en: "Facebook", vi: "Facebook" }, icon: "", href: "https://www.facebook.com/chau.quang.minh.963855/" },
    { type: "app", id: "tiktok", label: { en: "TikTok", vi: "TikTok" }, icon: "", href: "https://www.tiktok.com/@markydayoi" },
    {
      type: "group",
      id: "languages",
      label: { en: "Languages", vi: "Ngôn ngữ" },
      children: [
        { id: "javascript", label: { en: "JavaScript", vi: "JavaScript" }, icon: "" },
        { id: "typescript", label: { en: "TypeScript", vi: "TypeScript" }, icon: "" },
        { id: "python", label: { en: "Python", vi: "Python" }, icon: "" },
        { id: "dart", label: { en: "Dart", vi: "Dart" }, icon: "" },
      ],
    },
    {
      type: "group",
      id: "frameworks",
      label: { en: "Frameworks", vi: "Framework" },
      children: [
        { id: "react-native", label: { en: "React Native", vi: "React Native" }, icon: "" },
        { id: "expo", label: { en: "Expo", vi: "Expo" }, icon: "" },
        { id: "flutter", label: { en: "Flutter", vi: "Flutter" }, icon: "" },
        { id: "nextjs", label: { en: "Next.js", vi: "Next.js" }, icon: "" },
        { id: "nodejs", label: { en: "Node.js", vi: "Node.js" }, icon: "" },
        { id: "react", label: { en: "React", vi: "React" }, icon: "" },
      ],
    },
    {
      type: "group",
      id: "database",
      label: { en: "Database", vi: "Cơ sở dữ liệu" },
      children: [
        { id: "postgresql", label: { en: "PostgreSQL", vi: "PostgreSQL" }, icon: "" },
        { id: "mongodb", label: { en: "MongoDB", vi: "MongoDB" }, icon: "" },
      ],
    },
    {
      type: "group",
      id: "tools",
      label: { en: "Tools & DevOps", vi: "Công cụ & DevOps" },
      children: [
        { id: "git", label: { en: "Git", vi: "Git" }, icon: "" },
        { id: "docker", label: { en: "Docker", vi: "Docker" }, icon: "" },
        { id: "postman", label: { en: "Postman", vi: "Postman" }, icon: "" },
        { id: "figma", label: { en: "Figma", vi: "Figma" }, icon: "" },
        { id: "vscode", label: { en: "VS Code", vi: "VS Code" }, icon: "" },
        { id: "github-actions", label: { en: "GitHub Actions", vi: "GitHub Actions" }, icon: "" },
      ],
    },
    {
      type: "group",
      id: "state-management",
      label: { en: "State Management", vi: "Quản lý State" },
      children: [
        { id: "redux", label: { en: "Redux", vi: "Redux" }, icon: "" },
        { id: "getx", label: { en: "GetX", vi: "GetX" }, icon: "" },
      ],
    },
    {
      type: "group",
      id: "backend-cloud",
      label: { en: "Backend & Cloud", vi: "Backend & Cloud" },
      children: [{ id: "rest-api", label: { en: "REST API", vi: "REST API" }, icon: "" }],
    },
  ],
};

const aboutSection = createContentSection<AboutEditableContent>("about", DEFAULT_ABOUT);
export const getAboutContent = aboutSection.get;
export const saveAboutContent = aboutSection.save;

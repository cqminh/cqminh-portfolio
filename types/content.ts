export type Language = 'en' | 'vi';

export type Localized = {
  en: string;
  vi: string;
};

export interface NavbarContent {
  resumeLabel: Localized;
}

export interface HeroContent {
  // Job titles come from the backend as plain strings with no translation;
  // 2+ entries rotate in the UI instead of being localized per-language.
  titles: string[];
  // Backend field: hero_slider_image. Plain image URLs, no translation.
  // Count is not fixed — the slider adapts to however many come back
  // (including 0 or 1).
  sliderImages: string[];
}

export interface AboutContent {
  heading: Localized;
  paragraphs: Localized[];
  skillsHeading: Localized;
  skills: string[];
}

export interface ProjectItem {
  id: string;
  title: Localized;
  description: Localized;
  tags: string[];
  link: string;
}

export interface ProjectsContent {
  heading: Localized;
  items: ProjectItem[];
}

export interface ExperienceItem {
  id: string;
  title: Localized;
  company: string;
  period: Localized;
  description: Localized;
}

export interface ExperienceContent {
  heading: Localized;
  items: ExperienceItem[];
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface ContactFormContent {
  nameLabel: Localized;
  namePlaceholder: Localized;
  emailLabel: Localized;
  emailPlaceholder: Localized;
  emailInvalid: Localized;
  messageLabel: Localized;
  messagePlaceholder: Localized;
  submitLabel: Localized;
  submittingLabel: Localized;
  successMessage: Localized;
  errorMessage: Localized;
}

export interface ContactContent {
  heading: Localized;
  connectHeading: Localized;
  intro: Localized;
  emailLabel: Localized;
  email: string;
  socialLabel: Localized;
  socialLinks: SocialLink[];
  form: ContactFormContent;
}

export interface LoadingScreenContent {
  messages: Localized[];
}

export interface SiteContent {
  navbar: NavbarContent;
  hero: HeroContent;
  about: AboutContent;
  projects: ProjectsContent;
  experience: ExperienceContent;
  contact: ContactContent;
  loadingScreen: LoadingScreenContent;
}

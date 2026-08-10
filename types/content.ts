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

export interface QuoteItem {
  id: string;
  content: Localized;
  author: string;
}

// A group's preview icon — decorative only, never individually clickable.
// `icon: ''` renders a lettered placeholder tile until a real image is set.
export interface PhoneAppChild {
  id: string;
  label: Localized;
  icon: string;
}

// A single tappable icon — personal info / social links (GitHub, email,
// phone...). The phone entry gets special handling: its href is a `tel:`
// link built from an editable phone number rather than a fixed profile URL,
// so swapping numbers later is just a content change.
export interface PhoneAppLink {
  type: 'app';
  id: string;
  label: Localized;
  icon: string;
  href: string;
}

// Looks like an iOS folder (a preview of the grouped icons) but doesn't
// open — it's a static stand-in for a tech-stack category (languages,
// frameworks...), not a real folder you can drill into.
export interface PhoneAppGroup {
  type: 'group';
  id: string;
  label: Localized;
  children: PhoneAppChild[];
}

export type PhoneAppItem = PhoneAppLink | PhoneAppGroup;

export interface AboutContent {
  heading: Localized;
  // Each entry is one sentence, rendered on its own line.
  intro: Localized[];
  phoneCaption: {
    before: Localized;
    highlight: Localized;
    after: Localized;
  };
  // Rendered as a 4-per-row app grid on the phone mockup's screen.
  phoneApps: PhoneAppItem[];
  // Shown briefly on the phone app tile when tapped on a non-touch device —
  // there's no dialer to hand a `tel:` link to, so it copies the number to
  // the clipboard instead and confirms with this label.
  phoneNumberCopiedLabel: Localized;
  quotes: QuoteItem[];
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

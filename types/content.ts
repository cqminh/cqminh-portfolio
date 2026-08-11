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
}

// A tech-stack badge, picked from `SiteContent.technologies` rather than
// typed by hand per project — keeps badge color/label consistent everywhere
// the same tech shows up.
export interface Technology {
  id: string;
  name: string;
  // Hex color, e.g. '#61DAFB'. Rendered as a tinted badge (low-opacity
  // background + full-color text/border) so it stays readable in both themes.
  color: string;
}

export interface ProjectItem {
  id: string;
  name: Localized;
  // Free-form range string per language rather than start/end dates —
  // some projects are still ongoing, so it needs to hold values like
  // "2023 - Present" / "2023 - Hiện tại".
  time: Localized;
  description: Localized;
  position: Localized;
  // Technology.id references into SiteContent.technologies — not free text.
  language: string[];
  // The project's standout image (hero shot or partner/client photo) —
  // used as the card's featured thumbnail.
  contactImage: string;
  // Both optional — the UI only shows a link button for whichever is set.
  githubLink?: string;
  projectLink?: string;
}

export interface ProjectsContent {
  viewProjectLabel: Localized;
  items: ProjectItem[];
}

// Fixed set of card accent presets for the Experience stack — deliberately
// not a free color picker. Each name maps to a light/dark pair of CSS vars
// defined in globals.css (--exp-<name>-bg / -border / -glow-rgb), chosen to
// already fit the site's palette and both themes, so a future admin form
// only ever offers this closed list as a <select> rather than raw color
// input.
export type ExperienceCardColor = 'blue' | 'purple' | 'green' | 'amber' | 'rose';

export const EXPERIENCE_CARD_COLORS: ExperienceCardColor[] = ['blue', 'purple', 'green', 'amber', 'rose'];

// This shape may end up sourced from the backend later — keep fields flat
// and easy to map from an API record rather than UI-shaped.
export interface ExperienceItem {
  id: string;
  title: Localized;
  company: string;
  startYear: number;
  // null means still ongoing — rendered with `presentLabel` instead of a year.
  endYear: number | null;
  description: Localized;
  // Same convention as ProjectItem.contactImage / PhoneAppChild.icon — empty
  // string renders a lettered placeholder tile instead of a broken <img>.
  image: string;
  // Card accent preset — see ExperienceCardColor.
  color: ExperienceCardColor;
}

export interface ExperienceContent {
  heading: Localized;
  presentLabel: Localized;
  items: ExperienceItem[];
}

export interface ContactContent {
  heading: Localized;
  connectHeading: Localized;
  // Same convention as ProjectItem.contactImage / ExperienceItem.image —
  // empty string falls back to the local /logo.png instead of a broken
  // <img>, so the card still has an avatar before the backend supplies one.
  avatar: string;
  intro: Localized;
  flipHint: Localized;
  backHint: Localized;
  emailLabel: Localized;
  email: string;
  // Social icons shown on the card's back are not listed here — they're
  // filtered straight out of `AboutContent.phoneApps` (see
  // CONTACT_SOCIAL_IDS in sections/Contact.tsx) so the two sections never
  // drift out of sync with two separately edited link lists.
  socialLabel: Localized;
}

// Admin-managed via the DB (see lib/site-content.ts), not part of the static
// content layer below — there's no hardcoded fallback copy for these.
export interface LoadingScreenContent {
  messages: Localized[];
}

// External link to the CV/resume file (e.g. a Google Drive share link) —
// not localized, and not stored in the repo. Empty string means unset: the
// navbar Resume button stays inert until an admin sets this.
export interface ResumeContent {
  url: string;
}

export interface FooterContent {
  // Not localized — always shown in English.
  copyright: string;
}

export interface SiteContent {
  navbar: NavbarContent;
  hero: HeroContent;
  about: AboutContent;
  technologies: Technology[];
  projects: ProjectsContent;
  experience: ExperienceContent;
  contact: ContactContent;
  footer: FooterContent;
}

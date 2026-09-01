import { Apple, ExternalLink, Globe } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { GooglePlayIcon } from './GooglePlayIcon';
import type { ProjectLinkType } from '@/types/content';

// One icon per ProjectLinkType (see types/content.ts). 'general' falls back
// to a plain external-link arrow — the same icon every project link used
// before per-type icons existed.
export function ProjectLinkIcon({ type, className }: { type: ProjectLinkType; className?: string }) {
  switch (type) {
    case 'web':
      return <Globe className={className} aria-hidden="true" />;
    case 'github':
      return <GithubIcon className={className} />;
    case 'appstore':
      return <Apple className={className} aria-hidden="true" />;
    case 'googleplay':
      return <GooglePlayIcon className={className} />;
    case 'general':
    default:
      return <ExternalLink className={className} aria-hidden="true" />;
  }
}

// Display label per type — proper nouns (GitHub, App Store, Google Play,
// Website) stay in English regardless of site language, same convention as
// the hardcoded "GitHub" label this replaces. 'general' has no fixed label
// here since callers show the localized viewProjectLabel for it instead.
export const PROJECT_LINK_LABELS: Record<Exclude<ProjectLinkType, 'general'>, string> = {
  web: 'Website',
  github: 'GitHub',
  appstore: 'App Store',
  googleplay: 'Google Play',
};

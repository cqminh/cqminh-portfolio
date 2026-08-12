'use client';

import { ExternalLink } from 'lucide-react';
import { siteContent } from '@/content/site-content';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { GithubIcon } from '@/components/ui/GithubIcon';
import type { ProjectItem, Technology } from '@/types/content';

// Cards share one reveal window (rather than each getting a fixed slice)
// so the whole grid always finishes revealing by progress 1, no matter how
// many projects end up configured.
const STAGGER_WINDOW = 0.6;
// Cards rise in from this far below their resting position (in vh, same
// unit About's phone reveal uses) — a couple pixels barely reads as a
// rise, so this needs to be a real fraction of viewport height.
const RISE_DISTANCE_VH = 25;

interface ProjectsProps {
  // Scroll-scrubbed 0 -> 1 driving each card's fade/rise-in. Owned by
  // MainSections, which pins this section the same way it pins About —
  // the whole grid has to fit in one viewport frame since there's no
  // extra scroll room for it, just this progress value.
  progress: number;
  // Admin-managed via the DB (see lib/site-content.ts) — not part of the
  // static content object below.
  items: ProjectItem[];
  technologies: Technology[];
}

export default function Projects({ progress, items, technologies }: ProjectsProps) {
  const { language } = useLanguage();
  const content = siteContent.projects;
  const technologyById = new Map(technologies.map((tech) => [tech.id, tech]));
  const itemCount = items.length;
  const step = itemCount > 1 ? (1 - STAGGER_WINDOW) / (itemCount - 1) : 0;

  const getItemStyle = (index: number) => {
    const itemProgress = Math.max(0, Math.min(1, (progress - index * step) / STAGGER_WINDOW));
    return {
      opacity: itemProgress,
      transform: `translateY(${(1 - itemProgress) * RISE_DISTANCE_VH}vh)`,
    };
  };

  return (
    <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-8 max-w-6xl 2xl:max-w-7xl mx-auto">
      {items.map((project, index) => (
        <div
          key={project.id}
          style={getItemStyle(index)}
          className="group relative overflow-hidden p-6 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--card-border-hover)] hover:shadow-lg transition-all"
        >
          {project.contactImage && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Both layers share the same object-position: our source
                  photos are portrait and get cropped hard on the sides to
                  cover a wide card, so centering them (the default) puts
                  their subject well left of the reveal band — this shifts
                  the crop window left, which pushes the subject rightward
                  into view under the mask below. Tune per how tight the
                  crop actually ends up. */}
              {/* Blurred base layer, covering the whole card — this is what
                  sits behind the left ~70% where the text lives, so it
                  never fights for contrast. Scaled up so blur() doesn't
                  sample transparent pixels past the image edge. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.contactImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                style={{ objectPosition: '25% center' }}
              />
              {/* Sharp layer, masked to only fade in from 70% across to
                  100% — the "clears up on the right" half of the effect. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.contactImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                style={{
                  objectPosition: '25% center',
                  maskImage: 'linear-gradient(to right, transparent 0%, transparent 70%, black 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 70%, black 100%)',
                }}
              />
            </div>
          )}

          <div className="relative">
            <h3 className="text-xl 2xl:text-2xl font-semibold mb-1 group-hover:text-[var(--accent)] transition-colors text-[var(--text-primary)]">
              {project.name[language]}
            </h3>

            <p className="text-sm text-[var(--text-secondary)] mb-3">
              {project.position[language]} · {project.time[language]}
            </p>

            <p className="text-[var(--text-secondary)] mb-4">
              {project.description[language]}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.language.map((techId) => {
                const tech = technologyById.get(techId);
                return (
                  <span
                    key={techId}
                    className="px-3 py-1 text-sm rounded-full border"
                    style={
                      tech
                        ? { backgroundColor: `${tech.color}1a`, color: tech.color, borderColor: `${tech.color}55` }
                        : { backgroundColor: 'var(--tag-bg)', color: 'var(--tag-text)', borderColor: 'transparent' }
                    }
                  >
                    {tech?.name ?? techId}
                  </span>
                );
              })}
            </div>

            {(project.githubLink || project.projectLink) && (
              <div className="flex gap-4 mt-4 pt-4 border-t border-[var(--card-border)]">
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                    GitHub
                  </a>
                )}
                {project.projectLink && (
                  <a
                    href={project.projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                  >
                    <ExternalLink size={16} />
                    {content.viewProjectLabel[language]}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

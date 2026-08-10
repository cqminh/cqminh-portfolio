'use client';

import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation';
import { siteContent } from '@/content/site-content';
import { useLanguage } from '@/components/providers/LanguageProvider';
import SectionTag from '@/components/ui/SectionTag';

export default function Projects() {
  const { language } = useLanguage();
  const content = siteContent.projects;
  const { ref, isVisible, getItemStyle } = useStaggeredAnimation(content.items.length);

  return (
    <section ref={ref} id="projects" className="relative py-20 px-6 max-w-6xl mx-auto border-t border-[var(--border)]">
      <SectionTag name={{ en: 'Projects', vi: 'DuAn' }} />
      <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.6s ease-out' }}>
        <h2 className="text-4xl font-bold mb-12 text-center text-[var(--text-primary)]">{content.heading[language]}</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {content.items.map((project, index) => (
          <a
            key={project.id}
            href={project.link}
            style={getItemStyle(index)}
            className="group p-6 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--card-border-hover)] hover:shadow-lg transition-all"
          >
            <h3 className="text-xl font-semibold mb-3 group-hover:text-[var(--accent)] transition-colors text-[var(--text-primary)]">
              {project.title[language]}
            </h3>

            <p className="text-[var(--text-secondary)] mb-4">
              {project.description[language]}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm rounded-full"
                  style={{ backgroundColor: 'var(--tag-bg)', color: 'var(--tag-text)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

'use client';

import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation';
import { siteContent } from '@/content/site-content';
import { useLanguage } from '@/components/providers/LanguageProvider';
import SectionTag from '@/components/ui/SectionTag';

export default function Experience() {
  const { language } = useLanguage();
  const content = siteContent.experience;
  const { ref, isVisible, getItemStyle } = useStaggeredAnimation(content.items.length);

  return (
    <section ref={ref} id="experience" className="relative py-20 px-6 max-w-6xl mx-auto border-t border-[var(--border)]">
      <SectionTag name={{ en: 'Experience', vi: 'KinhNghiem' }} />
      <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.6s ease-out' }}>
        <h2 className="text-4xl font-bold mb-12 text-center text-[var(--text-primary)]">{content.heading[language]}</h2>
      </div>

      <div className="space-y-8">
        {content.items.map((exp, index) => (
          <div
            key={exp.id}
            style={getItemStyle(index)}
            className="p-6 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--card-border-hover)] transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                  {exp.title[language]}
                </h3>
                <p className="text-[var(--accent)] font-medium">
                  {exp.company}
                </p>
              </div>
              <span className="text-sm text-[var(--text-muted)] font-medium">
                {exp.period[language]}
              </span>
            </div>

            <p className="text-[var(--text-secondary)]">
              {exp.description[language]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

'use client';

import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation';
import { siteContent } from '@/content/site-content';
import { useLanguage } from '@/components/LanguageProvider';

export default function About() {
  const { language } = useLanguage();
  const content = siteContent.about;
  const { ref, isVisible, getItemStyle } = useStaggeredAnimation(content.skills.length);

  return (
    <section ref={ref} id="about" className="py-20 px-6 max-w-6xl mx-auto border-t border-[var(--border)]">
      <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.6s ease-out' }}>
        <h2 className="text-4xl font-bold mb-12 text-center text-[var(--text-primary)]">{content.heading[language]}</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.6s ease-out 0.1s' }}>
          {content.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-lg text-[var(--text-secondary)] mb-6 last:mb-0">
              {paragraph[language]}
            </p>
          ))}
        </div>

        <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.6s ease-out 0.2s' }}>
          <h3 className="text-2xl font-semibold mb-6 text-[var(--text-primary)]">{content.skillsHeading[language]}</h3>
          <div className="grid grid-cols-2 gap-4">
            {content.skills.map((skill, index) => (
              <div
                key={skill}
                style={getItemStyle(index)}
                className="p-4 bg-[var(--card-bg)] rounded-lg text-center hover:bg-[var(--card-bg-hover)] transition-colors border border-[var(--card-border)]"
              >
                <p className="font-medium text-[var(--text-primary)]">{skill}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

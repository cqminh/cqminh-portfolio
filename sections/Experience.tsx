'use client';

import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation';

export default function Experience() {
  const experiences = [
    {
      title: 'Senior Developer',
      company: 'Tech Company Inc.',
      period: '2023 - Present',
      description: 'Led development of customer-facing applications, mentored junior developers, and improved system performance.',
    },
    {
      title: 'Full Stack Developer',
      company: 'Digital Solutions Ltd.',
      period: '2021 - 2023',
      description: 'Developed and maintained multiple web applications using React and Node.js, implemented CI/CD pipelines.',
    },
    {
      title: 'Junior Developer',
      company: 'StartUp Studio',
      period: '2020 - 2021',
      description: 'Built responsive web interfaces, fixed bugs, and contributed to backend services development.',
    },
  ];

  const { ref, isVisible, getItemStyle } = useStaggeredAnimation(experiences.length);

  return (
    <section ref={ref} id="experience" className="py-20 px-6 max-w-6xl mx-auto border-t border-[var(--border)]">
      <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.6s ease-out' }}>
        <h2 className="text-4xl font-bold mb-12 text-center text-[var(--text-primary)]">Experience</h2>
      </div>

      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div
            key={index}
            style={getItemStyle(index)}
            className="p-6 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--card-border-hover)] transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                  {exp.title}
                </h3>
                <p className="text-[var(--accent)] font-medium">
                  {exp.company}
                </p>
              </div>
              <span className="text-sm text-[var(--text-muted)] font-medium">
                {exp.period}
              </span>
            </div>

            <p className="text-[var(--text-secondary)]">
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

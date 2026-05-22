'use client';

import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation';

export default function About() {
  const { ref, isVisible, getItemStyle } = useStaggeredAnimation(8);

  const skills = [
    'JavaScript/TypeScript',
    'React & Next.js',
    'Node.js & Express',
    'Database Design',
    'Tailwind CSS',
    'Git & DevOps',
    'REST APIs',
    'Responsive Design',
  ];

  return (
    <section ref={ref} id="about" className="py-20 px-6 max-w-6xl mx-auto border-t border-[var(--border)]">
      <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.6s ease-out' }}>
        <h2 className="text-4xl font-bold mb-12 text-center text-[var(--text-primary)]">About Me</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.6s ease-out 0.1s' }}>
          <p className="text-lg text-[var(--text-secondary)] mb-6">
            I'm a passionate full-stack developer with a love for creating elegant solutions to complex problems.
            With expertise in modern web technologies, I've helped businesses transform their digital presence.
          </p>

          <p className="text-lg text-[var(--text-secondary)] mb-6">
            When I'm not coding, you'll find me exploring new technologies, contributing to open source,
            or sharing knowledge with the developer community.
          </p>

          <p className="text-lg text-[var(--text-secondary)]">
            My goal is to build products that are not only functional but also delightful to use.
          </p>
        </div>

        <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.6s ease-out 0.2s' }}>
          <h3 className="text-2xl font-semibold mb-6 text-[var(--text-primary)]">Skills & Technologies</h3>
          <div className="grid grid-cols-2 gap-4">
            {skills.map((skill, index) => (
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

'use client';

import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation';

export default function Projects() {
  const projects = [
    {
      title: 'Project One',
      description: 'A full-stack web application built with Next.js and PostgreSQL',
      tags: ['Next.js', 'React', 'TypeScript', 'PostgreSQL'],
      link: '#',
    },
    {
      title: 'Project Two',
      description: 'Real-time collaboration tool with WebSocket integration',
      tags: ['Node.js', 'WebSocket', 'React', 'MongoDB'],
      link: '#',
    },
    {
      title: 'Project Three',
      description: 'Mobile-responsive dashboard for data visualization',
      tags: ['React', 'Chart.js', 'Tailwind', 'API Integration'],
      link: '#',
    },
    {
      title: 'Project Four',
      description: 'E-commerce platform with payment integration',
      tags: ['Next.js', 'Stripe', 'Express', 'MySQL'],
      link: '#',
    },
  ];

  const { ref, isVisible, getItemStyle } = useStaggeredAnimation(projects.length);

  return (
    <section ref={ref} id="projects" className="py-20 px-6 max-w-6xl mx-auto border-t border-[var(--border)]">
      <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.6s ease-out' }}>
        <h2 className="text-4xl font-bold mb-12 text-center text-[var(--text-primary)]">Featured Projects</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <a
            key={index}
            href={project.link}
            style={getItemStyle(index)}
            className="group p-6 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[var(--card-border-hover)] hover:shadow-lg transition-all"
          >
            <h3 className="text-xl font-semibold mb-3 group-hover:text-[var(--accent)] transition-colors text-[var(--text-primary)]">
              {project.title}
            </h3>

            <p className="text-[var(--text-secondary)] mb-4">
              {project.description}
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

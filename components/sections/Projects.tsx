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
    <section ref={ref} id="projects" className="py-20 px-6 max-w-6xl mx-auto border-t border-gray-200 dark:border-gray-800">
      <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.6s ease-out' }}>
        <h2 className="text-4xl font-bold mb-12 text-center">Featured Projects</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <a
            key={index}
            href={project.link}
            style={getItemStyle(index)}
            className="group p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-600 dark:hover:border-blue-400 hover:shadow-lg transition-all"
          >
            <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {project.title}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full"
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

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

  return (
    <section id="experience" className="py-20 px-6 max-w-6xl mx-auto border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-4xl font-bold mb-12 text-center">Experience</h2>

      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-600 dark:hover:border-blue-400 transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {exp.title}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                  {exp.company}
                </p>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {exp.period}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-400">
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

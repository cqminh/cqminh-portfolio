export default function About() {
  return (
    <section id="about" className="py-20 px-6 max-w-6xl mx-auto border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-4xl font-bold mb-12 text-center">About Me</h2>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            I'm a passionate full-stack developer with a love for creating elegant solutions to complex problems.
            With expertise in modern web technologies, I've helped businesses transform their digital presence.
          </p>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            When I'm not coding, you'll find me exploring new technologies, contributing to open source,
            or sharing knowledge with the developer community.
          </p>

          <p className="text-lg text-gray-600 dark:text-gray-400">
            My goal is to build products that are not only functional but also delightful to use.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-6">Skills & Technologies</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              'JavaScript/TypeScript',
              'React & Next.js',
              'Node.js & Express',
              'Database Design',
              'Tailwind CSS',
              'Git & DevOps',
              'REST APIs',
              'Responsive Design',
            ].map((skill) => (
              <div
                key={skill}
                className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <p className="font-medium">{skill}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

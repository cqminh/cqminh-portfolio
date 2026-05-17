'use client';

import { useState } from 'react';
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const { ref, isVisible, getItemStyle } = useStaggeredAnimation(2);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section ref={ref} id="contact" className="py-20 px-6 max-w-6xl mx-auto border-t border-gray-200 dark:border-gray-800">
      <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.6s ease-out' }}>
        <h2 className="text-4xl font-bold mb-12 text-center">Get In Touch</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        <div style={getItemStyle(0)}>
          <h3 className="text-2xl font-semibold mb-6">Let's Connect</h3>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            I'm always interested in hearing about new projects and opportunities.
            Feel free to reach out if you have any questions or just want to say hello!
          </p>

          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">Email</p>
              <a
                href="mailto:hello@example.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                hello@example.com
              </a>
            </div>

            <div>
              <p className="font-semibold text-gray-900 dark:text-white mb-2">Social Media</p>
              <div className="flex gap-4">
                {['GitHub', 'LinkedIn', 'Twitter'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={getItemStyle(1)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none"
              placeholder="Your message here..."
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

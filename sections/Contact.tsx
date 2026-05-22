'use client';

import { useState } from 'react';
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [emailError, setEmailError] = useState('');

  const { ref, isVisible, getItemStyle } = useStaggeredAnimation(2);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === 'email') {
      setEmailError('');
    }
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={ref} id="contact" className="py-20 px-6 max-w-6xl mx-auto border-t border-[var(--border)]">
      <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.6s ease-out' }}>
        <h2 className="text-4xl font-bold mb-12 text-center text-[var(--text-primary)]">Get In Touch</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        <div style={getItemStyle(0)}>
          <h3 className="text-2xl font-semibold mb-6 text-[var(--text-primary)]">Let's Connect</h3>

          <p className="text-[var(--text-secondary)] mb-8">
            I'm always interested in hearing about new projects and opportunities.
            Feel free to reach out if you have any questions or just want to say hello!
          </p>

          <div className="space-y-4">
            <div>
              <p className="font-semibold text-[var(--text-primary)] mb-2">Email</p>
              <a
                href="mailto:hello@example.com"
                className="text-[var(--accent)] hover:underline"
              >
                hello@example.com
              </a>
            </div>

            <div>
              <p className="font-semibold text-[var(--text-primary)] mb-2">Social Media</p>
              <div className="flex gap-4">
                {['GitHub', 'LinkedIn', 'Twitter'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
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
            <label htmlFor="name" className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--input-border-focus)] transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 bg-[var(--input-bg)] border rounded-lg focus:outline-none focus:ring-2 transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)] ${
                emailError
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[var(--input-border)] focus:ring-[var(--input-border-focus)]'
              }`}
              placeholder="your.email@example.com"
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--input-border-focus)] transition-all resize-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              placeholder="Your message here..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-[var(--text-inverse)] rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>

          {submitStatus === 'success' && (
            <p className="text-green-600 text-sm text-center">
              Message sent successfully!
            </p>
          )}

          {submitStatus === 'error' && (
            <p className="text-red-600 text-sm text-center">
              Failed to send message. Please try again.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

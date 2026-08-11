'use client';

import { useRef, useState, type MouseEvent } from 'react';
import Image from 'next/image';
import { Mail, RefreshCw } from 'lucide-react';
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation';
import { siteContent } from '@/content/site-content';
import { useLanguage } from '@/components/providers/LanguageProvider';
import type { Language, PhoneAppLink } from '@/types/content';

// How far the card tilts toward the cursor, in degrees, at the very edge of
// the card — scaled down from that at the center to 0.
const MAX_TILT_DEG = 10;

// The only social platforms the back-of-card row is allowed to show — the
// links themselves are pulled from `about.phoneApps` (the one place they're
// maintained) so both sections stay in sync, but the icon marks below are
// drawn locally rather than reused from About's raster icons, since this
// row renders them as plain currentColor glyphs. Whichever of these ids
// isn't present in that list simply doesn't render.
const CONTACT_SOCIAL_IDS = new Set(['github', 'linkedin', 'facebook', 'tiktok']);

// Brand marks lucide doesn't ship (trademark reasons) — plain currentColor
// paths so they inherit the same icon color as Mail/RefreshCw above.
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.8 1.18 1.83 1.18 3.09 0 4.43-2.7 5.41-5.26 5.69.41.36.78 1.08.78 2.17 0 1.57-.01 2.83-.01 3.22 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  );
}

function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.6 5.82a4.9 4.9 0 0 1-3.77-4.32V1h-3.4v14.44a2.59 2.59 0 1 1-1.83-2.48v-3.45a5.94 5.94 0 0 0-1-.08 6.03 6.03 0 1 0 6.03 6.03V8.6a8.3 8.3 0 0 0 4.87 1.56V6.76a4.85 4.85 0 0 1-.9-.94Z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<string, (props: { className?: string }) => React.JSX.Element> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  facebook: FacebookIcon,
  tiktok: TiktokIcon,
};

function SocialIconLink({ social, language }: { social: PhoneAppLink; language: Language }) {
  const Icon = SOCIAL_ICONS[social.id];
  return (
    <a
      href={social.href}
      title={social.label[language]}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--nav-border)] bg-[rgba(255,255,255,0.15)] text-[var(--text-primary)] backdrop-blur-[12px] transition-all duration-300 hover:scale-110 hover:bg-[rgba(255,255,255,0.28)] dark:bg-[rgba(17,24,39,0.25)] dark:hover:bg-[rgba(17,24,39,0.4)] sm:h-11 sm:w-11"
    >
      {Icon ? <Icon className="h-4 w-4 sm:h-5 sm:w-5" /> : <span className="text-xs font-medium">{social.label[language].slice(0, 2)}</span>}
    </a>
  );
}

export default function Contact() {
  const { language } = useLanguage();
  const content = siteContent.contact;
  const socialLinks = siteContent.about.phoneApps.filter(
    (app): app is PhoneAppLink => app.type === 'app' && CONTACT_SOCIAL_IDS.has(app.id)
  );
  const { ref, isVisible, getItemStyle } = useStaggeredAnimation(1);

  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, mx: 50, my: 50 });
  const stageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rotateY: (px - 0.5) * MAX_TILT_DEG * 2,
      rotateX: -(py - 0.5) * MAX_TILT_DEG * 2,
      mx: px * 100,
      my: py * 100,
    });
  };

  const resetTilt = () => setTilt((prev) => ({ ...prev, rotateX: 0, rotateY: 0 }));

  const toggleFlip = () => setFlipped((prev) => !prev);
  const handleFrontKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFlip();
    }
  };

  return (
    <section ref={ref} id="contact" className="relative py-24 px-6 max-w-6xl mx-auto">
      <div
        style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.6s ease-out' }}
        className="flex flex-col items-center text-center gap-3"
      >
        <p
          className={`${language === 'en' ? 'font-courier' : 'font-nunito'} text-xs sm:text-sm tracking-[0.3em] uppercase`}
          style={{ color: 'var(--accent)' }}
        >
          {content.heading[language]}
        </p>
        <h2
          className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(90deg, var(--btn-resume-grad-1), var(--btn-resume-grad-2), var(--btn-resume-grad-3))',
          }}
        >
          {content.connectHeading[language]}
        </h2>
      </div>

      <div style={getItemStyle(0)} className="mt-14 flex flex-col items-center gap-5">
        <div
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={resetTilt}
          className="aspect-[5/6] w-full sm:aspect-[3/2]"
          style={{ maxWidth: '460px', perspective: '1600px' }}
        >
          <div
            className="relative h-full w-full"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY + (flipped ? 180 : 0)}deg)`,
              transition: 'transform 0.35s ease-out',
            }}
          >
            {/* Front face */}
            <div
              role="button"
              tabIndex={0}
              aria-label={content.flipHint[language]}
              onClick={toggleFlip}
              onKeyDown={handleFrontKeyDown}
              className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border p-5 text-center sm:gap-4 sm:p-8"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                boxShadow: '0 24px 48px -16px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-70"
                style={{
                  background: `radial-gradient(circle at ${tilt.mx}% ${tilt.my}%, rgba(255,255,255,0.16), transparent 55%)`,
                }}
              />
              <div className="relative h-11 w-11 flex-shrink-0 sm:h-16 sm:w-16">
                <Image src={content.avatar || '/logo.png'} alt="Logo" fill className="object-contain" sizes="64px" />
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)] sm:text-2xl">Châu Quang Minh</h3>
              <p className="line-clamp-3 max-w-[240px] text-xs text-[var(--text-secondary)] sm:line-clamp-none sm:max-w-sm sm:text-sm">
                {content.intro[language]}
              </p>
              <span className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] sm:mt-1 sm:text-xs">
                <RefreshCw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {content.flipHint[language]}
              </span>
            </div>

            {/* Back face */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-3xl border p-5 text-center sm:gap-6 sm:p-8"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                backgroundColor: 'var(--card-bg)',
                borderColor: 'var(--card-border)',
                boxShadow: '0 24px 48px -16px rgba(0, 0, 0, 0.3)',
              }}
            >
              <button
                type="button"
                onClick={toggleFlip}
                title={content.backHint[language]}
                className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full border border-[var(--nav-border)] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] sm:top-4 sm:right-4 sm:h-8 sm:w-8"
              >
                <RefreshCw className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>

              <div>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)] sm:mb-2">{content.emailLabel[language]}</p>
                <a
                  href={`mailto:${content.email}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent)] sm:text-lg"
                >
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: 'var(--accent)' }} />
                  {content.email}
                </a>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--text-muted)] sm:mb-3">{content.socialLabel[language]}</p>
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {socialLinks.map((social) => (
                    <SocialIconLink key={social.id} social={social} language={language} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

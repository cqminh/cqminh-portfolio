import { getAboutContent, getHeroContent, getLoadingScreenContent, getResumeContent } from "@/lib/site-content";
import { AboutForm } from "./AboutForm";
import { HeroForm } from "./HeroForm";
import { LoadingScreenForm } from "./LoadingScreenForm";
import { ResumeUrlForm } from "./ResumeUrlForm";

export default async function AdminContentPage() {
  const [{ messages }, { url: resumeUrl }, { titles, sliderImages }, { intro, phoneApps }] = await Promise.all([
    getLoadingScreenContent(),
    getResumeContent(),
    getHeroContent(),
    getAboutContent(),
  ]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Site content</h1>

      <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
        <h2 className="mb-1 text-sm font-medium text-[var(--text-secondary)]">Hero</h2>
        <p className="mb-4 text-xs text-[var(--text-muted)]">
          Job titles rotate in the hero heading. Slider images show as the portrait carousel — any number of each is fine.
        </p>

        <HeroForm titles={titles} images={sliderImages} />
      </section>

      <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
        <h2 className="mb-1 text-sm font-medium text-[var(--text-secondary)]">About</h2>
        <p className="mb-4 text-xs text-[var(--text-muted)]">
          Intro text next to the phone, plus the apps and groups shown on the phone screen.
        </p>

        <AboutForm intro={intro} phoneApps={phoneApps} />
      </section>

      <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
        <h2 className="mb-1 text-sm font-medium text-[var(--text-secondary)]">Loading screen</h2>
        <p className="mb-4 text-xs text-[var(--text-muted)]">
          Three messages, shown in order as the loading progress advances. Both languages are required.
        </p>

        <LoadingScreenForm messages={messages} />
      </section>

      <section className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
        <h2 className="mb-1 text-sm font-medium text-[var(--text-secondary)]">Resume</h2>
        <p className="mb-4 text-xs text-[var(--text-muted)]">
          Link opened in a new tab when a visitor clicks the navbar Resume button. Leave empty to keep the button inert.
        </p>

        <ResumeUrlForm url={resumeUrl} />
      </section>
    </div>
  );
}

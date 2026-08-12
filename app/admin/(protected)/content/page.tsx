import {
  getAboutContent,
  getContactContent,
  getExperienceContent,
  getHeroContent,
  getLoadingScreenContent,
  getProjectsContent,
  getResumeContent,
  getTechnologiesContent,
} from "@/lib/site-content";
import { AboutForm } from "./AboutForm";
import { ContactForm } from "./ContactForm";
import { ContentNav } from "./ContentNav";
import { ExperienceForm } from "./ExperienceForm";
import { HeroForm } from "./HeroForm";
import { LoadingScreenForm } from "./LoadingScreenForm";
import { ProjectsForm } from "./ProjectsForm";
import { ResumeUrlForm } from "./ResumeUrlForm";
import { TechnologiesForm } from "./TechnologiesForm";

const NAV_ITEMS = [
  { id: "hero", label: "Hero" },
  { id: "about", label: "About" },
  { id: "technologies", label: "Technologies" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
  { id: "loading-screen", label: "Loading screen" },
  { id: "resume", label: "Resume" },
];

export default async function AdminContentPage() {
  const [
    { messages },
    { url: resumeUrl },
    { titles, sliderImages },
    { intro, phoneApps },
    { items: projectItems },
    { items: technologies },
    { items: experienceItems },
    { intro: contactIntro, avatar: contactAvatar },
  ] = await Promise.all([
    getLoadingScreenContent(),
    getResumeContent(),
    getHeroContent(),
    getAboutContent(),
    getProjectsContent(),
    getTechnologiesContent(),
    getExperienceContent(),
    getContactContent(),
  ]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Site content</h1>

      <ContentNav items={NAV_ITEMS} />

      <section id="hero" className="scroll-mt-20 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
        <h2 className="mb-1 text-sm font-medium text-[var(--text-secondary)]">Hero</h2>
        <p className="mb-4 text-xs text-[var(--text-muted)]">
          Job titles rotate in the hero heading. Slider images show as the portrait carousel — any number of each is fine.
        </p>

        <HeroForm titles={titles} images={sliderImages} />
      </section>

      <section id="about" className="scroll-mt-20 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
        <h2 className="mb-1 text-sm font-medium text-[var(--text-secondary)]">About</h2>
        <p className="mb-4 text-xs text-[var(--text-muted)]">
          Intro text next to the phone, plus the apps and groups shown on the phone screen.
        </p>

        <AboutForm intro={intro} phoneApps={phoneApps} />
      </section>

      <section id="technologies" className="scroll-mt-20 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
        <h2 className="mb-1 text-sm font-medium text-[var(--text-secondary)]">Technologies</h2>
        <p className="mb-4 text-xs text-[var(--text-muted)]">
          The shared badge catalog projects pick from below. The key is what a project&apos;s tech list references — renaming one here
          just changes how that badge looks everywhere it&apos;s already used.
        </p>

        <TechnologiesForm items={technologies} />
      </section>

      <section id="projects" className="scroll-mt-20 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
        <h2 className="mb-1 text-sm font-medium text-[var(--text-secondary)]">Projects</h2>
        <p className="mb-4 text-xs text-[var(--text-muted)]">
          Cards shown in the project grid. Any number of projects is fine — technologies are picked from the shared badge catalog above.
        </p>

        <ProjectsForm items={projectItems} technologies={technologies} />
      </section>

      <section id="experience" className="scroll-mt-20 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
        <h2 className="mb-1 text-sm font-medium text-[var(--text-secondary)]">Experience</h2>
        <p className="mb-4 text-xs text-[var(--text-muted)]">
          Entries shown in the timeline, newest-looking first isn&apos;t enforced — order here is the order they appear in.
        </p>

        <ExperienceForm items={experienceItems} />
      </section>

      <section id="contact" className="scroll-mt-20 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
        <h2 className="mb-1 text-sm font-medium text-[var(--text-secondary)]">Contact</h2>
        <p className="mb-4 text-xs text-[var(--text-muted)]">
          Blurb shown on the front of the flip card. Everything else on that card (email, socials) is pulled from About above.
        </p>

        <ContactForm intro={contactIntro} avatar={contactAvatar} />
      </section>

      <section id="loading-screen" className="scroll-mt-20 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
        <h2 className="mb-1 text-sm font-medium text-[var(--text-secondary)]">Loading screen</h2>
        <p className="mb-4 text-xs text-[var(--text-muted)]">
          Three messages, shown in order as the loading progress advances. Both languages are required.
        </p>

        <LoadingScreenForm messages={messages} />
      </section>

      <section id="resume" className="scroll-mt-20 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
        <h2 className="mb-1 text-sm font-medium text-[var(--text-secondary)]">Resume</h2>
        <p className="mb-4 text-xs text-[var(--text-muted)]">
          Link opened in a new tab when a visitor clicks the navbar Resume button. Leave empty to keep the button inert.
        </p>

        <ResumeUrlForm url={resumeUrl} />
      </section>
    </div>
  );
}

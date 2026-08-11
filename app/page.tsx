import Hero from '@/sections/Hero';
import MainSections from '@/sections/MainSections';
import Contact from '@/sections/Contact';
import Footer from '@/sections/Footer';
import Navbar from '@/components/layout/Navbar';
import FloatingSettingsButton from '@/components/ui/FloatingSettingsButton';
import { getAboutContent, getHeroContent, getResumeContent } from '@/lib/site-content';

export default async function Home() {
  const [{ url: resumeUrl }, { titles, sliderImages }, { intro: aboutIntro, phoneApps: aboutApps }] = await Promise.all([
    getResumeContent(),
    getHeroContent(),
    getAboutContent(),
  ]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <Navbar resumeUrl={resumeUrl} />
      <FloatingSettingsButton />
      <Hero titles={titles} sliderImages={sliderImages} />
      <MainSections aboutIntro={aboutIntro} aboutApps={aboutApps} />
      <Contact phoneApps={aboutApps} />
      <Footer />
    </div>
  );
}

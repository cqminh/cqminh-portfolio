import Hero from '@/sections/Hero';
import MainSections from '@/sections/MainSections';
import Contact from '@/sections/Contact';
import Footer from '@/sections/Footer';
import Navbar from '@/components/layout/Navbar';
import FloatingSettingsButton from '@/components/ui/FloatingSettingsButton';
import { getResumeContent } from '@/lib/site-content';

export default async function Home() {
  const { url: resumeUrl } = await getResumeContent();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <Navbar resumeUrl={resumeUrl} />
      <FloatingSettingsButton />
      <Hero />
      <MainSections />
      <Contact />
      <Footer />
    </div>
  );
}

'use client';

import Hero from '@/sections/Hero';
import MainSections from '@/sections/MainSections';
import Contact from '@/sections/Contact';
import Footer from '@/sections/Footer';
import Navbar from '@/components/layout/Navbar';
import FloatingSettingsButton from '@/components/ui/FloatingSettingsButton';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <Navbar />
      <FloatingSettingsButton />
      <Hero />
      <MainSections />
      <Contact />
      <Footer />
    </div>
  );
}

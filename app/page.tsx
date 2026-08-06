'use client';

import Hero from '@/sections/Hero';
import About from '@/sections/About';
import Projects from '@/sections/Projects';
import Experience from '@/sections/Experience';
import Contact from '@/sections/Contact';
import Navbar from '@/components/layout/Navbar';
import FloatingSettingsButton from '@/components/ui/FloatingSettingsButton';

export default function Home() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <Navbar />
      <FloatingSettingsButton />
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Contact />
    </div>
  );
}

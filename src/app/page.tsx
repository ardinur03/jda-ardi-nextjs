import { About } from '@/components/about';
import { Contact } from '@/components/contact';
import { Hero } from '@/components/hero';
import { Projects } from '@/components/projects';
import { Skills } from '@/components/skills';
import { Stats } from '@/components/stats';
import { Testimonials } from '@/components/testimonials';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center">
      <Hero />
      <Skills />
      <Projects />
      <Stats />
      <Testimonials />
      <Contact />
    </main>
  );
}

import { Link as RouterLink } from 'react-router-dom';

import { GlobeAnimation } from '@/components/GlobeAnimation';
import { buttonVariants } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import DefaultLayout from '@/layouts/default';

export default function LandingPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 py-16 text-center md:py-24">
        <h1 className="max-w-2xl font-serif text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          Plan your <span className="italic text-accent">perfect trip</span>
          <br />
          with AI
        </h1>
        <p className="max-w-md text-lg text-ink-soft">
          {siteConfig.description}
        </p>

        <RouterLink
          aria-label="Start planning your trip"
          className={buttonVariants({ variant: 'primary', size: 'md' })}
          to="/planner"
        >
          <GlobeAnimation size={22} />
          Start
        </RouterLink>
      </section>
    </DefaultLayout>
  );
}

import { Compass, Github, Linkedin } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

import { siteConfig } from '@/config/site';

export function SiteHeader() {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 sm:px-8">
      <RouterLink
        className="flex items-center gap-2.5 font-serif text-[22px] font-medium text-ink"
        to="/"
      >
        <span className="grid size-6 place-items-center rounded-full border border-ink/15 bg-[conic-gradient(from_45deg,#567a26,#2f7d5c,#ded5c5,#567a26)] shadow-[inset_0_0_0_4px_rgba(248,244,236,0.55)]">
          <span className="size-2 rounded-full bg-paper-bright" />
        </span>
        {siteConfig.name}
      </RouterLink>
      <div className="hidden items-center gap-4 text-ink-soft sm:flex">
        <a
          aria-label="Visit our GitHub repository"
          className="transition-colors hover:text-ink"
          href={siteConfig.links.github}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Github size={20} />
        </a>
        <a
          aria-label="Visit our LinkedIn page"
          className="transition-colors hover:text-ink"
          href={siteConfig.links.linkedin}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Linkedin size={20} />
        </a>
        <a
          aria-label="Visit my portfolio"
          className="transition-colors hover:text-ink"
          href={siteConfig.links.portfolio}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Compass size={20} />
        </a>
      </div>
    </header>
  );
}

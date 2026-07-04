import { Github, Linkedin, Compass } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

import { siteConfig } from '@/config/site';

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between border-b border-line bg-panel px-6 py-4 sm:px-8">
      <RouterLink
        className="font-serif text-lg font-bold tracking-tight text-ink"
        to="/"
      >
        Trip<span className="text-accent">Atlas</span>
      </RouterLink>
      <div className="flex items-center gap-4 text-ink-soft">
        <a
          aria-label="Visit our GitHub repository"
          href={siteConfig.links.github}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Github className="hover:text-ink" size={20} />
        </a>
        <a
          aria-label="Visit our LinkedIn page"
          href={siteConfig.links.linkedin}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Linkedin className="hover:text-ink" size={20} />
        </a>
        <a
          aria-label="Visit my portfolio"
          href={siteConfig.links.portfolio}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Compass className="hover:text-ink" size={20} />
        </a>
      </div>
    </header>
  );
}

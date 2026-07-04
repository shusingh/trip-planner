import { CircleUserRound, Github, Linkedin } from 'lucide-react';
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
      <div className="hidden items-center gap-2 sm:flex">
        {[
          { label: 'GitHub repository', href: siteConfig.links.github, Icon: Github },
          { label: 'LinkedIn', href: siteConfig.links.linkedin, Icon: Linkedin },
          { label: 'Portfolio', href: siteConfig.links.portfolio, Icon: CircleUserRound },
        ].map(({ label, href, Icon }) => (
          <a
            key={label}
            aria-label={label}
            className="grid size-9 place-items-center rounded-full border border-line bg-paper-bright/90 text-ink-soft shadow-[0_6px_18px_-12px_rgba(26,26,31,0.5)] transition-colors hover:border-accent/40 hover:bg-paper-bright hover:text-accent-deep"
            href={href}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon size={17} />
          </a>
        ))}
      </div>
    </header>
  );
}

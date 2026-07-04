import { SiteHeader } from '@/components/SiteHeader';
import { siteConfig } from '@/config/site';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <SiteHeader />
      <main className="relative z-10 w-full flex-grow">{children}</main>
      <footer className="relative z-10 flex w-full items-center justify-center border-t border-line px-6 py-6 text-sm text-ink-soft">
        Made by{' '}
        <a
          className="ml-1 font-semibold text-accent-deep hover:opacity-80"
          href={siteConfig.links.linkedin}
          rel="noopener noreferrer"
          target="_blank"
        >
          Shubham Singh
        </a>
      </footer>
    </div>
  );
}

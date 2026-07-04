import { SiteHeader } from '@/components/SiteHeader';
import { siteConfig } from '@/config/site';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-grow px-6 pt-16">
        {children}
      </main>
      <footer className="flex w-full items-center justify-center py-6 text-sm text-ink-soft">
        Made with ❤️ by{' '}
        <a
          className="ml-1 text-accent-deep hover:opacity-80"
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

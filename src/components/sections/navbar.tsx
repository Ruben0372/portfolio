'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { id: 'about', label: 'About', href: '/' },
  { id: 'projects', label: 'Projects', href: '/projects' },
  { id: 'blog', label: 'Blog', href: '/blog' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] transition-all duration-300',
        scrolled || !isHome
          ? 'bg-[#050508]/70 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          ruben<span className="text-amber-400">.dev</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={cn(
                'relative px-3 py-1.5 text-sm transition-colors',
                pathname.startsWith(link.href) && link.href !== '/'
                  ? 'text-white'
                  : 'text-white/50 hover:text-white'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="mailto:ru93ben@icloud.com"
          className="hidden md:inline-flex text-sm font-medium px-4 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.06] transition-all text-amber-400"
        >
          Let&apos;s Talk
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          className="md:hidden p-2"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#050508]/95 backdrop-blur-xl">
          <div className="px-6 py-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors text-white/50"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

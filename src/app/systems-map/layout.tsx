import Link from "next/link";

export default function SystemsMapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Minimal nav for systems-map route */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-brand-bg)]/80 backdrop-blur-md border-b border-white/5">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-mono text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-amber)] transition-colors"
          >
            &larr; Home
          </Link>
          <span className="text-xs font-mono tracking-widest uppercase text-[var(--color-brand-amber)]">
            Systems Map
          </span>
        </div>
      </nav>
      {children}
    </>
  );
}

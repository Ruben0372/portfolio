import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[var(--color-brand-text-muted)]">
          &copy; {new Date().getFullYear()} Ruben. Built with Next.js.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Ruben0372"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-text)] transition-colors"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href="https://linkedin.com/in/ruben"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-text)] transition-colors"
          >
            <Linkedin className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href="mailto:ru93ben@gmail.com"
            aria-label="Send email"
            className="text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-text)] transition-colors"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Shield, Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-surface/30">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <Shield className="h-4 w-4 text-accent" />
            </div>
            <span className="text-base font-bold">
              ruben<span className="text-accent">.</span>dev
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <Link href="/projects" className="hover:text-text transition-colors">
              Projects
            </Link>
            <Link href="/about" className="hover:text-text transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-text transition-colors">
              Contact
            </Link>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Ruben0372"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 text-text-muted transition-all hover:border-accent/50 hover:text-accent hover:bg-accent/5"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com/in/ruben"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 text-text-muted transition-all hover:border-accent/50 hover:text-accent hover:bg-accent/5"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="mailto:ru93ben@gmail.com"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 text-text-muted transition-all hover:border-accent/50 hover:text-accent hover:bg-accent/5"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/30 text-center text-xs text-text-muted">
          &copy; {new Date().getFullYear()} Ruben. Built with security in mind.
        </div>
      </div>
    </footer>
  );
}

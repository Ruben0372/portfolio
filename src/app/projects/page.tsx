import type { Metadata } from "next";
import Link from "next/link";
import { Github, ExternalLink, ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import { ProjectList } from "./project-list";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Security tools, full-stack platforms, and infrastructure projects — all deployed and tested in real environments.",
};

const categoryColors: Record<string, string> = {
  security:
    "text-[var(--color-brand-success)] bg-[var(--color-brand-success)]/10 border-[var(--color-brand-success)]/20",
  fullstack:
    "text-[var(--color-brand-amber)] bg-[var(--color-brand-amber)]/10 border-[var(--color-brand-amber)]/20",
  infrastructure:
    "text-[var(--color-brand-blue)] bg-[var(--color-brand-blue)]/10 border-[var(--color-brand-blue)]/20",
  tools:
    "text-[var(--color-brand-yellow)] bg-[var(--color-brand-yellow)]/10 border-[var(--color-brand-yellow)]/20",
};

export default function ProjectsPage() {
  return (
    <main id="main-content" className="min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-6xl px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-amber)] transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to home
        </Link>

        <div className="mb-16">
          <span className="text-xs font-mono tracking-widest uppercase text-[var(--color-brand-amber)]">
            Portfolio
          </span>
          <h1 className="mt-3 font-heading text-4xl sm:text-5xl font-bold tracking-tight text-[var(--color-brand-text-heading)]">
            All Projects
          </h1>
          <p className="mt-4 max-w-2xl text-[var(--color-brand-text-muted)] leading-relaxed">
            Every project here was deployed and tested in real environments. From
            custom TLS tunnels to enterprise file-sharing platforms — each one
            reflects my approach to building secure, well-engineered software.
          </p>
        </div>

        <ProjectList projects={projects} categoryColors={categoryColors} />
      </div>
    </main>
  );
}

'use client';

import { Github, ExternalLink } from 'lucide-react';
import type { Project } from '@/data/projects';

interface ProjectListProps {
  projects: Project[];
  categoryColors: Record<string, string>;
}

export function ProjectList({ projects, categoryColors }: ProjectListProps) {
  return (
    <div className="space-y-8">
      {projects.map((project) => (
        <div
          key={project.slug}
          id={project.slug}
          className="rounded-2xl border border-[var(--color-brand-border)]/50 bg-[var(--color-brand-surface)]/50 p-8 scroll-mt-24 hover:border-[var(--color-brand-amber)]/20 transition-all"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                categoryColors[project.category] ?? ''
              }`}
            >
              {project.category}
            </span>
            {project.featured && (
              <span className="inline-flex items-center rounded-full border border-[#facc15]/20 bg-[#facc15]/10 px-3 py-1 text-xs font-semibold text-[#facc15]">
                Featured
              </span>
            )}
          </div>

          <h2 className="text-2xl font-bold text-[var(--color-brand-text-heading)]">
            {project.title}
          </h2>
          <p className="mt-1 text-[var(--color-brand-amber)] font-medium text-sm">
            {project.tagline}
          </p>
          <p className="mt-4 text-[var(--color-brand-text-muted)] text-sm leading-relaxed max-w-3xl">
            {project.description}
          </p>

          {project.architecture && (
            <div className="mt-5 rounded-xl border border-[var(--color-brand-border)]/40 bg-[var(--color-brand-bg)]/50 p-5 overflow-x-auto">
              <pre className="font-mono text-xs text-[var(--color-brand-text-muted)] whitespace-pre leading-relaxed">
                {project.architecture.trim()}
              </pre>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-xs font-semibold text-[var(--color-brand-text-muted)] uppercase tracking-wider mb-3">
              Key Highlights
            </h3>
            <ul className="grid md:grid-cols-2 gap-2">
              {project.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-2 text-sm text-[var(--color-brand-text-muted)]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-brand-success)] flex-shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-lg border border-[var(--color-brand-border)]/40 bg-[var(--color-brand-surface-2)] px-3 py-1.5 text-xs font-medium text-[var(--color-brand-text-muted)]"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-[var(--color-brand-border)] px-4 py-2 text-sm font-medium transition-all hover:border-[var(--color-brand-amber)]/50 hover:bg-[var(--color-brand-surface)]"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                View Source
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-[var(--color-brand-amber)] px-4 py-2 text-sm font-semibold text-[var(--color-brand-bg)] transition-all hover:bg-[var(--color-brand-amber-hover)]"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Live Demo
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

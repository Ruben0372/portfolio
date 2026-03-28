"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { projects } from "@/data/projects";

const categoryColors: Record<string, string> = {
  security: "text-green bg-green/10 border-green/20",
  fullstack: "text-accent bg-accent/10 border-accent/20",
  infrastructure: "text-blue bg-blue/10 border-blue/20",
  tools: "text-yellow bg-yellow/10 border-yellow/20",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <span className="text-xs font-semibold text-accent tracking-widest uppercase">
            Portfolio
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
            All Projects
          </h1>
          <p className="mt-4 max-w-2xl text-text-muted leading-relaxed">
            Every project here was deployed and tested in real environments. From
            custom TLS tunnels to enterprise file-sharing platforms — each one
            reflects my approach to building secure, well-engineered software.
          </p>
        </motion.div>

        {/* Projects */}
        <div className="space-y-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.slug}
              id={project.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border/50 bg-surface/50 p-8 scroll-mt-24 hover:border-accent/20 transition-all"
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                    categoryColors[project.category]
                  }`}
                >
                  {project.category}
                </span>
                {project.featured && (
                  <span className="inline-flex items-center rounded-full border border-yellow/20 bg-yellow/10 px-3 py-1 text-xs font-semibold text-yellow">
                    Featured
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold">{project.title}</h2>
              <p className="mt-1 text-accent font-medium text-sm">
                {project.tagline}
              </p>
              <p className="mt-4 text-text-muted text-sm leading-relaxed max-w-3xl">
                {project.description}
              </p>

              {/* Architecture (for Atlax) */}
              {project.architecture && (
                <div className="mt-5 rounded-xl border border-border/40 bg-bg/50 p-5 overflow-x-auto">
                  <pre className="font-mono text-xs text-text-muted whitespace-pre leading-relaxed">
                    {project.architecture.trim()}
                  </pre>
                </div>
              )}

              {/* Highlights */}
              <div className="mt-6">
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                  Key Highlights
                </h3>
                <ul className="grid md:grid-cols-2 gap-2">
                  {project.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2 text-sm text-text-muted"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech */}
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg border border-border/40 bg-surface-2 px-3 py-1.5 text-xs font-medium text-text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="mt-6 flex items-center gap-4">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-all hover:border-accent/50 hover:bg-surface"
                  >
                    <Github className="h-4 w-4" />
                    View Source
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-accent-hover"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live Demo
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

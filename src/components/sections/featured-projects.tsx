"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { projects } from "@/data/projects";

const categoryColors: Record<string, string> = {
  security: "text-green bg-green/10 border-green/20",
  fullstack: "text-accent bg-accent/10 border-accent/20",
  infrastructure: "text-blue bg-blue/10 border-blue/20",
  tools: "text-yellow bg-yellow/10 border-yellow/20",
};

export function FeaturedProjects() {
  const featured = projects.filter((p) => p.featured);
  const atlax = projects.find((p) => p.slug === "atlax")!;
  const rest = featured.filter((p) => p.slug !== "atlax");

  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold text-accent tracking-widest uppercase">
            Featured Work
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            Built in production,{" "}
            <span className="text-text-muted">not in tutorials.</span>
          </h2>
        </motion.div>

        {/* Hero Project — Atlax */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 rounded-2xl border border-border/50 bg-surface/50 overflow-hidden group hover:border-accent/30 transition-all"
        >
          <div className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-5">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                  categoryColors[atlax.category]
                }`}
              >
                {atlax.category}
              </span>
              <span className="inline-flex items-center rounded-full border border-yellow/20 bg-yellow/10 px-3 py-1 text-xs font-semibold text-yellow">
                Featured
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold">{atlax.title}</h3>
            <p className="mt-1 text-base text-accent font-medium">
              {atlax.tagline}
            </p>
            <p className="mt-4 max-w-3xl text-sm text-text-muted leading-relaxed">
              {atlax.description}
            </p>

            {/* Architecture diagram */}
            {atlax.architecture && (
              <div className="mt-6 rounded-xl border border-border/40 bg-bg/50 p-5 overflow-x-auto">
                <pre className="font-mono text-xs text-text-muted whitespace-pre leading-relaxed">
                  {atlax.architecture.trim()}
                </pre>
              </div>
            )}

            {/* Tech + Highlights */}
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                  Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {atlax.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-lg border border-border/50 bg-surface-2 px-3 py-1.5 text-xs font-medium text-text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                  Key Highlights
                </h4>
                <ul className="space-y-2">
                  {atlax.highlights.slice(0, 3).map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2 text-xs text-text-muted"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Links */}
            <div className="mt-8 flex items-center gap-4">
              {atlax.github && (
                <a
                  href={atlax.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-all hover:border-accent/50 hover:bg-surface"
                >
                  <Github className="h-4 w-4" />
                  View Source
                </a>
              )}
              <Link
                href={`/projects#${atlax.slug}`}
                className="flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
              >
                Full Case Study
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Other featured */}
        <div className="grid md:grid-cols-2 gap-5">
          {rest.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border/50 bg-surface/50 p-7 group hover:border-accent/30 transition-all"
            >
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                  categoryColors[project.category]
                }`}
              >
                {project.category}
              </span>

              <h3 className="mt-4 text-xl font-bold">{project.title}</h3>
              <p className="mt-1 text-sm text-accent font-medium">
                {project.tagline}
              </p>
              <p className="mt-3 text-sm text-text-muted leading-relaxed line-clamp-3">
                {project.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {project.tech.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-border/40 bg-surface-2 px-2.5 py-1 text-xs text-text-muted"
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
                    className="flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    Source
                  </a>
                )}
                <Link
                  href={`/projects#${project.slug}`}
                  className="flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* See all */}
        <div className="mt-12 text-center">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
          >
            View All Projects
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

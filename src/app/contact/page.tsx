"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin, MessageSquare, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <span className="text-xs font-semibold text-green tracking-widest uppercase">
            Contact
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
            Let&apos;s talk about{" "}
            <span className="gradient-text">your project.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-text-muted leading-relaxed">
            Whether you need a security audit, a secure web application, or a
            hardened CI/CD pipeline — I&apos;m here to help. Reach out and I&apos;ll
            respond within a few hours.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <a
              href="mailto:ru93ben@gmail.com"
              className="flex items-center gap-4 rounded-xl border border-border/50 bg-surface/50 p-5 transition-all hover:border-accent/30 hover:bg-surface group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 transition-colors group-hover:bg-accent/15">
                <Mail className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold">Email</p>
                <p className="text-sm text-text-muted">ru93ben@gmail.com</p>
              </div>
            </a>

            <a
              href="https://github.com/Ruben0372"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl border border-border/50 bg-surface/50 p-5 transition-all hover:border-accent/30 hover:bg-surface group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 transition-colors group-hover:bg-accent/15">
                <Github className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold">GitHub</p>
                <p className="text-sm text-text-muted">github.com/Ruben0372</p>
              </div>
            </a>

            <a
              href="https://linkedin.com/in/ruben"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl border border-border/50 bg-surface/50 p-5 transition-all hover:border-accent/30 hover:bg-surface group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 transition-colors group-hover:bg-accent/15">
                <Linkedin className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold">LinkedIn</p>
                <p className="text-sm text-text-muted">Connect with me</p>
              </div>
            </a>

            {/* Upwork / Fiverr */}
            <div className="rounded-xl border border-border/50 bg-surface/50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare className="h-5 w-5 text-green" />
                <p className="text-sm font-semibold">Freelance Platforms</p>
              </div>
              <div className="space-y-2 text-sm text-text-muted">
                <p>Upwork: <span className="text-text">Available for hire</span></p>
                <p>Fiverr: <span className="text-text">Available for hire</span></p>
              </div>
            </div>
          </motion.div>

          {/* What to expect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border/50 bg-surface/50 p-7"
          >
            <h3 className="text-lg font-bold mb-6">What to expect</h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green/10 flex-shrink-0">
                  <Clock className="h-4 w-4 text-green" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Fast Response</p>
                  <p className="text-sm text-text-muted">
                    I respond within 2 hours during business days. For urgent
                    security issues, even faster.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 flex-shrink-0">
                  <span className="text-accent text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">Discovery Call</p>
                  <p className="text-sm text-text-muted">
                    We&apos;ll discuss your project, security needs, timeline, and
                    budget. No pressure, just clarity.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 flex-shrink-0">
                  <span className="text-accent text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">Proposal</p>
                  <p className="text-sm text-text-muted">
                    I&apos;ll send a clear scope, timeline, and pricing. You&apos;ll know
                    exactly what you&apos;re getting.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 flex-shrink-0">
                  <span className="text-accent text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">Build & Ship</p>
                  <p className="text-sm text-text-muted">
                    Iterative delivery with regular check-ins. You see progress
                    throughout, not just at the end.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

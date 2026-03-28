"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl border border-border/50 bg-surface/50 p-10 md:p-14 text-center overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-40 w-80 bg-accent/10 blur-3xl rounded-full" />

          <div className="relative z-10">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 mb-6">
              <Shield className="h-7 w-7 text-accent" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Need an app that&apos;s{" "}
              <span className="gradient-text">built to last?</span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-text-muted leading-relaxed">
              I&apos;m available for freelance projects. Whether you need a secure web
              app, a CI/CD pipeline with security gates, or a full security audit
              of your codebase — let&apos;s talk.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/20"
              >
                Start a Conversation
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <span className="text-sm text-text-muted">
                Typically responds within 2 hours
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

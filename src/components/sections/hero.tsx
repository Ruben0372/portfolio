"use client";

import { motion } from "framer-motion";
import { Shield, ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/80 to-bg" />

      {/* Animated glow orbs */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-green/5 blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-24 pb-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5"
        >
          <Shield className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs font-semibold text-accent tracking-wide uppercase">
            Available for Freelance
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]"
        >
          I build apps that
          <br />
          <span className="gradient-text">don&apos;t get hacked.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-text-muted leading-relaxed"
        >
          Full-stack developer with a security engineering focus. I ship features
          fast without cutting corners on security — from secure auth to hardened
          CI/CD pipelines.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/projects"
            className="group flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-accent-hover hover:shadow-xl hover:shadow-accent/20"
          >
            View My Work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/contact"
            className="flex items-center gap-2 rounded-xl border border-border px-7 py-3.5 text-sm font-semibold text-text transition-all hover:border-accent/50 hover:bg-surface"
          >
            <Terminal className="h-4 w-4 text-green" />
            Let&apos;s Talk Security
          </Link>
        </motion.div>

        {/* Terminal preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-16 max-w-2xl"
        >
          <div className="rounded-xl border border-border/60 bg-surface overflow-hidden shadow-2xl shadow-black/20">
            {/* Terminal header */}
            <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red/60" />
              <div className="h-3 w-3 rounded-full bg-yellow/60" />
              <div className="h-3 w-3 rounded-full bg-green/60" />
              <span className="ml-2 text-xs text-text-muted font-mono">~/projects</span>
            </div>
            {/* Terminal body */}
            <div className="p-5 font-mono text-sm leading-relaxed">
              <div className="text-text-muted">
                <span className="text-green">ruben</span>
                <span className="text-text-muted">@</span>
                <span className="text-blue">arch</span>
                <span className="text-text-muted"> ~ $ </span>
                <span className="text-text">cat services.yml</span>
              </div>
              <div className="mt-3 space-y-1 text-text-muted">
                <div><span className="text-accent">security_audit</span>: &quot;Find vulnerabilities before attackers do&quot;</div>
                <div><span className="text-accent">secure_dev</span>: &quot;Build with OWASP Top 10 from day one&quot;</div>
                <div><span className="text-accent">cicd_security</span>: &quot;Automated scanning in every pipeline&quot;</div>
                <div><span className="text-accent">cloud_hardening</span>: &quot;Infrastructure that sleeps soundly&quot;</div>
              </div>
              <div className="mt-3 text-text-muted">
                <span className="text-green">ruben</span>
                <span className="text-text-muted">@</span>
                <span className="text-blue">arch</span>
                <span className="text-text-muted"> ~ $ </span>
                <span className="inline-block w-2 h-4 bg-green/80 animate-pulse" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

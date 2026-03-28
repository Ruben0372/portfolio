"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Server, Code, Lock } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <span className="text-xs font-semibold text-accent tracking-widest uppercase">
            About
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
            Ruben
          </h1>
          <p className="mt-2 text-lg text-accent font-medium">
            Security-Focused Full Stack Developer
          </p>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-5 text-text-muted leading-relaxed"
        >
          <p>
            I&apos;m a full-stack engineer and CS student who treats security as a
            first-class feature, not a checkbox. Every app I build — from
            enterprise file-sharing platforms to custom TLS tunnels — is designed
            to withstand real-world attacks from day one.
          </p>
          <p>
            I wear every hat: engineering, product, security, DevOps, and
            infrastructure. I manage my own Arch Linux server with 7.3TB of
            shared storage, run production WireGuard VPNs, and build CI/CD
            pipelines with automated security scanning. When I say
            &quot;production-tested,&quot; I mean it — I deploy and operate everything
            myself.
          </p>
          <p>
            My approach is simple: build fast, but build it right. I&apos;ve seen too
            many projects where security was bolted on as an afterthought, only
            to cost 10x more to fix later. I bake OWASP protections, secure auth,
            and hardened deployments into the foundation so you can ship
            confidently.
          </p>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16 grid sm:grid-cols-2 gap-5"
        >
          {[
            {
              icon: Lock,
              title: "Security First",
              description:
                "Every architecture decision starts with threat modeling. I don't add security later — it's in the foundation.",
            },
            {
              icon: Server,
              title: "Production Tested",
              description:
                "My projects run on real servers serving real traffic. Not demos, not tutorials — deployed and operational.",
            },
            {
              icon: Code,
              title: "Clean Engineering",
              description:
                "Well-tested code, clear documentation, proper CI/CD. I build systems that other engineers can maintain.",
            },
            {
              icon: Shield,
              title: "Defense in Depth",
              description:
                "Layered security from network to application. VPN, firewall, auth, input validation, encryption — every layer matters.",
            },
          ].map((value) => (
            <div
              key={value.title}
              className="rounded-xl border border-border/50 bg-surface/50 p-6"
            >
              <value.icon className="h-5 w-5 text-accent mb-4" />
              <h3 className="text-base font-semibold">{value.title}</h3>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 rounded-xl border border-border/50 bg-surface/50 p-8 text-center"
        >
          <h3 className="text-xl font-bold">Let&apos;s build something secure.</h3>
          <p className="mt-2 text-sm text-text-muted">
            Available for freelance projects — security audits, secure web apps,
            CI/CD pipelines, and cloud hardening.
          </p>
          <Link
            href="/contact"
            className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-hover"
          >
            Get in Touch
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

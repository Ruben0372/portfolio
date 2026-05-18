"use client";

import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { BGPattern } from "@/components/ui/bg-pattern";
import { SystemWindow } from "@/components/ui/system-window";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 64;
  window.scrollTo({ top, left: 0, behavior: "smooth" });
}

const heroVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const fadeUpSmall = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 1.6 } },
};

const fadeInLate = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, delay: 2.0 } },
};

export function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Dark background with grid pattern */}
      <BGPattern
        variant="grid"
        mask="fade-edges"
        size={60}
        fill="rgba(255,255,255,0.015)"
      />

      {/* Subtle topology line decoration */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg
          viewBox="0 0 1200 800"
          className="w-full h-full opacity-[0.04]"
          preserveAspectRatio="xMidYMid slice"
        >
          <line
            x1="100"
            y1="400"
            x2="400"
            y2="400"
            stroke="var(--color-map-relay)"
            strokeWidth="1"
          />
          <line
            x1="400"
            y1="400"
            x2="700"
            y2="400"
            stroke="var(--color-map-tunnel)"
            strokeWidth="1.5"
            strokeDasharray="8 4"
          />
          <line
            x1="700"
            y1="400"
            x2="1000"
            y2="350"
            stroke="var(--color-map-agent)"
            strokeWidth="1"
          />
          <circle
            cx="100"
            cy="400"
            r="6"
            fill="none"
            stroke="var(--color-map-client)"
            strokeWidth="1"
          />
          <circle
            cx="400"
            cy="400"
            r="6"
            fill="none"
            stroke="var(--color-map-relay)"
            strokeWidth="1"
          />
          <circle
            cx="700"
            cy="400"
            r="6"
            fill="none"
            stroke="var(--color-map-tunnel)"
            strokeWidth="1"
          />
          <circle
            cx="1000"
            cy="350"
            r="6"
            fill="none"
            stroke="var(--color-map-agent)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <motion.div
        className="mx-auto max-w-5xl px-6 py-32 text-center relative z-10"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={fadeUp}
          className="text-xs font-mono tracking-widest uppercase text-[var(--color-brand-amber)] mb-6"
        >
          Systems Security Engineer
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--color-brand-text-heading)] leading-[1.1]"
        >
          I build secure systems that survive contact with real networks.
        </motion.h1>

        <motion.p
          variants={fadeUpSmall}
          className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-[var(--color-brand-text-muted)] leading-relaxed"
        >
          From custom TLS tunnels to production infrastructure — I design,
          build, and operate the systems that keep services running securely.
          This portfolio is served through one of them.
        </motion.p>

        {/* System Window CTA — live topology preview */}
        <motion.div variants={fadeIn} className="mt-14 flex justify-center">
          <SystemWindow />
        </motion.div>

        <motion.div variants={fadeInLate} className="mt-14">
          <button
            onClick={() => scrollToSection("about")}
            className="inline-flex flex-col items-center gap-2 text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-amber)] transition-colors"
          >
            <span className="text-xs font-mono tracking-widest uppercase">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ChevronDown className="h-5 w-5" aria-hidden="true" />
            </motion.div>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}

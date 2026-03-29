"use client";

import { motion } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import { ImageBackground } from "@/components/ui/image-background";
import { Typewriter } from "@/components/ui/typewriter";
import { TiltCard } from "@/components/ui/tilt-card";

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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 2.0 } },
};

const fadeInLate = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, delay: 2.5 } },
};

export function Hero() {
  return (
    <ImageBackground
      src="/images/hero/monument-hero.jpg"
      alt="Classical monument at golden hour"
      overlayOpacity={0.78}
      gradientDirection="radial"
      className="min-h-screen flex items-center justify-center"
      priority
    >
      <section id="hero" className="w-full">
        <motion.div
          className="mx-auto max-w-6xl px-6 py-32 text-center"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={fadeUp}
            className="font-heading text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[var(--color-brand-text-heading)]"
          >
            Ruben Yomenou
          </motion.h1>

          <motion.p
            variants={fadeUpSmall}
            className="mt-4 font-heading text-2xl sm:text-3xl lg:text-4xl font-semibold text-[var(--color-brand-amber)]"
          >
            Security Engineer
          </motion.p>

          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-[var(--color-brand-text-muted)] leading-relaxed">
            <Typewriter
              text="I build accessible and secure by default digital experiences that make the web a place of infinite possibilities."
              speed={30}
              delay={800}
            />
          </p>

          <motion.div variants={fadeIn} className="mt-12">
            <TiltCard
              className="inline-block rounded-xl"
              tiltMax={20}
              scale={1.05}
            >
              <button
                onClick={() => scrollToSection("contact")}
                className="inline-flex items-center gap-2 rounded-xl glass px-7 py-3.5 text-sm font-semibold text-[var(--color-brand-amber)] border border-[var(--color-brand-amber)]/20 hover:border-[var(--color-brand-amber)]/40 transition-all"
                style={{
                  boxShadow: "0 4px 30px rgba(245, 158, 11, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                Let&apos;s Chat
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </TiltCard>
          </motion.div>

          <motion.div variants={fadeInLate} className="mt-16">
            <button
              onClick={() => scrollToSection("about")}
              className="inline-flex flex-col items-center gap-2 text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-amber)] transition-colors"
            >
              <span className="text-xs font-mono tracking-widest uppercase">
                Scroll
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown className="h-5 w-5" aria-hidden="true" />
              </motion.div>
            </button>
          </motion.div>
        </motion.div>
      </section>
    </ImageBackground>
  );
}

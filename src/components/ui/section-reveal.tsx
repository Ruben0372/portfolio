"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const variants: Record<string, Variants> = {
  "fade-up": {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-in": {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "slide-left": {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  "slide-right": {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
};

const motionElements = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
} as const;

interface SectionRevealProps {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  delay?: number;
  duration?: number;
  className?: string;
  as?: keyof typeof motionElements;
}

export function SectionReveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.6,
  className,
  as = "div",
}: SectionRevealProps) {
  const Component = motionElements[as];

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={variants[variant]}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] as const }}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  stagger = 0.1,
  delay = 0,
  className,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

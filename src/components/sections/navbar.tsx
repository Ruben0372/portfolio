"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

type NavLink =
  | { id: string; label: string; href?: undefined }
  | { id: string; label: string; href: string };

const links: NavLink[] = [
  { id: "about", label: "About" },
  { id: "systems-map", label: "Systems Map", href: "/systems-map" },
  { id: "projects", label: "Projects" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isScrollingRef = useRef(false);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    isScrollingRef.current = true;
    const top = el.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, left: 0, behavior: "smooth" });
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 800);
  }, []);

  useEffect(() => {
    const sections = ["hero", ...links.map((l) => l.id)];
    const observers: IntersectionObserver[] = [];

    for (const id of sections) {
      const el = document.getElementById(id);
      if (!el) continue;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isScrollingRef.current) setActiveSection(id);
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    }

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[var(--color-brand-bg)]/70 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <button
          onClick={() => scrollToSection("hero")}
          className="text-sm font-semibold tracking-tight"
        >
          ruben<span className="text-[var(--color-brand-amber)]">.dev</span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) =>
            link.href ? (
              <Link
                key={link.id}
                href={link.href}
                className="relative px-3 py-1.5 text-sm transition-colors text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-text)]"
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                aria-current={activeSection === link.id ? "true" : undefined}
                className={cn(
                  "relative px-3 py-1.5 text-sm transition-colors",
                  activeSection === link.id
                    ? "text-[var(--color-brand-text)]"
                    : "text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-text)]"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute inset-x-1 -bottom-px h-px transition-all duration-300",
                    activeSection === link.id
                      ? "bg-[var(--color-brand-amber)] opacity-100"
                      : "bg-transparent opacity-0"
                  )}
                />
              </button>
            )
          )}
        </div>

        <button
          onClick={() => scrollToSection("contact")}
          className="hidden md:inline-flex text-sm font-medium px-4 py-2 rounded-lg glass glass-hover transition-all text-[var(--color-brand-amber)]"
        >
          Let&apos;s Talk
        </button>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          className="md:hidden p-2"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            role="navigation"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="md:hidden border-t border-white/5 bg-[var(--color-brand-bg)]/95 backdrop-blur-xl"
          >
            <div className="px-6 py-4 space-y-1">
              {links.map((link) =>
                link.href ? (
                  <Link
                    key={link.id}
                    href={link.href}
                    className="block w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors text-[var(--color-brand-text-muted)]"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.id}
                    onClick={() => {
                      scrollToSection(link.id);
                      setMobileOpen(false);
                    }}
                    aria-current={activeSection === link.id ? "true" : undefined}
                    className={cn(
                      "block w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors",
                      activeSection === link.id
                        ? "text-[var(--color-brand-amber)] bg-white/5"
                        : "text-[var(--color-brand-text-muted)]"
                    )}
                  >
                    {link.label}
                  </button>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

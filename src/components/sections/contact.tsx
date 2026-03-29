import { Mail, Github, Linkedin, MessageSquare, Clock } from "lucide-react";
import { ImageBackground } from "@/components/ui/image-background";
import { TiltCard } from "@/components/ui/tilt-card";
import {
  SectionReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/section-reveal";

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: "ru93ben@gmail.com",
    href: "mailto:ru93ben@gmail.com",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "Ruben0372",
    href: "https://github.com/Ruben0372",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "Connect with me",
    href: "https://linkedin.com/in/ruben",
  },
  {
    icon: MessageSquare,
    label: "Freelance",
    value: "Upwork & Fiverr",
    href: "#",
  },
];

const steps = [
  { num: "0", title: "Fast Response", description: "I respond within 2 hours during business days. For urgent security issues, even faster." },
  { num: "1", title: "Discovery Call", description: "We discuss your project, security needs, timeline, and budget. No pressure, just clarity." },
  { num: "2", title: "Proposal", description: "Clear scope, timeline, and pricing. You know exactly what you're getting." },
  { num: "3", title: "Build & Ship", description: "Iterative delivery with regular check-ins. You see progress throughout, not just at the end." },
];

export function Contact() {
  return (
    <ImageBackground
      src="/images/sections/city-night.jpg"
      alt="City at night"
      overlayOpacity={0.9}
      className="min-h-screen py-20 lg:py-28"
    >
      <section id="contact" className="section-anchor">
        <div className="mx-auto max-w-6xl px-6">
          <SectionReveal>
            <span className="text-xs font-mono tracking-widest uppercase text-[var(--color-brand-amber)]">
              Contact
            </span>
            <h2 className="mt-3 font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-brand-text-heading)]">
              Let&apos;s talk about your project.
            </h2>
            <p className="mt-4 max-w-2xl text-sm sm:text-base text-[var(--color-brand-text-muted)] leading-relaxed">
              Whether you need a security audit, a secure web application, or a
              hardened CI/CD pipeline: I&apos;m here to help.
            </p>
          </SectionReveal>

          <div className="mt-12 grid lg:grid-cols-2 gap-8">
            {/* Contact methods */}
            <StaggerContainer stagger={0.08} className="space-y-3">
              {contactMethods.map((method) => (
                <StaggerItem key={method.label}>
                  <TiltCard className="rounded-xl" tiltMax={12} scale={1.02}>
                    <a
                      href={method.href}
                      target={method.href.startsWith("http") ? "_blank" : undefined}
                      rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-4 glass rounded-xl p-5 glass-hover transition-all group"
                    >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-brand-amber)]/10">
                      <method.icon className="h-4 w-4 text-[var(--color-brand-amber)]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{method.label}</p>
                      <p className="text-xs text-[var(--color-brand-text-muted)]">
                        {method.value}
                      </p>
                    </div>
                  </a>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* What to expect */}
            <SectionReveal delay={0.2}>
              <div className="glass rounded-xl p-6 sm:p-8">
                <h3 className="text-base font-semibold mb-6">What to expect</h3>
                <div className="space-y-5">
                  {steps.map((step) => (
                    <div key={step.num} className="flex gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-brand-amber)]/10 flex-shrink-0">
                        {step.num === "0" ? (
                          <Clock className="h-3.5 w-3.5 text-[var(--color-brand-amber)]" aria-hidden="true" />
                        ) : (
                          <span className="text-[var(--color-brand-amber)] text-xs font-bold font-mono">
                            {step.num}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{step.title}</p>
                        <p className="text-xs text-[var(--color-brand-text-muted)] leading-relaxed mt-0.5">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>
    </ImageBackground>
  );
}

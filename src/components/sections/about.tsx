"use client";

import Image from "next/image";
import { Lock, Server, Code, Shield } from "lucide-react";
import { BGPattern } from "@/components/ui/bg-pattern";
import { GridGlowText } from "@/components/ui/grid-glow";
import { TiltCard } from "@/components/ui/tilt-card";
import {
  SectionReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/section-reveal";

const values = [
  {
    icon: Lock,
    title: "Security First",
    description:
      "Every architecture decision starts with threat modeling. Security isn't added later: it's in the foundation.",
  },
  {
    icon: Server,
    title: "Production Tested",
    description:
      "My projects run on real servers serving real traffic. Not demos, not tutorials: deployed and operational.",
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
      "Layered security from network to application: VPN, firewall, auth, input validation, encryption. Every layer matters.",
  },
];

const photos = [
  { src: "/images/sections/about-architecture.jpg", alt: "Taj Mahal architecture" },
  { src: "/images/sections/about-2.jpg", alt: "Classical columns" },
  { src: "/images/sections/about-3.jpg", alt: "Modern architecture" },
];

export function About() {
  return (
    <section id="about" className="section-anchor min-h-screen py-20 lg:py-28 relative">
      <BGPattern variant="grid" mask="fade-edges" size={24} fill="rgba(255,255,255,0.025)" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Photo collage: 3 images in same space */}
          <SectionReveal variant="slide-left">
            <div className="grid grid-cols-2 gap-3 aspect-[4/5]">
              {/* Large image spanning full left column */}
              <TiltCard className="row-span-2 rounded-2xl overflow-hidden" tiltMax={8}>
                <div className="relative h-full min-h-[300px]">
                  <Image
                    src={photos[0].src}
                    alt={photos[0].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-bg)]/30 to-transparent" />
                </div>
              </TiltCard>
              {/* Top right */}
              <TiltCard className="rounded-2xl overflow-hidden" tiltMax={12}>
                <div className="relative h-full min-h-[145px]">
                  <Image
                    src={photos[1].src}
                    alt={photos[1].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-bg)]/30 to-transparent" />
                </div>
              </TiltCard>
              {/* Bottom right */}
              <TiltCard className="rounded-2xl overflow-hidden" tiltMax={12}>
                <div className="relative h-full min-h-[145px]">
                  <Image
                    src={photos[2].src}
                    alt={photos[2].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-bg)]/30 to-transparent" />
                </div>
              </TiltCard>
            </div>
          </SectionReveal>

          {/* Content */}
          <div>
            <SectionReveal>
              <div className="flex items-center gap-4 mb-4">
                {/* Avatar placeholder — replace with real photo */}
                <div className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-[var(--color-brand-amber)]/30 flex-shrink-0">
                  <Image src="/images/avatar.svg" alt="Ruben" width={56} height={56} className="h-full w-full object-cover" unoptimized />
                </div>
                <div>
                  <GridGlowText as="span" className="text-xs font-mono tracking-widest uppercase text-[var(--color-brand-amber)] block">
                    About
                  </GridGlowText>
                  <GridGlowText as="h2" className="mt-1 font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-brand-text-heading)]">
                    The Engineer
                  </GridGlowText>
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.1}>
              <div className="mt-6 space-y-4 text-sm sm:text-base text-[var(--color-brand-text-muted)] leading-relaxed">
                <p>
                  I&apos;m a full-stack engineer and CS student who treats
                  security as a first-class feature, not a checkbox. Every app I
                  build, from enterprise file-sharing platforms to custom TLS
                  tunnels, is designed to withstand real-world attacks from day
                  one.
                </p>
                <p>
                  I wear every hat: engineering, product, security, DevOps, and
                  infrastructure. I manage my own Arch Linux server with 7.3TB
                  of shared storage, run production WireGuard VPNs, and build
                  CI/CD pipelines with automated security scanning.
                </p>
                <p>
                  My approach is simple: build fast, but build it right. I bake
                  OWASP protections, secure auth, and hardened deployments into
                  the foundation so you can ship confidently.
                </p>
              </div>
            </SectionReveal>

            {/* Values with 3D tilt */}
            <StaggerContainer stagger={0.08} delay={0.2} className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-5">
              {values.map((value) => (
                <StaggerItem key={value.title}>
                  <TiltCard className="glass rounded-xl p-5 h-full min-h-[280px] flex flex-col" tiltMax={15} scale={1.03}>
                    <value.icon className="h-5 w-5 text-[var(--color-brand-amber)]" aria-hidden="true" />
                    <div className="mt-auto">
                      <h3 className="text-sm font-semibold">{value.title}</h3>
                      <p className="mt-1.5 text-xs text-[var(--color-brand-text-muted)] leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

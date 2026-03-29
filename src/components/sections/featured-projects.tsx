import { projects } from "@/data/projects";
import { BGPattern } from "@/components/ui/bg-pattern";
import { GridGlowText } from "@/components/ui/grid-glow";
import { FocusCards } from "@/components/ui/focus-card";
import { SectionReveal } from "@/components/ui/section-reveal";

const projectImages: Record<string, string> = {
  atlax: "/images/projects/bridge-warm.jpg",
  "secure-remote-access-lab": "/images/projects/temple-columns.jpg",
  "security-automation-scripts": "/images/projects/modern-glass.jpg",
  atlasshare: "/images/projects/atlasshare.jpg",
  mentalist: "/images/projects/mentalist.jpg",
  dashboard: "/images/projects/dashboard.jpg",
  vitalis: "/images/projects/vitalis.jpg",
};

export function FeaturedProjects() {
  const cards = projects.map((project) => ({
    title: project.title,
    subtitle: project.tagline,
    category: project.category,
    src: projectImages[project.slug] ?? "/images/projects/bridge-warm.jpg",
    href: `/projects/${project.slug}`,
    tags: project.tech.slice(0, 4),
  }));

  return (
    <section id="projects" className="section-anchor min-h-screen py-20 lg:py-28 border-t border-white/5 relative">
      <BGPattern variant="grid" mask="fade-edges" size={24} fill="rgba(255,255,255,0.025)" />
      <div className="mx-auto max-w-6xl px-6">
        <SectionReveal>
          <GridGlowText as="span" className="text-xs font-mono tracking-widest uppercase text-[var(--color-brand-amber)] block">
            Selected Work
          </GridGlowText>
          <GridGlowText as="h2" className="mt-3 font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-brand-text-heading)]">
            Projects
          </GridGlowText>
        </SectionReveal>

        <SectionReveal delay={0.1} className="mt-10">
          <FocusCards cards={cards} />
        </SectionReveal>
      </div>
    </section>
  );
}

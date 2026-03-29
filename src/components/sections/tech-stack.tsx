import { techStack } from "@/data/projects";
import { BGPattern } from "@/components/ui/bg-pattern";
import { GridGlowText } from "@/components/ui/grid-glow";
import {
  SectionReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/section-reveal";

const categoryLabels: Record<string, string> = {
  languages: "Languages",
  frontend: "Frontend",
  backend: "Backend",
  databases: "Databases",
  security: "Security",
  devops: "DevOps",
  tools: "Tools",
};

export function TechStack() {
  return (
    <section id="tech" className="section-anchor min-h-screen py-20 lg:py-28 relative border-t border-white/5">
      <BGPattern variant="grid" mask="fade-edges" size={24} fill="rgba(255,255,255,0.025)" />
      <div className="mx-auto max-w-6xl px-6">
        <SectionReveal>
          <GridGlowText as="span" className="text-xs font-mono tracking-widest uppercase text-[var(--color-brand-amber)] block">
            Arsenal
          </GridGlowText>
          <GridGlowText as="h2" className="mt-3 font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-brand-text-heading)]">
            Tech Stack
          </GridGlowText>
        </SectionReveal>

        <StaggerContainer stagger={0.06} delay={0.1} className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(techStack).map(([category, items]) => (
            <StaggerItem key={category}>
              <div>
                <GridGlowText as="h3" className="text-xs font-mono uppercase tracking-widest text-[var(--color-brand-amber)] mb-3">
                  {categoryLabels[category] ?? category}
                </GridGlowText>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="text-xs font-mono px-2.5 py-1.5 rounded-lg glass glass-hover transition-all cursor-default text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-text)]"
                      style={{ textShadow: "0 0 30px rgba(255,255,255,0.05)" }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

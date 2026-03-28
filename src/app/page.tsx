import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { TechStack } from "@/components/sections/tech-stack";
import { CTA } from "@/components/sections/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <FeaturedProjects />
      <TechStack />
      <CTA />
    </>
  );
}

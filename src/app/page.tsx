import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { TechStack } from "@/components/sections/tech-stack";
import { BlogPreview } from "@/components/sections/blog-preview";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { CursorGlow } from "@/components/ui/cursor-glow";
import { BackToTop } from "@/components/ui/back-to-top";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <CursorGlow />
      <BackToTop />
      <main id="main-content">
        <Hero />
        <About />
        <FeaturedProjects />
        <TechStack />
        <BlogPreview />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

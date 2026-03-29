import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Github } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/mdx";
import { ImageBackground } from "@/components/ui/image-background";

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    try {
      const { frontmatter } = getProjectBySlug(slug);
      return {
        title: frontmatter.title,
        description: frontmatter.tagline,
      };
    } catch {
      return { title: "Project | Ruben" };
    }
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let frontmatter: ReturnType<typeof getProjectBySlug>["frontmatter"];
  let content: string;
  try {
    ({ frontmatter, content } = getProjectBySlug(slug));
  } catch {
    notFound();
  }

  return (
    <main id="main-content">
      <ImageBackground
        src="/images/projects/bridge-warm.jpg"
        alt={frontmatter.title}
        overlayOpacity={0.85}
        className="pt-24 pb-16"
        priority
      >
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-amber)] transition-colors mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to projects
          </Link>

          <span className="block text-xs font-mono uppercase tracking-widest text-[var(--color-brand-amber)]">
            {frontmatter.category}
          </span>
          <h1 className="mt-3 font-heading text-4xl sm:text-5xl font-bold text-[var(--color-brand-text-heading)]">
            {frontmatter.title}
          </h1>
          <p className="mt-3 text-lg text-[var(--color-brand-text-muted)]">
            {frontmatter.tagline}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {frontmatter.tech.map((t: string) => (
              <span
                key={t}
                className="text-xs font-mono px-2.5 py-1 rounded-md glass text-[var(--color-brand-amber)]"
              >
                {t}
              </span>
            ))}
          </div>

          {frontmatter.github && (
            <a
              href={frontmatter.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm glass rounded-lg px-4 py-2 glass-hover transition-all"
            >
              <Github className="h-4 w-4" />
              View Source
            </a>
          )}
        </div>
      </ImageBackground>

      <article className="mx-auto max-w-3xl px-6 py-16 prose-custom">
        <MDXRemote source={content} />
      </article>
    </main>
  );
}

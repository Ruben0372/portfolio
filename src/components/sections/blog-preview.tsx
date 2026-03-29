import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BGPattern } from "@/components/ui/bg-pattern";
import { GridGlowText } from "@/components/ui/grid-glow";
import {
  SectionReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/section-reveal";
import { getAllPosts } from "@/lib/mdx";

export function BlogPreview() {
  const posts = getAllPosts().slice(0, 2);

  return (
    <section id="blog" className="section-anchor min-h-screen py-20 lg:py-28 border-t border-white/5 relative">
      <BGPattern variant="grid" mask="fade-edges" size={24} fill="rgba(255,255,255,0.025)" />
      <div className="mx-auto max-w-6xl px-6">
        <SectionReveal>
          <GridGlowText as="span" className="text-xs font-mono tracking-widest uppercase text-[var(--color-brand-amber)] block">
            Writing
          </GridGlowText>
          <GridGlowText as="h2" className="mt-3 font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-brand-text-heading)]">
            Thoughts
          </GridGlowText>
        </SectionReveal>

        <StaggerContainer stagger={0.1} delay={0.1} className="mt-10 space-y-4">
          {posts.map((post) => (
            <StaggerItem key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block glass rounded-xl p-6 sm:p-8 glass-hover transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <time dateTime={post.frontmatter.date} className="text-xs font-mono text-[var(--color-brand-text-muted)]">
                      {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                    <h3 className="mt-2 font-heading text-xl sm:text-2xl font-semibold text-[var(--color-brand-text-heading)] group-hover:text-[var(--color-brand-amber)] transition-colors">
                      {post.frontmatter.title}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--color-brand-text-muted)] leading-relaxed">
                      {post.frontmatter.excerpt}
                    </p>
                    <div className="mt-3 flex gap-2">
                      {post.frontmatter.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-[var(--color-brand-text-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-[var(--color-brand-text-muted)] group-hover:text-[var(--color-brand-amber)] transition-colors flex-shrink-0 mt-2" aria-hidden="true" />
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <SectionReveal delay={0.3} className="mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-brand-amber)] hover:underline"
          >
            View all posts <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </SectionReveal>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAllPosts } from "@/lib/mdx";

export const metadata = {
  title: "Blog",
  description: "Security engineering, architecture breakdowns, and DevSecOps deep dives.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main id="main-content" className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          href="/#blog"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-amber)] transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Home
        </Link>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[var(--color-brand-text-heading)]">
          Writing
        </h1>
        <p className="mt-2 text-[var(--color-brand-text-muted)]">
          Security engineering, architecture breakdowns, and DevSecOps deep dives.
        </p>

        <div className="mt-12 space-y-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block glass rounded-xl p-6 glass-hover transition-all group"
            >
              <time dateTime={post.frontmatter.date} className="text-xs font-mono text-[var(--color-brand-text-muted)]">
                {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
              <h2 className="mt-2 font-heading text-xl font-semibold text-[var(--color-brand-text-heading)] group-hover:text-[var(--color-brand-amber)] transition-colors">
                {post.frontmatter.title}
              </h2>
              <p className="mt-1 text-sm text-[var(--color-brand-text-muted)]">
                {post.frontmatter.excerpt}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs text-[var(--color-brand-amber)]">
                Read <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}

          {posts.length === 0 && (
            <p className="text-sm text-[var(--color-brand-text-muted)]">
              No posts yet. Check back soon.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

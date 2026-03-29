import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllPosts } from "@/lib/mdx";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    try {
      const { frontmatter } = getPostBySlug(slug);
      return {
        title: frontmatter.title,
        description: frontmatter.excerpt,
      };
    } catch {
      return { title: "Blog | Ruben" };
    }
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let frontmatter: ReturnType<typeof getPostBySlug>["frontmatter"];
  let content: string;
  try {
    ({ frontmatter, content } = getPostBySlug(slug));
  } catch {
    notFound();
  }

  return (
    <main id="main-content" className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          href="/#blog"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-brand-text-muted)] hover:text-[var(--color-brand-amber)] transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to writing
        </Link>

        <time dateTime={frontmatter.date} className="block text-xs font-mono text-[var(--color-brand-text-muted)]">
          {new Date(frontmatter.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </time>

        <h1 className="mt-3 font-heading text-3xl sm:text-4xl font-bold text-[var(--color-brand-text-heading)]">
          {frontmatter.title}
        </h1>

        <div className="mt-4 flex gap-2">
          {frontmatter.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-[var(--color-brand-text-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <article className="mt-12 prose-custom">
          <MDXRemote source={content} />
        </article>
      </div>
    </main>
  );
}

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogFrontmatter, ProjectFrontmatter } from "@/types/mdx";

const CONTENT_DIR = path.join(process.cwd(), "content");

function readMdxFile<T>(filePath: string): { frontmatter: T; content: string } {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { frontmatter: data as T, content };
}

function listMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

// Blog
export function getPostBySlug(slug: string) {
  const filePath = path.join(CONTENT_DIR, "blog", `${slug}.mdx`);
  return readMdxFile<BlogFrontmatter>(filePath);
}

export function getAllPosts() {
  const slugs = listMdxFiles(path.join(CONTENT_DIR, "blog"));
  return slugs
    .map((slug) => ({ slug, ...getPostBySlug(slug) }))
    .filter((p) => p.frontmatter.published)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

// Projects
export function getProjectBySlug(slug: string) {
  const filePath = path.join(CONTENT_DIR, "projects", `${slug}.mdx`);
  return readMdxFile<ProjectFrontmatter>(filePath);
}

export function getAllProjectSlugs() {
  return listMdxFiles(path.join(CONTENT_DIR, "projects"));
}

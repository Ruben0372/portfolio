export interface BlogFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  published: boolean;
}

export interface ProjectFrontmatter {
  title: string;
  tagline: string;
  category: string;
  tech: string[];
  featured: boolean;
  github?: string;
  live?: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  featured: boolean;
  category: "security" | "fullstack" | "infrastructure" | "tools";
  tech: string[];
  highlights: string[];
  github?: string;
  live?: string;
  architecture?: string;
}

export const projects: Project[] = [
  {
    slug: "atlax",
    title: "Atlax",
    tagline: "Custom Reverse TLS Tunnel with TCP Stream Multiplexing",
    description:
      "A production-grade reverse TLS tunnel built in Go, designed to bypass CGNAT by having customer nodes dial out to a relay with a public IP. Features mutual TLS authentication, TCP stream multiplexing via a custom wire protocol, and an in-memory agent registry for node management.",
    featured: true,
    category: "security",
    tech: ["Go 1.25", "mTLS", "TCP Multiplexing", "Docker", "Custom Wire Protocol"],
    highlights: [
      "Mutual TLS (mTLS) authentication with certificate-based identity extraction",
      "Custom wire protocol with frame parsing, stream multiplexing, and flow control",
      "In-memory agent registry with health checks and connection lifecycle management",
      "Designed for self-hosted deployments behind carrier-grade NAT (CGNAT)",
    ],
    github: "https://github.com/Ruben0372/atlax",
    architecture: `
      RELAY (VPS)
      ├── TLS Listener (agent connections)
      ├── Agent Registry (node mapping)
      ├── Client Listener (TCP ports)
      └── Mux Router
              │
         TLS Tunnel (outbound)
              │
      CUSTOMER NODE
      ├── Tunnel Agent (dials relay)
      ├── Stream Demux (route by ID)
      └── Local Services (Samba, HTTP)
    `,
  },
  {
    slug: "secure-remote-access-lab",
    title: "Secure Remote Access Lab",
    tagline: "Production WireGuard VPN + SSH Hardening + Firewall Config",
    description:
      "A 3-part security series deployed on a live Arch Linux server with 7.3TB shared storage. Covers WireGuard VPN for encrypted remote access, SSH hardening with key-only auth and fail2ban, firewall rules restricting SMB ports to LAN/VPN only, and Bash automation for security operations.",
    featured: true,
    category: "security",
    tech: ["WireGuard", "OpenSSH", "iptables/UFW", "fail2ban", "Bash", "Arch Linux"],
    highlights: [
      "Live production deployment — not a tutorial exercise",
      "Layered security model separating internet, VPN, firewall, and service tiers",
      "Automated security scripts: user lifecycle, permission auditing, log monitoring",
      "Part of a 3-repo series covering VPN, access control, and security automation",
    ],
    github: "https://github.com/Ruben0372/secure-remote-access-lab",
  },
  {
    slug: "security-automation-scripts",
    title: "Security Automation Scripts",
    tagline: "DevSecOps Tooling for Server Hardening and Compliance",
    description:
      "Bash scripts automating security operations for a Samba file server and WireGuard VPN. Covers user lifecycle management, permission auditing against baselines, log monitoring for suspicious activity, firewall verification, and timestamped configuration backups.",
    featured: true,
    category: "tools",
    tech: ["Bash", "Samba", "WireGuard", "iptables", "cron", "systemd"],
    highlights: [
      "Samba user lifecycle with 3-tier access control (Admin, Standard, Guest)",
      "Permission drift detection against defined baselines",
      "Automated log parsing for failed auth attempts and repeat offenders",
      "Firewall rule verification to catch misconfigurations before they're exploited",
    ],
    github: "https://github.com/Ruben0372/security-automation-scripts",
  },
  {
    slug: "atlasshare",
    title: "AtlasShare",
    tagline: "Enterprise-Grade Self-Hosted File Sharing Platform",
    description:
      "A zero-trust, multi-tenant file sharing and collaboration platform built for regulated organizations and MSPs. Features encryption everywhere, least-privilege defaults, tenant isolation, and vendor-neutral architecture supporting on-prem, private cloud, and hybrid deployments.",
    featured: false,
    category: "fullstack",
    tech: ["Go", "React", "Docker", "WireGuard", "Terraform", "GitHub Actions"],
    highlights: [
      "Zero-trust architecture — every request authenticated, authorized, and tenant-scoped",
      "Cryptographic tenant isolation with per-tenant encryption keys",
      "Modular monolith backend with clean boundaries for future microservice extraction",
      "Enterprise compliance: audit logging, data residency controls, GDPR tooling",
    ],
    github: "https://github.com/Ruben0372/atlasshare-sg",
  },
  {
    slug: "mentalist",
    title: "Mentalist",
    tagline: "Graphical Wordlist Generator for Security Testing",
    description:
      "An open-source graphical tool for custom wordlist generation used in security and password testing. Leverages common human paradigms for constructing passwords and outputs wordlists compatible with Hashcat and John the Ripper.",
    featured: false,
    category: "tools",
    tech: ["Python 3.11+", "Tkinter", "Poetry", "Hashcat", "John the Ripper"],
    highlights: [
      "GUI-based wordlist generation with human password paradigms",
      "Compatible with industry-standard tools (Hashcat, John the Ripper)",
      "Open source with active community usage",
      "Published as PyPI package with cross-platform support",
    ],
    github: "https://github.com/Ruben0372/mentalist",
  },
  {
    slug: "dashboard",
    title: "Personal Command Center",
    tagline: "Self-Hosted Dashboard with AI Work Dispatch",
    description:
      "A self-hosted personal command center running 24/7 on an Arch Linux server, accessible via Tailscale. Consolidates projects, tasks, calendar, notes, and AI work dispatch into a single pane of glass with a Go backend and React frontend.",
    featured: false,
    category: "fullstack",
    tech: ["Go", "Chi Router", "React 19", "Vite", "SQLite (FTS5)", "Docker", "Tailscale"],
    highlights: [
      "Go backend proxying Notion, Google Calendar, and Gmail APIs",
      "Full-text search with SQLite FTS5 for instant note retrieval",
      "AI dispatch system for routing work to Claude Code agents",
      "Deployed on personal Arch Linux server with Tailscale-only access",
    ],
  },
  {
    slug: "vitalis",
    title: "Vitalis",
    tagline: "B2B Enterprise Wellness Platform (HIPAA/SOC2/GDPR)",
    description:
      "A B2B enterprise wellness and habit tracking platform built with compliance at its core. Features row-level security in PostgreSQL, an Nx monorepo architecture, and a phased development plan spanning 13 phases from foundation to health integrations.",
    featured: false,
    category: "fullstack",
    tech: [
      "NestJS", "Fastify", "PostgreSQL (RLS)", "Prisma", "React Native",
      "Electron", "Python ML", "AWS CDK", "Nx",
    ],
    highlights: [
      "HIPAA, SOC2, and GDPR compliance built into the architecture from day one",
      "Row-Level Security (RLS) in PostgreSQL for tenant data isolation",
      "13-phase development plan with clear dependency chains",
      "Multi-platform: web, desktop (Electron), mobile (React Native)",
    ],
  },
];

export const services = [
  {
    title: "Secure Web Application Development",
    description:
      "Full-stack web apps with OWASP Top 10 protections baked in — auth, input validation, CSP headers, and rate limiting from day one.",
    icon: "Shield",
  },
  {
    title: "CI/CD Pipeline Security",
    description:
      "GitHub Actions and GitLab CI pipelines with SAST/DAST scanning, secret detection, dependency vulnerability checks, and automated security gates.",
    icon: "GitBranch",
  },
  {
    title: "Security Audits & Assessments",
    description:
      "Codebase reviews for vulnerabilities, professional audit reports with severity ratings, and actionable remediation steps.",
    icon: "Search",
  },
  {
    title: "Cloud Infrastructure Hardening",
    description:
      "AWS/GCP security configs, IAM policies, VPC design, and Infrastructure-as-Code with Terraform — all with security best practices.",
    icon: "Cloud",
  },
];

export const techStack = {
  languages: ["Go", "TypeScript", "Python", "Bash"],
  frontend: ["React", "Next.js", "React Native", "Tailwind CSS"],
  backend: ["Node.js", "NestJS", "Express", "Chi", "Fastify"],
  databases: ["PostgreSQL", "SQLite", "MongoDB", "Redis"],
  security: ["WireGuard", "mTLS", "OWASP", "Snyk", "Semgrep", "fail2ban"],
  devops: ["Docker", "GitHub Actions", "Terraform", "AWS CDK", "Nginx"],
  tools: ["Git", "Notion API", "Google APIs", "Tailscale"],
};

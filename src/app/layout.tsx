import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ruben.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ruben Yomenou | Systems Security Engineer",
    template: "%s | Ruben",
  },
  description:
    "I build secure systems from the protocol layer up. Custom TLS tunnels, production infrastructure, and the tools to operate them.",
  keywords: [
    "systems security engineer",
    "reverse TLS tunnel",
    "mTLS",
    "Go",
    "TypeScript",
    "React",
    "infrastructure engineering",
    "self-hosted",
  ],
  authors: [{ name: "Ruben Yomenou" }],
  creator: "Ruben Yomenou",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ruben Yomenou",
    title: "Ruben Yomenou | Systems Security Engineer",
    description:
      "I build secure systems from the protocol layer up — custom TLS tunnels, production infrastructure, and the tools to operate them.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ruben Yomenou | Systems Security Engineer",
    description:
      "I build secure systems from the protocol layer up — custom TLS tunnels, production infrastructure, and the tools to operate them.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "dark",
        geistSans.variable,
        geistMono.variable,
        playfair.variable
      )}
    >
      <body className="min-h-screen antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--color-brand-amber)] focus:px-4 focus:py-2 focus:text-[var(--color-brand-bg)] focus:font-semibold"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}

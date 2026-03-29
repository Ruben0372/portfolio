import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { MotionProvider } from "@/components/providers/motion-provider";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ruben.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ruben Yomenou | Security Engineer",
    template: "%s | Ruben",
  },
  description:
    "I build things that matter — securely. Security engineering, full-stack development, and DevSecOps.",
  keywords: [
    "security engineer",
    "full-stack developer",
    "DevSecOps",
    "Go",
    "TypeScript",
    "React",
    "penetration testing",
    "infrastructure security",
  ],
  authors: [{ name: "Ruben Yomenou" }],
  creator: "Ruben Yomenou",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ruben Yomenou",
    title: "Ruben Yomenou | Security Engineer",
    description:
      "Building secure, well-engineered software — from custom TLS tunnels to enterprise platforms.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ruben Yomenou | Security Engineer",
    description:
      "Building secure, well-engineered software — from custom TLS tunnels to enterprise platforms.",
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
        <MotionProvider>
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}

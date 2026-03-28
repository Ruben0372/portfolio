import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Ruben | Security-Focused Full Stack Developer",
  description:
    "I build web applications that are secure from day one. Full-stack development with DevSecOps expertise — React, Go, Node.js, Python, and cloud security.",
  keywords: [
    "DevSecOps", "Full Stack Developer", "Security Engineer", "Freelancer",
    "React", "Go", "Node.js", "Python", "CI/CD Security", "Web Security",
  ],
  openGraph: {
    title: "Ruben | Security-Focused Full Stack Developer",
    description: "I build web applications that are secure from day one.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bg antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

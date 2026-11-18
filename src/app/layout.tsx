import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { themeInitScript } from "@/lib/theme";
import ClickSound from "@/components/ClickSound";
import Bee from "@/components/Bee";
import { allProjects, contact, github, profile, socials, work } from "@/data/content";
import "./globals.css";

const sans = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: "Ritu Patil",
  description: `${profile.summary} ${work[0].role} at ${work[0].org}.`,
  openGraph: { title: "Ritu Patil", description: profile.summary, url: profile.site, type: "profile" },
  alternates: { types: { "text/plain": "/llms.txt" } },
  // profile photo; the ?v= makes browsers drop any favicon they cached before
  icons: {
    icon: [
      { url: "/icon.png?v=3", type: "image/png", sizes: "192x192" },
      { url: "/favicon.ico?v=3", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png?v=3",
  },
};

// Structured data so search engines and AI agents know who this page is about
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: profile.site,
  email: `mailto:${contact.email}`,
  description: profile.summary,
  homeLocation: { "@type": "Place", name: profile.location },
  jobTitle: work[0].role,
  worksFor: { "@type": "Organization", name: work[0].org, url: work[0].href },
  knowsAbout: profile.skills,
  sameAs: [github.url, ...socials.filter((s) => s.href.startsWith("http") && s.href !== github.url).map((s) => s.href)],
  owns: allProjects.map((p) => ({ "@type": "CreativeWork", name: p.name, url: p.site ?? p.repo })),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </head>
      <body className={sans.variable}>
        {children}
        <ClickSound />
        <Bee />
      </body>
    </html>
  );
}

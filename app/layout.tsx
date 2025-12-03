import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const SITE_URL = "https://taivippro123.vercel.app";
const AUTHOR_NAME = "Phan Võ Thành Tài";
const SOCIAL_LINKS = {
  github: "https://github.com/taivippro123/",
  linkedin: "https://www.linkedin.com/in/t%C3%A0i-th%C3%A0nh-649a44388/",
  email: "mailto:phanvothanhtai1007@gmail.com",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: AUTHOR_NAME,
  alternateName: ["taivippro123", "Phan Vo Thanh Tai"],
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  jobTitle: "Front-End Developer",
  description:
    "Phan Võ Thành Tài (taivippro123) is a front-end developer specializing in performant, accessible web products.",
  worksFor: {
    "@type": "EducationalOrganization",
    name: "FPT University",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "FPT University",
  },
  knowsAbout: [
    "Frontend engineering",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "UI Engineering",
  ],
  sameAs: [SOCIAL_LINKS.github, SOCIAL_LINKS.linkedin, SOCIAL_LINKS.email],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Phan Võ Thành Tài Portfolio",
  title: "Phan Võ Thành Tài (taivippro123) | Frontend Developer Portfolio",
  description:
    "Discover the work of Phan Võ Thành Tài (taivippro123) – a front-end developer crafting delightful, performant web experiences with Next.js, React, and Tailwind CSS.",
  category: "technology",
  keywords: [
    "taivippro123",
    "Phan Võ Thành Tài",
    "Phan Vo Thanh Tai",
    "frontend developer Vietnam",
    "Next.js portfolio",
    "React developer",
    "FPT University",
  ],
  authors: [{ name: AUTHOR_NAME, url: SITE_URL }],
  creator: AUTHOR_NAME,
  publisher: AUTHOR_NAME,
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "vi-VN": "/",
    },
  },
  openGraph: {
    title: "Phan Võ Thành Tài (taivippro123) | Frontend Developer",
    description:
      "Front-end engineer focused on polished React & Next.js experiences. View featured work, tech stack, and contact info.",
    url: SITE_URL,
    siteName: "Phan Võ Thành Tài Portfolio",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Phan Võ Thành Tài (taivippro123) Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Phan Võ Thành Tài (taivippro123) | Frontend Developer",
    description:
      "Portfolio and contact hub for front-end developer taivippro123.",
    creator: "@taivippro123",
    site: "@taivippro123",
    images: [`${SITE_URL}/twitter-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    telephone: false,
  },
  verification: {
    google: "DHIW4G5IpjFQy5C669IXwU8KvhxOEpYsv24vyjvgIIg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}

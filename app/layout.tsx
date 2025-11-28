import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Phan Võ Thành Tài | Frontend Developer Portfolio",
  description:
    "Portfolio of Phan Võ Thành Tài – Frontend Developer.",
  metadataBase: new URL("https://taivippro123.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Phan Võ Thành Tài | Frontend Developer",
    description:
      "Portfolio of Phan Võ Thành Tài – Frontend Developer.",
    url: "https://taivippro123.vercel.app",
    siteName: "Phan Võ Thành Tài Portfolio",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Phan Võ Thành Tài | Frontend Developer",
    description:
      "Portfolio of Phan Võ Thành Tài – Frontend Developer.",
  },
  verification: {
    google: "hoHgA07dcmyaqi9JNzSvLlmMoLfxBKu74VofKe-CxEY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

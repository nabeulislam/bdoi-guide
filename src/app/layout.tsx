import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "highlight.js/styles/github-dark.css";
import { getAllPages } from "@/lib/content";
import { ClientLayout } from "@/components/ClientLayout";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BdOI Guide — Master Competitive Programming",
  description: "The definitive guide for the Bangladesh Olympiad in Informatics. From your first line of code to advanced graph algorithms.",
  keywords: ["BdOI", "Bangladesh Olympiad in Informatics", "competitive programming", "algorithms", "data structures"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tracks = getAllPages();

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased bg-[#0f172a] text-gray-200 min-h-screen flex`}>
        <ClientLayout tracks={tracks}>
          {children}
        </ClientLayout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

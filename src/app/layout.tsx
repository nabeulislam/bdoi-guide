import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "highlight.js/styles/github-dark.css";
import { getAllPages } from "@/lib/content";
import { ClientLayout } from "@/components/ClientLayout";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('bdoi-theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 min-h-screen flex`}>
        <ClientLayout tracks={tracks}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}

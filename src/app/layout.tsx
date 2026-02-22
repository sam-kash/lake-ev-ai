import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ghost Recon Intelligence · AI Brand Tracker",
  description:
    "Track AI recommendation patterns and brand positioning across the 2026 LLM landscape. Analyze ChatGPT, Perplexity, and Gemini brand recommendations.",
  keywords: [
    "AI brand tracking",
    "LLM recommendations",
    "brand analytics",
    "ChatGPT analysis",
    "Perplexity analysis",
    "Gemini analysis",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

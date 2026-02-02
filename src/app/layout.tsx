import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { env } from "@/env.mjs";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { generateWebSiteSchema } from "@/lib/structured-data";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: "Awesome Robots - AI-Powered Robot Catalog",
  description: "Discover the latest AI-powered robots including humanoids, quadrupeds, and accessories. Browse comprehensive robot specifications, compare models, and find the perfect robot for research, education, or industry.",
  keywords: "AI robots, humanoid robots, quadruped robots, robot catalog, Unitree robots, robot specifications, robotics research, educational robots, industrial robots",
  authors: [{ name: "Awesome Robots Team" }],
  creator: "Awesome Robots",
  publisher: "Awesome Robots",
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Awesome Robots - AI-Powered Robot Catalog',
    description: 'Discover the latest AI-powered robots including humanoids, quadrupeds, and accessories.',
    siteName: 'Awesome Robots',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Awesome Robots - AI-Powered Robot Catalog',
    description: 'Discover the latest AI-powered robots including humanoids, quadrupeds, and accessories.',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Generate WebSite schema for the entire site
  const websiteSchema = generateWebSiteSchema(
    "Awesome Robots",
    env.NEXT_PUBLIC_BASE_URL,
    "Discover the latest AI-powered robots including humanoids, quadrupeds, and accessories. Browse comprehensive robot specifications, compare models, and find the perfect robot for research, education, or industry.",
    `${env.NEXT_PUBLIC_BASE_URL}/browse`,
    `${env.NEXT_PUBLIC_BASE_URL}/logo.png`
  );

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* WebSite Schema for Google SiteLinks Search Box */}
        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {JSON.stringify(websiteSchema)}
        </Script>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-88F0E7K5RF"
          strategy="afterInteractive"
          async
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-88F0E7K5RF');
          `}
        </Script>

        {/* Error Boundary for graceful error handling (T3 pattern) */}
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}

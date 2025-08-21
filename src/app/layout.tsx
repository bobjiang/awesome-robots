import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://awesome-robots.vercel.app'),
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        
        {children}
      </body>
    </html>
  );
}

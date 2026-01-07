import { Metadata } from 'next';
import { env } from "@/env.mjs";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import Layout from '@/components/Layout';
import Breadcrumb from '@/components/Breadcrumb';
import BrandBrowser from '@/components/BrandBrowser';
import { Robot } from '@/types/robot';
import { generateBreadcrumbSchema } from '@/lib/structured-data';
import robots from '@/data/robots.json';
import brands from '@/data/brands.json';

interface BrandPageProps {
  params: Promise<{ brand: string }>;
}

export async function generateStaticParams() {
  return brands.map((brand) => ({
    brand: brand.id,
  }));
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { brand: brandId } = await params;
  const brand = brands.find(b => b.id === brandId);

  if (!brand) {
    return { title: 'Brand Not Found | Awesome Robots' };
  }

  const baseUrl = env.NEXT_PUBLIC_BASE_URL;
  const brandUrl = `${baseUrl}/brands/${brandId}`;
  const brandRobots = (robots as Robot[]).filter(r => r.brand.toLowerCase().replace(/\s+/g, '-') === brandId);
  const robotCount = brandRobots.length;
  const minPrice = brandRobots.length > 0
    ? Math.min(...brandRobots.map(r => typeof r.price.starting === 'number' ? r.price.starting : 999999))
    : 0;
  const priceRange = minPrice < 999999 ? `from $${minPrice.toLocaleString()}` : '';

  const categories = Array.from(new Set(brandRobots.map(r => r.category)));
  const categoryText = categories.length > 0 ? categories.join(', ') : 'robot';

  return {
    title: `${brand.name} Robots - ${robotCount} Models ${priceRange} | ${categoryText}`,
    description: `${brand.description} Explore ${robotCount} ${brand.name} robots including ${categoryText} models. Compare specifications, pricing, and features. Official ${brand.name} robot catalog and reviews.`,
    keywords: [
      `${brand.name} robots`,
      `${brand.name} ${categoryText}`,
      `buy ${brand.name} robot`,
      `${brand.name} robot price`,
      `${brand.name} robot specifications`,
      `${brand.name} robot reviews`,
      `best ${brand.name} robot`,
      ...categories.map(cat => `${brand.name} ${cat} robot`),
    ].join(', '),
    authors: [{ name: 'Awesome Robots Team' }],
    alternates: {
      canonical: brandUrl,
    },
    openGraph: {
      type: 'website',
      url: brandUrl,
      title: `${brand.name} Robots - ${robotCount} Models Available`,
      description: brand.description,
      siteName: 'Awesome Robots',
      images: brand.logo ? [
        {
          url: brand.logo.startsWith('http') ? brand.logo : `${baseUrl}${brand.logo}`,
          width: 1200,
          height: 630,
          alt: `${brand.name} logo and robot collection`,
        },
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${brand.name} Robots`,
      description: brand.description,
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
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brand: brandId } = await params;
  const brand = brands.find(b => b.id === brandId);

  if (!brand) {
    notFound();
  }

  const brandRobots = (robots as Robot[]).filter((r: Robot) => r.brand.toLowerCase().replace(/\s+/g, '-') === brandId);

  const robotsByCategory = brandRobots.reduce((acc, robot) => {
    if (!acc[robot.category]) {
      acc[robot.category] = [];
    }
    acc[robot.category].push(robot);
    return acc;
  }, {} as Record<string, Robot[]>);

  // Generate structured data
  const baseUrl = env.NEXT_PUBLIC_BASE_URL;
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Brands', url: '/brands' },
    { name: brand.name, url: `/brands/${brandId}` }
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems, baseUrl);

  return (
    <Layout>
      {/* Structured Data for SEO */}
      <Script id="breadcrumb-schema" type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb Navigation with HTML microdata */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Brand Header */}
        <div className="text-center mb-12">
          {brand.logo && (
            <div className="w-48 h-24 mx-auto mb-6 relative">
              <Image
                src={brand.logo}
                alt={`${brand.name} logo - official robot manufacturer`}
                fill
                className="object-contain"
                priority
              />
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {brand.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            {brand.description}
          </p>
          <a
            href={brand.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors font-medium"
          >
            Visit Official Website
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <BrandBrowser
          robots={brandRobots}
          brandName={brand.name}
        />

        {/* Brand Stats */}
        {brandRobots.length > 0 && (
          <div className="mt-16 bg-gray-50 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {brandRobots.length}
                </div>
                <div className="text-gray-600">Total Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {Object.keys(robotsByCategory).length}
                </div>
                <div className="text-gray-600">Categories</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  ${Math.min(...brandRobots.map(r => typeof r.price.starting === 'number' ? r.price.starting : 999999)).toLocaleString()}+
                </div>
                <div className="text-gray-600">Starting Price</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/brands"
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              ← All Brands
            </Link>
            <Link
              href="/browse"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse All Robots
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

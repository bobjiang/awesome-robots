import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Script from 'next/script';
import Layout from '@/components/Layout';
import Breadcrumb from '@/components/Breadcrumb';
import CategoryBrowser from '@/components/CategoryBrowser';
import { Robot } from '@/types/robot';
import { generateBreadcrumbSchema, generateCategoryFAQSchema } from '@/lib/structured-data';
import robots from '@/data/robots.json';
import categories from '@/data/categories.json';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    category: category.id,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categoryId } = await params;
  const category = categories.find(c => c.id === categoryId);

  if (!category) {
    return { title: 'Category Not Found | Awesome Robots' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.awesomerobots.xyz';
  const categoryUrl = `${baseUrl}/categories/${categoryId}`;
  const categoryRobots = (robots as Robot[]).filter(r => r.category === categoryId);
  const robotCount = categoryRobots.length;
  const minPrice = categoryRobots.length > 0
    ? Math.min(...categoryRobots.map(r => typeof r.price.starting === 'number' ? r.price.starting : 999999))
    : 0;
  const priceRange = minPrice < 999999 ? `from $${minPrice.toLocaleString()}` : '';

  return {
    title: `${category.name} Robots - ${robotCount} Models ${priceRange} | Compare & Buy`,
    description: `${category.description} Browse ${robotCount} ${category.name.toLowerCase()} robots. Compare specifications, features, and pricing. Find the perfect ${category.name.toLowerCase()} robot for research, education, or industry.`,
    keywords: [
      `${category.name} robots`,
      `buy ${category.name} robot`,
      `${category.name} robot comparison`,
      `best ${category.name} robots`,
      `${category.name} robot price`,
      `${category.name} robot specifications`,
      'AI robots',
      'robot catalog',
      `${category.name} robot for sale`,
      `${category.name} robot reviews`,
    ].join(', '),
    authors: [{ name: 'Awesome Robots Team' }],
    alternates: {
      canonical: categoryUrl,
    },
    openGraph: {
      type: 'website',
      url: categoryUrl,
      title: `${category.name} Robots - Browse ${robotCount} Models`,
      description: category.description,
      siteName: 'Awesome Robots',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} Robots`,
      description: category.description,
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categoryId } = await params;
  const category = categories.find(c => c.id === categoryId);

  if (!category) {
    notFound();
  }

  const categoryRobots = (robots as Robot[]).filter((r: Robot) => r.category === categoryId);
  const availableBrands = Array.from(new Set(categoryRobots.map((r: Robot) => r.brand)));

  // Generate structured data
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.awesomerobots.xyz';
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Categories', url: '/categories' },
    { name: category.name, url: `/categories/${categoryId}` }
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems, baseUrl);
  const faqSchema = generateCategoryFAQSchema(categoryId);

  return (
    <Layout>
      {/* Structured Data for SEO */}
      <Script id="breadcrumb-schema" type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      <Script id="faq-schema" type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </Script>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb Navigation with HTML microdata */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <Image
              src={
                categoryId === 'humanoid' ? '/images/categories/humanoid.png' :
                categoryId === 'quadruped' ? '/images/categories/quadruped.png' :
                categoryId === 'accessory' ? '/images/categories/accessories.png' :
                '/images/categories/other.svg'
              }
              alt={`${category.name} robots category - browse and compare ${categoryRobots.length} models`}
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {category.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {category.description}
          </p>
        </div>

        <CategoryBrowser
          robots={categoryRobots}
          categoryId={categoryId}
          categoryName={category.name}
          availableBrands={availableBrands}
        />
      </div>
    </Layout>
  );
}

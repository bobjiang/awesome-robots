import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import SpecificationTable from '@/components/SpecificationTable';
import RobotDetailTemplate from '@/components/RobotDetailTemplate';
import RobotQuoteButton from '@/components/RobotQuoteButton';
import AISpecificationSummary from '@/components/AISpecificationSummary';
import ContentRelationships from '@/components/ContentRelationships';
import { Robot } from '@/types/robot';
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/structured-data';
import { formatPrice } from '@/utils/price-utils';
import { getFirstImage } from '@/utils/image-utils';
import robots from '@/data/robots.json';

interface RobotDetailPageProps {
  params: Promise<{ id: string }>;
}

// Temporarily disable static generation due to formbold-react SSR incompatibility
// Pages will be server-rendered on-demand instead
// TODO: Replace formbold-react with SSR-compatible form solution
export const dynamic = 'force-dynamic';

// Generate metadata for SEO optimization
export async function generateMetadata({ params }: RobotDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const robot = (robots as Robot[]).find((r: Robot) => r.id === id);

  if (!robot) {
    return {
      title: 'Robot Not Found | Awesome Robots',
      description: 'The robot you are looking for could not be found in our catalog.',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.awesomerobots.xyz';
  const robotUrl = `${baseUrl}/robots/${robot.id}`;
  const imageUrl = getFirstImage(robot.images, robot.category);
  const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;

  // Create price text for title
  const priceText = typeof robot.price.starting === 'number'
    ? `from $${robot.price.starting.toLocaleString()}`
    : 'Request Quote';

  // Extract key feature for description
  const keyFeature = robot.keyFeatures?.[0] || robot.features?.[0] || '';
  const featureText = keyFeature ? ` Features: ${keyFeature}.` : '';

  // Generate comprehensive keywords
  const additionalKeywords = robot.features?.slice(0, 5).map(f => f.toLowerCase()) || [];
  const keywordsArray = [
    `${robot.brand} ${robot.name}`,
    `${robot.name} robot`,
    `${robot.brand} robot`,
    `${robot.category} robot`,
    `buy ${robot.name}`,
    `${robot.name} price`,
    `${robot.name} specifications`,
    `${robot.name} review`,
    `${robot.category} robot for sale`,
    `best ${robot.category} robot`,
    ...additionalKeywords,
  ].filter(Boolean);
  const keywords = keywordsArray.join(', ');

  return {
    title: `${robot.brand} ${robot.name} - ${robot.category.charAt(0).toUpperCase() + robot.category.slice(1)} Robot ${priceText} | Specs & Review`,
    description: `${robot.description || 'Advanced AI-powered robot'}${featureText} Compare specs, pricing, and request a quote for the ${robot.brand} ${robot.name}. Perfect for research, education, and industrial applications.`,
    keywords,
    authors: [{ name: 'Awesome Robots Team' }],
    alternates: {
      canonical: robotUrl,
    },
    openGraph: {
      type: 'website',
      url: robotUrl,
      title: `${robot.brand} ${robot.name} - ${robot.category.charAt(0).toUpperCase() + robot.category.slice(1)} Robot`,
      description: robot.description || `Advanced ${robot.category} robot by ${robot.brand}`,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: `${robot.brand} ${robot.name} - ${robot.category} robot with advanced AI capabilities`,
        },
      ],
      siteName: 'Awesome Robots',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${robot.brand} ${robot.name}`,
      description: robot.description || `Advanced ${robot.category} robot by ${robot.brand}`,
      images: [absoluteImageUrl],
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

export default async function RobotDetailPage({ params }: RobotDetailPageProps) {
  const { id } = await params;
  const robot = (robots as Robot[]).find((r: Robot) => r.id === id);

  if (!robot) {
    notFound();
  }

  // Generate structured data for SEO
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.awesomerobots.xyz';
  const productSchema = generateProductSchema(robot, baseUrl);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Browse All', url: '/browse' },
    { name: robot.category.charAt(0).toUpperCase() + robot.category.slice(1), url: `/categories/${robot.category}` },
    { name: `${robot.brand} ${robot.name}`, url: `/robots/${robot.id}` }
  ], baseUrl);

  // Get related robots
  const relatedRobots = (robots as Robot[])
    .filter((r: Robot) => r.id !== robot.id && (r.category === robot.category || r.brand === robot.brand))
    .slice(0, 3);

  return (
    <Layout>
      {/* Structured Data for SEO */}
      <Script id="product-schema" type="application/ld+json">
        {JSON.stringify(productSchema)}
      </Script>
      <Script id="breadcrumb-schema" type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb Navigation with semantic markup */}
        <nav className="mb-8 text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1">
            <li className="inline-flex items-center">
              <Link href="/" className="hover:text-blue-600">Home</Link>
            </li>
            <li aria-hidden="true">{' > '}</li>
            <li className="inline-flex items-center">
              <Link href="/browse" className="hover:text-blue-600">Browse All</Link>
            </li>
            <li aria-hidden="true">{' > '}</li>
            <li className="inline-flex items-center">
              <Link href={`/categories/${robot.category}`} className="hover:text-blue-600 capitalize">
                {robot.category}
              </Link>
            </li>
            <li aria-hidden="true">{' > '}</li>
            <li>
              <span className="text-gray-900" aria-current="page">{robot.name}</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image/Visual */}
          <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center p-8">
            <div className="relative w-full h-full">
              <Image
                src={getFirstImage(robot.images, robot.category)}
                alt={`${robot.brand} ${robot.name} - ${robot.category} robot showcasing advanced features and capabilities`}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                {robot.brand}
              </span>
              <h1 className="text-4xl font-bold text-gray-900">{robot.name}</h1>
            </div>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {robot.description || `Advanced ${robot.category} robot by ${robot.brand}`}
            </p>

            {/* Pricing */}
            <div className="mb-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Options</h3>
              {robot.price.models && robot.price.models.length > 0 && (
                <div className="space-y-3">
                  {robot.price.models.map((model, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium">{model.name}</span>
                      <span className="text-xl font-bold text-blue-600">
                        {formatPrice(model.price)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <div className={robot.price.models && robot.price.models.length > 0 ? "mt-6 pt-4 border-t border-gray-200" : ""}>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Starting from</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(robot.price.starting)}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Quote Button Component - Client-side */}
            <RobotQuoteButton
              robotId={robot.id}
              robotName={robot.name}
              robotBrand={robot.brand}
            />

            <Link
              href={robot.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:border-gray-400 hover:text-gray-900 transition-colors"
            >
              View Official Page →
            </Link>
          </div>
        </div>

        {/* AI-Friendly Specification Summary */}
        <AISpecificationSummary robot={robot} />

        {/* Content Relationships */}
        <ContentRelationships currentRobot={robot} allRobots={robots as Robot[]} />

        {/* Enhanced Robot Details Template */}
        <div className="mb-16">
          <RobotDetailTemplate robot={robot} />
        </div>

        {/* Technical Specifications - Only show for robots without extended template data */}
        {!robot.generalInfo && robot.specifications && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Technical Specifications</h2>
            <SpecificationTable robot={robot} />
          </div>
        )}

        {/* Related Robots */}
        {relatedRobots.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Robots</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedRobots.map((relatedRobot: Robot) => (
                <ProductCard key={relatedRobot.id} robot={relatedRobot} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

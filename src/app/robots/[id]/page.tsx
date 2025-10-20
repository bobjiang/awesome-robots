'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import SpecificationTable from '@/components/SpecificationTable';
import RobotDetailTemplate from '@/components/RobotDetailTemplate';
import QuoteForm from '@/components/QuoteForm';
import AISpecificationSummary from '@/components/AISpecificationSummary';
import ContentRelationships from '@/components/ContentRelationships';
import { Robot } from '@/types/robot';
import { trackRobotQuote } from '@/lib/gtag';
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/structured-data';
import robots from '@/data/robots.json';

export default function RobotDetailPage() {
  const params = useParams();
  const robotId = params.id as string;
  const robot = (robots as Robot[]).find((r: Robot) => r.id === robotId);
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  // Generate structured data
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.awesomerobots.xyz';
  const productSchema = robot ? generateProductSchema(robot, baseUrl) : null;
  const breadcrumbSchema = robot ? generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Browse All', url: '/browse' },
    { name: robot.category, url: `/categories/${robot.category}` },
    { name: `${robot.brand} ${robot.name}`, url: `/robots/${robot.id}` }
  ], baseUrl) : null;

  const handleQuoteRequest = () => {
    if (robot) {
      trackRobotQuote(robot.id, robot.name, robot.brand);
    }
    setShowQuoteForm(true);
  };

  if (!robot) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Robot Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">The robot you&apos;re looking for doesn&apos;t exist in our catalog.</p>
          <Link 
            href="/browse"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse All Robots
          </Link>
        </div>
      </Layout>
    );
  }

  const relatedRobots = (robots as Robot[])
    .filter((r: Robot) => r.id !== robot.id && (r.category === robot.category || r.brand === robot.brand))
    .slice(0, 3);

  const formatPrice = (price: number | 'request' | null | undefined) => {
    if (price === 'request' || price === null || price === undefined) return 'Request Quote';
    return `$${price.toLocaleString()}`;
  };

  const getRobotImage = (robotId: string, category: string) => {
    // Use robot.images if available, otherwise fallback to mapping
    if (robot.images && robot.images.length > 0) {
      return robot.images[0];
    }
    
    const imageMap: { [key: string]: string } = {
      'unitree-g1': '/images/robots/unitree-g1.png',
      'unitree-h1': '/images/robots/h1-1.jpg',
      'unitree-go2': '/images/robots/go2-1.jpg',
      'unitree-go2-w': '/images/robots/quadruped/go2-w-1.png',
      'unitree-b2': '/images/robots/unitree-b2.png',
      'unitree-a2': '/images/robots/unitree-b2.png',
    };
    
    return imageMap[robotId] || (
      category === 'humanoid' ? '/images/categories/humanoid.png' :
      category === 'quadruped' ? '/images/categories/quadruped.png' :
      category === 'accessory' ? '/images/categories/accessories.png' :
      '/images/categories/other.svg'
    );
  };


  return (
    <Layout>
      {/* Structured Data */}
      {productSchema && (
        <Script id="product-schema" type="application/ld+json">
          {JSON.stringify(productSchema)}
        </Script>
      )}
      {breadcrumbSchema && (
        <Script id="breadcrumb-schema" type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </Script>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb with semantic markup */}
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
                src={getRobotImage(robot.id, robot.category)}
                alt={robot.name}
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
              {robot.description}
            </p>

            {/* Pricing */}
            <div className="mb-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Options</h3>
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
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Starting from</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatPrice(robot.price.starting)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quote Button */}
            <button
              onClick={handleQuoteRequest}
              className="w-full bg-blue-600 text-white text-lg font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors mb-4"
            >
              Request Quote
            </button>

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

      {/* Quote Form Modal */}
      {showQuoteForm && (
        <QuoteForm
          robotName={robot.name}
          robotBrand={robot.brand}
          onClose={() => setShowQuoteForm(false)}
        />
      )}
    </Layout>
  );
}
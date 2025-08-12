'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import SpecificationTable from '@/components/SpecificationTable';
import { Robot } from '@/types/robot';
import robots from '@/data/robots.json';

export default function RobotDetailPage() {
  const params = useParams();
  const robotId = params.id as string;
  const robot = (robots as Robot[]).find((r: Robot) => r.id === robotId);
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  if (!robot) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Robot Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">The robot you&apos;re looking for doesn&apos;t exist in our catalog.</p>
          <Link 
            href="/categories"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse All Categories
          </Link>
        </div>
      </Layout>
    );
  }

  const relatedRobots = (robots as Robot[])
    .filter((r: Robot) => r.id !== robot.id && (r.category === robot.category || r.brand === robot.brand))
    .slice(0, 3);

  const formatPrice = (price: number | 'request') => {
    if (price === 'request') return 'Request Quote';
    return `$${price.toLocaleString()}`;
  };

  const getRobotImage = (robotId: string, category: string) => {
    const imageMap: { [key: string]: string } = {
      'unitree-g1': '/images/robots/unitree-g1.png',
      'unitree-h1': '/images/robots/unitree-h1.png',
      'unitree-go2': '/images/robots/unitree-go2.png',
      'unitree-go2-w': '/images/robots/unitree-go2.png',
      'unitree-b2': '/images/robots/unitree-b2.png',
      'unitree-a2': '/images/robots/unitree-b2.png',
    };
    
    return imageMap[robotId] || (
      category === 'humanoid' ? '/images/categories/humanoid.png' :
      category === 'quadruped' ? '/images/categories/quadruped.png' :
      category === 'accessory' ? '/images/categories/accessories.svg' :
      '/images/categories/other.svg'
    );
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          {' > '}
          <Link href="/categories" className="hover:text-blue-600">Categories</Link>
          {' > '}
          <Link href={`/categories/${robot.category}`} className="hover:text-blue-600 capitalize">
            {robot.category}
          </Link>
          {' > '}
          <span className="text-gray-900">{robot.name}</span>
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
              onClick={() => setShowQuoteForm(true)}
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

        {/* Detailed Specifications Table */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Technical Specifications</h2>
          <SpecificationTable robot={robot} />
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {robot.features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Request Quote</h3>
              <button
                onClick={() => setShowQuoteForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600">Product: <strong>{robot.name}</strong></p>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company (Optional)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please describe your requirements and intended use case..."
                ></textarea>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowQuoteForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
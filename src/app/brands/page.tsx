'use client';

import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import brands from '@/data/brands.json';

export default function BrandsPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Robot Brands
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore leading robotics companies and their innovative AI-powered robots. 
            From established industry leaders to cutting-edge pioneers, discover the brands shaping the future of robotics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <Link href={`/browse?brand=${brand.name}`}>
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-blue-50 group-hover:to-blue-100 transition-colors p-8">
                  <div className="text-center w-full h-full">
                    <div className="relative w-32 h-16 mx-auto mb-4">
                      <Image
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {brand.name}
                    </h2>
                  </div>
                </div>
              </Link>
              
              <div className="p-6">
                <p className="text-gray-600 text-base leading-relaxed mb-4">
                  {brand.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Link 
                    href={`/browse?brand=${brand.name}`}
                    className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors"
                  >
                    <span className="font-medium">View {brand.name} Robots</span>
                    <svg 
                      className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Official Site →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 bg-blue-50 rounded-xl p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Looking for a Specific Brand?
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              We&apos;re constantly expanding our catalog with leading robotics companies. 
              Explore our curated selection of AI-powered robots from top global manufacturers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/browse"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Browse All Robots
              </Link>
              <Link
                href="/blog"
                className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-colors"
              >
                Latest News
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
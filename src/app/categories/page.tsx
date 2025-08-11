'use client';

import Link from 'next/link';
import Layout from '@/components/Layout';
import categories from '@/data/categories.json';

export default function CategoriesPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Robot Categories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive collection of AI-powered robots organized by category. 
            From humanoid companions to quadruped explorers, find the perfect robot for your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-blue-50 group-hover:to-blue-100 transition-colors">
                <div className="text-center">
                  <div className="text-8xl mb-4">
                    {category.id === 'humanoid' && '🤖'}
                    {category.id === 'quadruped' && '🐕'}
                    {category.id === 'accessory' && '🔧'}
                    {category.id === 'other' && '⚙️'}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h2>
                </div>
              </div>
              
              <div className="p-8">
                <p className="text-gray-600 text-lg leading-relaxed">
                  {category.description}
                </p>
                
                <div className="mt-6 flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                  <span className="font-medium">Browse {category.name.toLowerCase()}</span>
                  <svg 
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 bg-blue-50 rounded-xl p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Need Help Choosing?
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Not sure which category fits your needs? Check out our buying guides and tutorials 
              to help you make the right decision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/blog/buying-guides"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                View Buying Guides
              </Link>
              <Link
                href="/blog"
                className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-colors"
              >
                Browse Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
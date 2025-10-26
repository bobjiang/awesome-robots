import Link from 'next/link';
import Layout from '@/components/Layout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Robot Comparisons & Buying Guides 2025 | Awesome Robots',
  description: 'Compare humanoid and quadruped robots side-by-side. Expert analysis of Unitree vs Boston Dynamics, pricing comparisons, and comprehensive buying guides to find the perfect robot for your needs.',
  keywords: 'robot comparison, humanoid vs quadruped, unitree vs boston dynamics, robot buying guide, best robots 2025',
};

export default function ComparePage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Robot Comparisons & Buying Guides
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert comparisons and comprehensive guides to help you choose the right robot for your specific needs and budget
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Unitree vs Boston Dynamics */}
          <Link
            href="/compare/unitree-vs-boston-dynamics"
            className="group bg-white p-8 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                Unitree vs Boston Dynamics
              </h2>
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">
              Complete comparison of pricing, specifications, and value. Which manufacturer is right for you?
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Pricing</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Specifications</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">ROI Analysis</span>
            </div>
          </Link>

          {/* Humanoid vs Quadruped (Coming Soon placeholder) */}
          <div className="bg-gray-50 p-8 rounded-xl border-2 border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-400">
                Humanoid vs Quadruped
              </h2>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                Coming Soon
              </span>
            </div>
            <p className="text-gray-500 mb-4">
              Which robot type is better for your application? Compare bipedal vs four-legged robots.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-full">Use Cases</span>
              <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-full">Capabilities</span>
              <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-full">Applications</span>
            </div>
          </div>

          {/* Best Humanoid Robots Under $50K (Coming Soon) */}
          <div className="bg-gray-50 p-8 rounded-xl border-2 border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-400">
                Best Humanoid Robots Under $50,000
              </h2>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                Coming Soon
              </span>
            </div>
            <p className="text-gray-500 mb-4">
              7 best affordable humanoid robots compared. Value & performance analysis for budget-conscious buyers.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-full">Budget Guide</span>
              <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-full">Value Analysis</span>
            </div>
          </div>

          {/* Industrial Humanoid Robots (Coming Soon) */}
          <div className="bg-gray-50 p-8 rounded-xl border-2 border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-400">
                Industrial Humanoid Robots Comparison
              </h2>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                Coming Soon
              </span>
            </div>
            <p className="text-gray-500 mb-4">
              Compare industrial-grade humanoids for manufacturing & warehouse automation applications.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-full">Industrial</span>
              <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-full">Payload</span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-50 to-purple-50 p-12 rounded-2xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Can&apos;t Find the Comparison You Need?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse our complete catalog of 115+ robots or explore by category to find detailed specifications and reviews.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/browse"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse All Robots
            </Link>
            <Link
              href="/categories"
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Explore Categories
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

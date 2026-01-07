import { Metadata } from 'next';
import { env } from "@/env.mjs";
import Link from 'next/link';
import Script from 'next/script';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { Robot } from '@/types/robot';
import { generateBreadcrumbSchema, generateCategoryFAQSchema } from '@/lib/structured-data';
import robots from '@/data/robots.json';

export const metadata: Metadata = {
  title: 'Humanoid Robots for Sale 2025 - Compare Prices, Specs & Reviews | Awesome Robots',
  description: 'Browse 50+ humanoid robots from $5,000 to $150,000+. Compare bipedal robots for research, education, and industrial automation. Unitree, Boston Dynamics, UBTech, and more. Expert guides and instant quotes.',
  keywords: 'humanoid robots for sale, buy humanoid robot, humanoid robot price, bipedal robot, research humanoid, educational humanoid robot, Unitree G1, Boston Dynamics Atlas, humanoid robot comparison',
  alternates: {
    canonical: 'https://www.awesomerobots.xyz/humanoid-robots',
  },
  openGraph: {
    title: 'Humanoid Robots for Sale 2025 - Compare Prices & Specs',
    description: 'Browse 50+ humanoid robots from leading manufacturers. Compare specifications, read reviews, and request quotes.',
    url: 'https://www.awesomerobots.xyz/humanoid-robots',
    type: 'website',
  },
};

export default function HumanoidRobotsPage() {
  const baseUrl = env.NEXT_PUBLIC_BASE_URL;

  // Filter humanoid robots and sort by price
  const humanoidRobots = (robots as Robot[])
    .filter(robot => robot.category === 'humanoid')
    .sort((a, b) => {
      const priceA = typeof a.price.starting === 'number' ? a.price.starting : 999999;
      const priceB = typeof b.price.starting === 'number' ? b.price.starting : 999999;
      return priceA - priceB;
    });

  // Generate structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Humanoid Robots', url: '/humanoid-robots' }
  ], baseUrl);

  const faqSchema = generateCategoryFAQSchema('humanoid');

  // Get unique brands
  const brands = Array.from(new Set(humanoidRobots.map(r => r.brand)));

  return (
    <Layout>
      {/* Structured Data */}
      <Script id="breadcrumb-schema" type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      <Script id="faq-schema" type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </Script>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center space-x-2">
            <li><Link href="/" className="text-blue-600 hover:text-blue-700">Home</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-600">Humanoid Robots</li>
          </ol>
        </nav>

        {/* Page Header with SEO Content */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Humanoid Robots for Sale in 2025
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl">
            Discover {humanoidRobots.length}+ advanced humanoid robots from leading manufacturers worldwide.
            Compare specifications, pricing, and capabilities to find the perfect bipedal robot for your
            research lab, educational institution, or industrial automation needs.
          </p>
        </header>

        {/* SEO Content Section */}
        <section className="mb-12 bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Why Choose a Humanoid Robot?
          </h2>
          <div className="prose prose-lg text-gray-700 max-w-none">
            <p>
              Humanoid robots represent the pinnacle of robotics engineering, combining advanced AI,
              sophisticated locomotion systems, and human-like form factors. Unlike quadruped or wheeled
              robots, humanoids can navigate environments designed for humans, use tools made for human hands,
              and interact naturally with people in shared workspaces.
            </p>
            <p className="mt-4">
              Modern humanoid robots like the <Link href="/robots/unitree-g1" className="text-blue-600 hover:underline">Unitree G1</Link> (starting
              at $16,000) and <Link href="/robots/unitree-h1" className="text-blue-600 hover:underline">Unitree H1</Link> offer
              impressive capabilities at increasingly accessible price points. These platforms support ROS2,
              Python SDKs, and various AI frameworks, making them ideal for research and development.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              Key Applications for Humanoid Robots
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Academic Research:</strong> Study locomotion, AI, computer vision, and human-robot interaction</li>
              <li><strong>Industrial Automation:</strong> Perform tasks in human-designed environments without modifications</li>
              <li><strong>Healthcare & Eldercare:</strong> Assist patients and provide companionship</li>
              <li><strong>Education:</strong> Teach robotics, programming, and AI concepts</li>
              <li><strong>Entertainment & Events:</strong> Public demonstrations and interactive experiences</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              How to Choose a Humanoid Robot
            </h3>
            <p>
              When selecting a humanoid robot, consider your primary use case, budget, and technical requirements.
              Research platforms typically need open SDKs and ROS support, while commercial applications prioritize
              reliability and support. Entry-level humanoids start around $5,000, professional research platforms
              range from $15,000-$50,000, and advanced industrial humanoids can exceed $150,000.
            </p>
          </div>
        </section>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{humanoidRobots.length}+</div>
            <div className="text-sm text-gray-600">Models Available</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{brands.length}</div>
            <div className="text-sm text-gray-600">Leading Brands</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">$5K</div>
            <div className="text-sm text-gray-600">Starting Price</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">2025</div>
            <div className="text-sm text-gray-600">Latest Models</div>
          </div>
        </div>

        {/* Product Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              All Humanoid Robots ({humanoidRobots.length})
            </h2>
            <Link
              href="/browse?category=humanoid"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Advanced Filters →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {humanoidRobots.map((robot) => (
              <ProductCard key={robot.id} robot={robot} />
            ))}
          </div>
        </section>

        {/* Related Categories */}
        <section className="mt-16 pt-12 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Other Categories</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/quadruped-robots" className="block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold text-gray-900 mb-2">Quadruped Robots</h3>
              <p className="text-sm text-gray-600">Four-legged robot dogs for mobility and exploration</p>
            </Link>
            <Link href="/compare" className="block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold text-gray-900 mb-2">Compare Robots</h3>
              <p className="text-sm text-gray-600">Side-by-side comparisons of popular models</p>
            </Link>
            <Link href="/blog/category/buying-guides" className="block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold text-gray-900 mb-2">Buying Guides</h3>
              <p className="text-sm text-gray-600">Expert advice for choosing the right robot</p>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}

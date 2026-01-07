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
  title: 'Quadruped Robots & Robot Dogs 2025 - Compare Prices & Specs | Awesome Robots',
  description: 'Browse 40+ quadruped robots and robot dogs from $1,600 to $75,000+. Compare Unitree Go2, Boston Dynamics Spot, Deep Robotics X30 and more. Perfect for inspection, research, and security applications.',
  keywords: 'quadruped robots for sale, robot dog price, buy robot dog, Unitree Go2, Boston Dynamics Spot, Deep Robotics, four-legged robot, inspection robot, security robot dog',
  alternates: {
    canonical: 'https://www.awesomerobots.xyz/quadruped-robots',
  },
  openGraph: {
    title: 'Quadruped Robots & Robot Dogs 2025 - Compare Prices & Specs',
    description: 'Browse 40+ quadruped robots from leading manufacturers. Compare specifications, read reviews, and request quotes.',
    url: 'https://www.awesomerobots.xyz/quadruped-robots',
    type: 'website',
  },
};

export default function QuadrupedRobotsPage() {
  const baseUrl = env.NEXT_PUBLIC_BASE_URL;

  // Filter quadruped robots and sort by price
  const quadrupedRobots = (robots as Robot[])
    .filter(robot => robot.category === 'quadruped')
    .sort((a, b) => {
      const priceA = typeof a.price.starting === 'number' ? a.price.starting : 999999;
      const priceB = typeof b.price.starting === 'number' ? b.price.starting : 999999;
      return priceA - priceB;
    });

  // Generate structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Quadruped Robots', url: '/quadruped-robots' }
  ], baseUrl);

  const faqSchema = generateCategoryFAQSchema('quadruped');

  // Get unique brands
  const brands = Array.from(new Set(quadrupedRobots.map(r => r.brand)));

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
            <li className="text-gray-600">Quadruped Robots</li>
          </ol>
        </nav>

        {/* Page Header with SEO Content */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Quadruped Robots & Robot Dogs for Sale in 2025
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl">
            Explore {quadrupedRobots.length}+ four-legged robots designed for terrain navigation, inspection,
            and industrial applications. From the affordable Unitree Go2 to the industrial-grade Boston
            Dynamics Spot, find the perfect quadruped for your needs.
          </p>
        </header>

        {/* SEO Content Section */}
        <section className="mb-12 bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Why Choose a Quadruped Robot?
          </h2>
          <div className="prose prose-lg text-gray-700 max-w-none">
            <p>
              Quadruped robots excel where wheeled and tracked robots struggle. Their four-legged design
              provides exceptional stability on uneven terrain, the ability to climb stairs, and dynamic
              balance that allows recovery from unexpected disturbances. This makes them ideal for real-world
              deployment in construction sites, industrial facilities, and outdoor environments.
            </p>
            <p className="mt-4">
              The <Link href="/robots/unitree-go2" className="text-blue-600 hover:underline">Unitree Go2</Link> has
              democratized robot dog ownership, starting at just $1,600 while offering impressive capabilities.
              For industrial applications, the <Link href="/robots/deep-robotics-x30" className="text-blue-600 hover:underline">Deep Robotics X30</Link> and
              Boston Dynamics Spot provide IP67-rated durability and enterprise-grade support.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              Key Applications for Quadruped Robots
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Industrial Inspection:</strong> Monitor pipelines, power plants, and manufacturing facilities</li>
              <li><strong>Construction & Mining:</strong> Survey sites, detect hazards, and map environments</li>
              <li><strong>Security & Surveillance:</strong> Autonomous patrols and perimeter monitoring</li>
              <li><strong>Research & Education:</strong> Study locomotion, AI, and robot learning</li>
              <li><strong>Search & Rescue:</strong> Navigate disaster sites and locate survivors</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              Choosing the Right Quadruped Robot
            </h3>
            <p>
              Consider your deployment environment, payload requirements, and budget. Entry-level robots
              like Unitree Go2 are perfect for education and light research. Professional platforms like
              Deep Robotics Lite3 offer better payload and SDK support. Enterprise solutions like Spot
              provide comprehensive support, integration services, and proven industrial reliability.
            </p>
          </div>
        </section>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{quadrupedRobots.length}+</div>
            <div className="text-sm text-gray-600">Models Available</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{brands.length}</div>
            <div className="text-sm text-gray-600">Leading Brands</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">$1.6K</div>
            <div className="text-sm text-gray-600">Starting Price</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">IP67</div>
            <div className="text-sm text-gray-600">Industrial Grade</div>
          </div>
        </div>

        {/* Product Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              All Quadruped Robots ({quadrupedRobots.length})
            </h2>
            <Link
              href="/browse?category=quadruped"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Advanced Filters →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quadrupedRobots.map((robot) => (
              <ProductCard key={robot.id} robot={robot} />
            ))}
          </div>
        </section>

        {/* Related Categories */}
        <section className="mt-16 pt-12 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Other Categories</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/humanoid-robots" className="block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <h3 className="font-semibold text-gray-900 mb-2">Humanoid Robots</h3>
              <p className="text-sm text-gray-600">Bipedal robots for research and automation</p>
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

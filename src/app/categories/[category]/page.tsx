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
            {category.name} - {categoryRobots.length} Models Compared
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {category.description}
          </p>
        </div>

        {/* Enhanced SEO Content */}
        {categoryId === 'humanoid' && (
          <div className="max-w-4xl mx-auto mb-16 prose prose-lg">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Humanoid Robots?</h2>
              <p className="text-gray-700 leading-relaxed">
                Humanoid robots are sophisticated bipedal machines designed to replicate human form, movement, and interaction capabilities. Unlike traditional industrial robots confined to specific tasks, humanoids feature anthropomorphic characteristics including two legs for bipedal locomotion, two arms with articulated hands for object manipulation, a torso housing computing systems, and a head equipped with sensors for vision and environmental awareness. These robots range from compact educational platforms under $20,000 to advanced industrial humanoids exceeding $150,000, with applications spanning manufacturing automation, healthcare assistance, research, and education.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Applications of Humanoid Robots in 2025</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 not-prose">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Industrial Manufacturing</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Warehouse automation and logistics (picking, packing, sorting)</li>
                  <li>• Assembly line assistance with 20-40kg payload capacity</li>
                  <li>• Quality inspection using computer vision</li>
                  <li>• Machine tending in automotive and electronics production</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Healthcare & Elderly Care</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Patient assistance and mobility support</li>
                  <li>• Medication delivery and monitoring</li>
                  <li>• Social companionship for seniors (reducing isolation)</li>
                  <li>• Rehabilitation therapy assistance</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Research & Education</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• University robotics programs and research platforms</li>
                  <li>• AI and machine learning development (ROS2 compatible)</li>
                  <li>• STEM education tools for schools and training centers</li>
                  <li>• Human-robot interaction (HRI) research</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Service & Hospitality</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Hotel concierge and guest services</li>
                  <li>• Restaurant food delivery and table service</li>
                  <li>• Retail customer assistance and inventory</li>
                  <li>• Security patrol and monitoring</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Choose a Humanoid Robot - 2025 Buyer&apos;s Guide</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">By Budget & Use Case</h3>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Price Range</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Target Users</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Recommended Models</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Key Features</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  <tr className="border-b">
                    <td className="px-6 py-4 font-semibold">$5,000-$20,000</td>
                    <td className="px-6 py-4">Education, Hobbyists, Small Labs</td>
                    <td className="px-6 py-4">Unitree G1 EDU ($16,000), Neura 4NE1 ($15,000)</td>
                    <td className="px-6 py-4">23-43 DOF, Python/ROS2, 2-4hr battery</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-semibold">$20,000-$80,000</td>
                    <td className="px-6 py-4">Research Institutions, Startups</td>
                    <td className="px-6 py-4">Unitree H1 ($90,000), Fourier GR-1 ($150,000)</td>
                    <td className="px-6 py-4">30-44 DOF, 15-50kg payload, advanced AI</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">$80,000-$200,000+</td>
                    <td className="px-6 py-4">Industrial, Healthcare, Commercial</td>
                    <td className="px-6 py-4">UBTECH Walker S2, Fourier GR-2</td>
                    <td className="px-6 py-4">35-40 DOF, battery swapping, industrial durability</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Specifications to Consider</h3>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <ol className="space-y-3 text-gray-700">
                <li><strong>1. Degrees of Freedom (DOF):</strong> Educational models: 20-30 DOF. Research platforms: 30-40 DOF. Industrial humanoids: 35-44 DOF for complex manipulation tasks.</li>
                <li><strong>2. Payload Capacity:</strong> Educational: 5-10kg. Research: 10-20kg. Industrial: 20-50kg per arm for warehouse and manufacturing applications.</li>
                <li><strong>3. Battery Life:</strong> Typical runtime: 2-4 hours. Industrial models feature hot-swappable batteries or autonomous charging docks for 24/7 operation.</li>
                <li><strong>4. SDK & Software Support:</strong> Look for ROS2 compatibility, Python APIs, simulation support (Gazebo, Isaac Sim), and open-source development tools.</li>
                <li><strong>5. Sensors & Perception:</strong> RGB-D cameras, 3D LiDAR, IMU, force-torque sensors. Advanced models include thermal imaging and tactile sensing.</li>
                <li><strong>6. Computing Power:</strong> Entry-level: Raspberry Pi/Jetson Nano. Advanced: Jetson Orin, Intel NUC, or custom computing clusters for real-time AI processing.</li>
              </ol>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Humanoid Robot Price Trends 2025</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The humanoid robot market has seen dramatic price reductions in 2025, making these technologies accessible to a broader audience. Chinese manufacturers like Unitree and UBTECH have led the affordability revolution, offering full-size humanoid robots starting at $5,900 (Unitree R1) compared to $150,000+ for Western competitors. This democratization has accelerated adoption in education (universities deploying humanoids for $16,000 vs. $100,000+ in 2023), small businesses testing automation, and research labs expanding their robot fleets. Industrial-grade humanoids remain expensive ($80,000-$200,000) but offer autonomous battery swapping, IP54-IP67 ratings, and 50kg+ payload capacities justifying the premium for warehouse and manufacturing deployment.
            </p>

            <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">💡 Pro Tip: Total Cost of Ownership (TCO)</h3>
              <p className="text-gray-700">
                When budgeting for a humanoid robot, factor in implementation costs (integration: $10,000-$50,000), annual maintenance ($2,000-$15,000), software licenses, training programs, and potential facility modifications. TCO typically runs 150-200% of the initial purchase price over 3 years. Calculate ROI based on labor savings, productivity gains, and quality improvements - most industrial deployments achieve 18-24 month payback periods.
              </p>
            </div>
          </div>
        )}

        {categoryId === 'quadruped' && (
          <div className="max-w-4xl mx-auto mb-16 prose prose-lg">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Quadruped Robots?</h2>
              <p className="text-gray-700 leading-relaxed">
                Quadruped robots, often called &ldquo;robot dogs,&rdquo; are four-legged robotic systems designed for superior mobility, stability, and terrain navigation. Unlike wheeled robots limited to flat surfaces, quadrupeds excel at climbing stairs, navigating rough terrain, and operating in challenging industrial environments. These robots range from affordable educational models ($1,600) to industrial-grade platforms ($74,500+) with IP67 waterproofing, ATEX certification for hazardous areas, and advanced perception systems for autonomous navigation.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Industrial Applications of Quadruped Robots</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Quadruped robots have become essential tools for industrial inspection, security patrol, and research applications where traditional wheeled robots fail. Their ability to navigate stairs, cross obstacles, and operate in extreme conditions makes them ideal for oil & gas facilities, construction sites, manufacturing plants, and search & rescue operations.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Top Use Cases:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 not-prose">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">🏭 Industrial Inspection</h4>
                <p className="text-gray-700">Autonomous facility monitoring, thermal imaging for equipment health, gas leak detection, and infrastructure inspection in oil & gas, utilities, and manufacturing plants. Reduces human exposure to hazardous environments.</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">🔒 Security & Surveillance</h4>
                <p className="text-gray-700">Perimeter patrol, intrusion detection, 24/7 autonomous monitoring with thermal cameras and AI-powered anomaly detection. Deployed at data centers, warehouses, and critical infrastructure sites.</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">🎓 Research & Education</h4>
                <p className="text-gray-700">Locomotion research, reinforcement learning platforms, SLAM algorithm development, and university robotics programs. ROS2-compatible models enable cutting-edge AI research.</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">🚨 Search & Rescue</h4>
                <p className="text-gray-700">Disaster response in collapsed structures, hazmat situations, and wilderness search operations. Advanced models feature LIDAR mapping, thermal imaging, and communication relay systems.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Choosing the Right Quadruped Robot</h2>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Budget</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Recommended Model</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Best For</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 border-b">Key Specs</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  <tr className="border-b">
                    <td className="px-6 py-4 font-semibold">$1,600-$3,500</td>
                    <td className="px-6 py-4">Unitree Go2</td>
                    <td className="px-6 py-4">Education, Research, Hobbyists</td>
                    <td className="px-6 py-4">12 DOF, 5kg payload, 2hr battery, ROS2</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-6 py-4 font-semibold">$15,000-$30,000</td>
                    <td className="px-6 py-4">Deep Robotics Lite3</td>
                    <td className="px-6 py-4">Professional Research, Light Industrial</td>
                    <td className="px-6 py-4">12 DOF, 10kg payload, IP54, advanced sensors</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-semibold">$50,000-$75,000+</td>
                    <td className="px-6 py-4">Boston Dynamics Spot, Deep Robotics X30</td>
                    <td className="px-6 py-4">Industrial Inspection, Security</td>
                    <td className="px-6 py-4">12 DOF, 20-30kg payload, IP67, 5hr battery, ATEX</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 Beginner&apos;s Choice: Unitree Go2</h3>
              <p className="text-gray-700">
                The Unitree Go2 is the most popular entry-level quadruped for good reason: exceptional value at $1,600, comprehensive ROS2 SDK, active developer community, and proven reliability with 10,000+ units deployed worldwide. Its 2-hour battery life, stair-climbing capability, and AI-powered obstacle avoidance make it perfect for learning robotics, university research projects, and prototyping applications before scaling to industrial models.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Can Quadruped Robots Climb Stairs?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Yes, modern quadruped robots can reliably climb stairs and navigate complex terrain. Advanced models like Boston Dynamics Spot, Unitree Go2, Deep Robotics X30, and ANYbotics ANYmal use sophisticated balance algorithms, real-time trajectory planning, and force-torque sensing to maintain stability on stairs, ramps, and uneven surfaces. These robots can typically handle:
            </p>
            <ul className="text-gray-700 space-y-2 mb-6">
              <li>• Standard commercial stairs (up to 35° incline)</li>
              <li>• Obstacles up to 40cm height</li>
              <li>• Gravel, grass, snow, and mud terrain</li>
              <li>• Metal grating and perforated platforms</li>
              <li>• Narrow passages and confined spaces</li>
            </ul>

            <p className="text-gray-700 leading-relaxed">
              This capability makes quadrupeds superior to wheeled robots for facility inspection, multi-floor security patrol, and construction site navigation where stairs and obstacles are common.
            </p>
          </div>
        )}

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

import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import categories from '@/data/categories.json';

export default function Home() {
  return (
    <Layout>
      {/* Featured Robots Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Robots
            </h2>
            <p className="text-lg text-gray-600">
              Discover the latest and most popular AI-powered robots
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-8">
                <div className="relative w-full h-full">
                  <Image
                    src="/images/robots/unitree-g1.png"
                    alt="Unitree G1"
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Unitree G1</h3>
                <p className="text-gray-600 mb-4">Advanced humanoid robot with 43 degrees of freedom</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">From $16,000</span>
                  <Link
                    href="/robots/unitree-g1"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    prefetch={true}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center p-8">
                <div className="relative w-full h-full">
                  <Image
                    src="/images/robots/unitree-go2.png"
                    alt="Unitree Go2"
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Unitree Go2</h3>
                <p className="text-gray-600 mb-4">Consumer quadruped robot with AI integration</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">From $1,600</span>
                  <Link
                    href="/robots/unitree-go2"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    prefetch={true}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center p-8">
                <div className="relative w-full h-full">
                  <Image
                    src="/images/robots/unitree-h1.png"
                    alt="Unitree H1"
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Unitree H1</h3>
                <p className="text-gray-600 mb-4">Full-size humanoid robot capable of running</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-purple-600">Request Quote</span>
                  <Link
                    href="/robots/unitree-h1"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    prefetch={true}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Robot Categories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From humanoid companions to quadruped explorers, discover the perfect robot for your needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/browse?category=${category.id}`}
                className="group bg-gray-50 rounded-xl p-6 hover:bg-blue-50 hover:shadow-lg transition-all duration-300"
              >
                <div className="mb-4 w-16 h-16 mx-auto relative">
                  <Image
                    src={
                      category.id === 'humanoid' ? '/images/categories/humanoid.png' :
                      category.id === 'quadruped' ? '/images/categories/quadruped.png' :
                      category.id === 'accessory' ? '/images/categories/accessories.svg' :
                      '/images/categories/other.svg'
                    }
                    alt={category.name}
                    fill
                    className="object-contain"
                    loading="lazy"
                    sizes="64px"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Robot?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Browse our comprehensive catalog and discover the AI-powered robot that meets your needs.
          </p>
          <Link
            href="/browse"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
          >
            Start Exploring
          </Link>
        </div>
      </section>
    </Layout>
  );
}

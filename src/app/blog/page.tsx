import { posts } from '#site/content'
import Layout from '@/components/Layout'
import BlogCard from '@/components/blog/BlogCard'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Robot Blog - Latest News, Reviews & Guides | Awesome Robots',
  description: 'Stay updated with the latest robotics news, in-depth robot reviews, buying guides, and tutorials. Expert insights on quadruped robots, humanoids, and more.',
  keywords: ['robotics blog', 'robot reviews', 'quadruped robots', 'humanoid robots', 'robot news', 'buying guides'],
}

export default function BlogPage() {
  const publishedPosts = posts.filter(post => post.published).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const featuredPosts = publishedPosts.filter(post => post.featured)
  const recentPosts = publishedPosts.slice(0, 9)

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Robot Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest robotics news, in-depth reviews, buying guides, and expert insights. 
            From quadruped robots to humanoids, we cover it all.
          </p>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Featured Articles</h2>
              <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-transparent ml-8"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.slice(0, 3).map(post => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest Posts</h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-transparent ml-8"></div>
          </div>
          
          {recentPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map(post => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600">
                Check back soon for the latest robotics content!
              </p>
            </div>
          )}
        </section>

        {/* Categories */}
        <section className="mt-16 bg-gray-50 rounded-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600">
              Find exactly what you&apos;re looking for with our organized content categories.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { id: 'reviews', name: 'Reviews', icon: '⭐', description: 'In-depth robot reviews' },
              { id: 'tutorials', name: 'Tutorials', icon: '📚', description: 'Step-by-step guides' },
              { id: 'news', name: 'News', icon: '📰', description: 'Latest robotics news' },
              { id: 'buying-guides', name: 'Buying Guides', icon: '🛒', description: 'Purchase recommendations' },
              { id: 'case-studies', name: 'Case Studies', icon: '📊', description: 'Real-world applications' },
              { id: 'digest', name: 'Digest', icon: '📧', description: 'Weekly robotics digest' },
            ].map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.id}`}
                className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow group"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 mb-1">
                  {category.name}
                </div>
                <div className="text-xs text-gray-500">
                  {category.description}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}
import { notFound } from 'next/navigation'
import { posts } from '#site/content'
import Layout from '@/components/Layout'
import BlogCard from '@/components/blog/BlogCard'
import { Metadata } from 'next'

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

const categories = ['reviews', 'tutorials', 'news', 'buying-guides', 'case-studies'] as const

export async function generateStaticParams() {
  return categories.map((category) => ({
    category,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  
  if (!categories.includes(category as any)) {
    return {
      title: 'Category Not Found',
    }
  }

  const categoryName = category.replace('-', ' ')
  const categoryData = {
    reviews: {
      title: 'Robot Reviews',
      description: 'In-depth reviews and analysis of the latest robots, from quadrupeds to humanoids.',
    },
    tutorials: {
      title: 'Robot Tutorials',
      description: 'Step-by-step guides and tutorials for working with robots and robotics technology.',
    },
    news: {
      title: 'Robotics News',
      description: 'Latest news and updates from the world of robotics and AI.',
    },
    'buying-guides': {
      title: 'Robot Buying Guides',
      description: 'Expert recommendations and guides to help you choose the perfect robot.',
    },
    'case-studies': {
      title: 'Robot Case Studies',
      description: 'Real-world applications and success stories featuring robotic systems.',
    },
  }

  const data = categoryData[category as keyof typeof categoryData]

  return {
    title: `${data.title} | Awesome Robots Blog`,
    description: data.description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  
  if (!categories.includes(category as any)) {
    notFound()
  }

  const categoryPosts = posts
    .filter((post) => post.published && post.category === category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const categoryName = category.replace('-', ' ')
  
  const getCategoryInfo = (cat: string) => {
    const info = {
      reviews: {
        icon: '⭐',
        description: 'In-depth reviews and analysis of the latest robots, from quadrupeds to humanoids.'
      },
      tutorials: {
        icon: '📚',
        description: 'Step-by-step guides and tutorials for working with robots and robotics technology.'
      },
      news: {
        icon: '📰',
        description: 'Latest news and updates from the world of robotics and AI.'
      },
      'buying-guides': {
        icon: '🛒',
        description: 'Expert recommendations and guides to help you choose the perfect robot.'
      },
      'case-studies': {
        icon: '📊',
        description: 'Real-world applications and success stories featuring robotic systems.'
      },
    }
    return info[cat as keyof typeof info] || { icon: '🤖', description: 'Robotics content' }
  }

  const categoryInfo = getCategoryInfo(category)

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><a href="/blog" className="hover:text-blue-600">Blog</a></li>
            <li className="before:content-['/'] before:mx-2 text-gray-900 capitalize">{categoryName}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{categoryInfo.icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 capitalize">
            {categoryName}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {categoryInfo.description}
          </p>
        </div>

        {/* Posts */}
        {categoryPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryPosts.map(post => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No posts in this category yet
            </h3>
            <p className="text-gray-600 mb-6">
              Check back soon for new {categoryName} content!
            </p>
            <a
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Browse all posts
            </a>
          </div>
        )}

        {/* Other Categories */}
        <section className="mt-16 bg-gray-50 rounded-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Explore Other Categories
            </h2>
            <p className="text-lg text-gray-600">
              Discover more robotics content across our different categories.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories
              .filter(cat => cat !== category)
              .map((cat) => {
                const info = getCategoryInfo(cat)
                const postCount = posts.filter(p => p.published && p.category === cat).length
                return (
                  <a
                    key={cat}
                    href={`/blog/category/${cat}`}
                    className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow group"
                  >
                    <div className="text-2xl mb-2">{info.icon}</div>
                    <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 mb-1 capitalize">
                      {cat.replace('-', ' ')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {postCount} post{postCount !== 1 ? 's' : ''}
                    </div>
                  </a>
                )
              })}
          </div>
        </section>
      </div>
    </Layout>
  )
}
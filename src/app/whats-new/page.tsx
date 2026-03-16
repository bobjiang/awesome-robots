import { posts } from '#site/content'
import Layout from '@/components/Layout'
import Link from 'next/link'
import { Metadata } from 'next'
import { groupPostsByWeek } from '@/lib/whats-new'

export const metadata: Metadata = {
  title: 'What\'s New | Awesome Robots',
  description: 'Weekly updates from Awesome Robots — new articles, reviews, guides, and robotics news grouped by week.',
}

const CATEGORY_COLORS: Record<string, string> = {
  news: 'bg-blue-100 text-blue-800',
  reviews: 'bg-green-100 text-green-800',
  tutorials: 'bg-purple-100 text-purple-800',
  'buying-guides': 'bg-orange-100 text-orange-800',
  'case-studies': 'bg-pink-100 text-pink-800',
  digest: 'bg-yellow-100 text-yellow-800',
}

export default function WhatsNewPage() {
  const publishedPosts = posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const weeks = groupPostsByWeek(publishedPosts).slice(0, 12)

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What&apos;s New
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay up to date with our latest articles, reviews, and robotics news — organized by week.
          </p>
        </div>

        {/* Weekly groups */}
        {weeks.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No posts yet. Check back soon!</p>
        ) : (
          <div className="space-y-10">
            {weeks.map((week) => (
              <section key={week.weekLabel}>
                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                  {week.weekLabel}
                </h2>
                <ul className="space-y-3">
                  {week.posts.map((post) => {
                    const colorClass = CATEGORY_COLORS[post.category as string] || 'bg-gray-100 text-gray-800'
                    return (
                      <li key={post.slug as string} className="flex items-start gap-3">
                        <time
                          dateTime={post.date as string}
                          className="text-sm text-gray-400 whitespace-nowrap pt-0.5 min-w-[5rem]"
                        >
                          {new Date(post.date as string + 'T00:00:00Z').toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            timeZone: 'UTC',
                          })}
                        </time>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-gray-800 hover:text-blue-600 transition-colors font-medium"
                        >
                          {post.title as string}
                        </Link>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${colorClass}`}
                        >
                          {post.category as string}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}

        {/* View all link */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors"
          >
            View all articles &rarr;
          </Link>
        </div>
      </div>
    </Layout>
  )
}

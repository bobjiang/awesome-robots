import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '#site/content'

interface BlogCardProps {
  post: Post
}

export default function BlogCard({ post }: BlogCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      reviews: 'bg-blue-100 text-blue-800',
      tutorials: 'bg-green-100 text-green-800',
      news: 'bg-red-100 text-red-800',
      'buying-guides': 'bg-purple-100 text-purple-800',
      'case-studies': 'bg-yellow-100 text-yellow-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
      <Link href={post.permalink}>
        {post.image && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={post.image.src}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="p-6">
          {/* Category Badge */}
          <div className="mb-3">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
              {post.category.replace('-', ' ')}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>{formatDate(post.date)}</span>
              <span>•</span>
              <span>{post.readingTime} min read</span>
            </div>
            
            {post.featured && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                Featured
              </span>
            )}
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag}
                  className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </article>
  )
}
import Link from 'next/link'

export interface ReadNextPost {
  title: string
  slug: string
  category: string
  excerpt: string
  readingTime: number
}

interface ReadNextProps {
  posts: ReadNextPost[]
}

export default function ReadNext({ posts }: ReadNextProps) {
  if (posts.length === 0) return null

  const post = posts[0]

  return (
    <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
      <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">
        Read Next
      </p>
      <Link href={`/blog/${post.slug}`} className="group block">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
          {post.title}
        </h3>
        <p className="text-gray-600 line-clamp-2 mb-3">
          {post.excerpt}
        </p>
        <span className="text-blue-600 font-medium">
          Continue reading ({post.readingTime} min) →
        </span>
      </Link>
    </div>
  )
}

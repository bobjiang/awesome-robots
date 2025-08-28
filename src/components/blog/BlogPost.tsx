import Image from 'next/image'
import Link from 'next/link'
import type { Post, Author } from '#site/content'

interface BlogPostProps {
  post: Post
  author?: Author
}

export default function BlogPost({ post, author }: BlogPostProps) {
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
      'case-studies': 'bg-yellow-100 text-yellow-800',
      digest: 'bg-indigo-100 text-indigo-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/blog" className="hover:text-blue-600">Blog</Link></li>
            <li className="before:content-['/'] before:mx-2">
              <Link href={`/blog/category/${post.category}`} className="hover:text-blue-600">
                {post.category.replace('-', ' ')}
              </Link>
            </li>
            <li className="before:content-['/'] before:mx-2 text-gray-900">{post.title}</li>
          </ol>
        </nav>

        {/* Category Badge */}
        <div className="mb-4">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
            {post.category.replace('-', ' ')}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            {author && (
              <div className="flex items-center space-x-3">
                {author.avatar && (
                  <Image
                    src={author.avatar.src}
                    alt={author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900">{author.name}</p>
                  <p className="text-sm text-gray-500">{formatDate(post.date)}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{post.readingTime} min read</span>
            {post.featured && (
              <>
                <span>•</span>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                  Featured
                </span>
              </>
            )}
          </div>
        </div>

        {/* Featured Image */}
        {post.image && (
          <div className="relative h-64 md:h-96 mb-8 rounded-xl overflow-hidden">
            <Image
              src={post.image.src}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
      </header>

      {/* Content */}
      <div 
        className="prose prose-lg prose-gray max-w-none
                   prose-headings:text-gray-900 prose-headings:font-bold
                   prose-p:text-gray-700 prose-p:leading-relaxed
                   prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                   prose-strong:text-gray-900 prose-strong:font-semibold
                   prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                   prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:p-4
                   prose-ul:my-6 prose-ol:my-6
                   prose-li:my-2
                   prose-table:border-collapse prose-table:border prose-table:border-gray-300
                   prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:p-2
                   prose-td:border prose-td:border-gray-300 prose-td:p-2"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span 
                key={tag}
                className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Author Bio */}
      {author && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              {author.avatar && (
                <Image
                  src={author.avatar.src}
                  alt={author.name}
                  width={80}
                  height={80}
                  className="rounded-full flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">About {author.name}</h3>
                <p className="text-gray-600 mb-4">{author.bio}</p>
                
                {author.social && (
                  <div className="flex space-x-4">
                    {author.social.twitter && (
                      <a 
                        href={`https://twitter.com/${author.social.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Twitter
                      </a>
                    )}
                    {author.social.linkedin && (
                      <a 
                        href={`https://linkedin.com/in/${author.social.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        LinkedIn
                      </a>
                    )}
                    {author.social.github && (
                      <a 
                        href={`https://github.com/${author.social.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
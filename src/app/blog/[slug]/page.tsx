import { notFound } from 'next/navigation'
import { env } from "@/env.mjs";
import { posts, authors } from '#site/content'
import Layout from '@/components/Layout'
import BlogPost from '@/components/blog/BlogPost'
import BlogCard from '@/components/blog/BlogCard'
import Link from 'next/link'
import Script from 'next/script'
import { Metadata } from 'next'
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/structured-data'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = posts.find((post) => post.slug === slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
    keywords: post.seo?.keywords || post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [{ url: post.image.src }] : [],
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated || post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image.src] : [],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = posts.find((post) => post.slug === slug)

  if (!post || !post.published) {
    notFound()
  }

  const author = authors.find((author) => author.slug === post.author)
  const relatedPosts = posts
    .filter((p) => 
      p.published && 
      p.slug !== post.slug && 
      (p.category === post.category || p.tags.some(tag => post.tags.includes(tag)))
    )
    .slice(0, 3)

  // Generate structured data
  const baseUrl = env.NEXT_PUBLIC_BASE_URL;
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const wordCount = post.content ? post.content.split(/\s+/).length : 1000;
  
  const articleSchema = generateArticleSchema(
    post.title,
    post.excerpt,
    author?.name || post.author,
    post.date,
    post.updated || post.date,
    post.category,
    post.tags,
    wordCount,
    postUrl,
    baseUrl,
    author
  );

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.category, url: `/blog/category/${post.category}` },
    { name: post.title, url: `/blog/${post.slug}` }
  ], baseUrl);

  return (
    <Layout>
      {/* Structured Data */}
      <Script id="article-schema" type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </Script>
      <Script id="breadcrumb-schema" type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </Script>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BlogPost post={post} author={author} url={postUrl} />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map(relatedPost => (
                <BlogCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </section>
        )}

        {/* Back to Blog */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    </Layout>
  )
}
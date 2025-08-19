import { defineConfig, defineCollection, s } from 'velite'

const posts = defineCollection({
  name: 'Post',
  pattern: 'blog/**/*.md',
  schema: s
    .object({
      title: s.string(),
      slug: s.slug('title'),
      date: s.isodate(),
      updated: s.isodate().optional(),
      author: s.string(),
      category: s.enum(['reviews', 'tutorials', 'news', 'buying-guides', 'case-studies']),
      tags: s.array(s.string()),
      excerpt: s.string(),
      featured: s.boolean().default(false),
      published: s.boolean().default(true),
      image: s.image().optional(),
      seo: s.object({
        title: s.string().optional(),
        description: s.string().optional(),
        keywords: s.array(s.string()).optional(),
      }).optional(),
      content: s.markdown(),
    })
    .transform(data => ({ 
      ...data, 
      permalink: `/blog/${data.slug}`,
      readingTime: Math.ceil(data.content.split(' ').length / 200),
    }))
})

const authors = defineCollection({
  name: 'Author',
  pattern: 'authors/*.md',
  schema: s.object({
    name: s.string(),
    slug: s.slug('name'),
    bio: s.string(),
    avatar: s.image().optional(),
    social: s.object({
      twitter: s.string().optional(),
      linkedin: s.string().optional(),
      github: s.string().optional(),
    }).optional(),
    content: s.markdown(),
  })
})

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true
  },
  collections: { posts, authors },
  mdx: {
    rehypePlugins: [],
    remarkPlugins: [],
  }
})
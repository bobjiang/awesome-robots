import { MetadataRoute } from 'next'
import robotsData from '@/data/robots.json'
import brandsData from '@/data/brands.json'
import categoriesData from '@/data/categories.json'
import { posts } from '../../.velite'
import { env } from '@/env.mjs'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.NEXT_PUBLIC_BASE_URL
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  // Generate category pages dynamically
  const categoryPages: MetadataRoute.Sitemap = categoriesData.map((category) => ({
    url: `${baseUrl}/categories/${category.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: category.id === 'humanoid' || category.id === 'quadruped' ? 0.8 : 0.7,
  }))

  // Generate brand pages dynamically
  const brandPages: MetadataRoute.Sitemap = brandsData.map((brand) => ({
    url: `${baseUrl}/brands/${brand.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Generate robot product pages
  const robotPages: MetadataRoute.Sitemap = robotsData.map((robot) => ({
    url: `${baseUrl}/robots/${robot.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Generate blog post pages
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Generate blog category pages
  const blogCategories = Array.from(new Set(posts.map(post => post.category)))
  const blogCategoryPages: MetadataRoute.Sitemap = blogCategories.map((category) => ({
    url: `${baseUrl}/blog/category/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...categoryPages, ...brandPages, ...robotPages, ...blogPages, ...blogCategoryPages]
}
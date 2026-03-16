import { posts } from '#site/content'
import { env } from '@/env.mjs'
import { generateRSSFeed } from '@/lib/rss'

export function GET() {
  const xml = generateRSSFeed(posts, env.NEXT_PUBLIC_BASE_URL)

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

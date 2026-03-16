import { describe, it, expect } from 'vitest'
import { generateRSSFeed } from '@/lib/rss'

interface MockPost {
  title: string
  slug: string
  date: string
  excerpt: string
  category: string
  tags: string[]
  author: string
  published: boolean
  permalink: string
  readingTime: number
  content: string
}

function createMockPost(overrides: Partial<MockPost> = {}): MockPost {
  return {
    title: 'Test Post',
    slug: 'test-post',
    date: '2026-01-15',
    excerpt: 'A test excerpt for the post.',
    category: 'news',
    tags: ['robots', 'ai'],
    author: 'bob-jiang',
    published: true,
    permalink: '/blog/test-post',
    readingTime: 5,
    content: 'Full content here.',
    ...overrides,
  }
}

const BASE_URL = 'https://www.awesomerobots.xyz'

describe('generateRSSFeed', () => {
  it('returns valid RSS 2.0 XML with correct channel elements', () => {
    const posts = [createMockPost()]
    const xml = generateRSSFeed(posts, BASE_URL)

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain('<rss version="2.0"')
    expect(xml).toContain('xmlns:atom="http://www.w3.org/2005/Atom"')
    expect(xml).toContain('<title>Awesome Robots Blog</title>')
    expect(xml).toContain(`<link>${BASE_URL}/blog</link>`)
    expect(xml).toContain('<language>en-us</language>')
    expect(xml).toContain('<lastBuildDate>')
    expect(xml).toContain('<atom:link href="' + BASE_URL + '/blog/rss.xml"')
    expect(xml).toContain('rel="self"')
    expect(xml).toContain('type="application/rss+xml"')
  })

  it('generates correct item elements for a post', () => {
    const post = createMockPost({
      title: 'My Robot Review',
      slug: 'my-robot-review',
      date: '2026-02-20',
      excerpt: 'Reviewing a cool robot.',
      category: 'reviews',
    })
    const xml = generateRSSFeed([post], BASE_URL)

    expect(xml).toContain('<title>My Robot Review</title>')
    expect(xml).toContain(`<link>${BASE_URL}/blog/my-robot-review</link>`)
    expect(xml).toContain(`<guid>${BASE_URL}/blog/my-robot-review</guid>`)
    expect(xml).toContain('<description>Reviewing a cool robot.</description>')
    expect(xml).toContain('<category>reviews</category>')
    // pubDate should be a UTC date string
    expect(xml).toMatch(/<pubDate>.*2026.*<\/pubDate>/)
  })

  it('filters out unpublished posts', () => {
    const posts = [
      createMockPost({ title: 'Published Post', slug: 'published', published: true }),
      createMockPost({ title: 'Draft Post', slug: 'draft', published: false }),
    ]
    const xml = generateRSSFeed(posts, BASE_URL)

    expect(xml).toContain('Published Post')
    expect(xml).not.toContain('Draft Post')
  })

  it('sorts posts by date descending (newest first)', () => {
    const posts = [
      createMockPost({ title: 'Old Post', slug: 'old', date: '2025-01-01' }),
      createMockPost({ title: 'New Post', slug: 'new', date: '2026-03-01' }),
      createMockPost({ title: 'Mid Post', slug: 'mid', date: '2025-06-15' }),
    ]
    const xml = generateRSSFeed(posts, BASE_URL)

    const newIdx = xml.indexOf('New Post')
    const midIdx = xml.indexOf('Mid Post')
    const oldIdx = xml.indexOf('Old Post')
    expect(newIdx).toBeLessThan(midIdx)
    expect(midIdx).toBeLessThan(oldIdx)
  })

  it('limits output to 50 items', () => {
    const posts = Array.from({ length: 60 }, (_, i) =>
      createMockPost({ title: `Post ${i}`, slug: `post-${i}`, date: `2026-01-${String(i + 1).padStart(2, '0')}` })
    )
    // Only first 31 have valid dates (Jan has 31 days), but let's just count <item> tags
    const xml = generateRSSFeed(posts, BASE_URL)

    const itemCount = (xml.match(/<item>/g) || []).length
    expect(itemCount).toBeLessThanOrEqual(50)
  })

  it('escapes XML special characters in title and excerpt', () => {
    const post = createMockPost({
      title: 'Robots & AI: The "Future" of <Automation>',
      slug: 'robots-ai',
      excerpt: "It's a brave new world with <robots> & 'automation'",
    })
    const xml = generateRSSFeed([post], BASE_URL)

    // Should not contain unescaped special chars within XML elements
    expect(xml).not.toContain('<title>Robots & AI')
    expect(xml).toContain('&amp;')
    expect(xml).toContain('&lt;')
    expect(xml).toContain('&gt;')
    expect(xml).toContain('&quot;')
    expect(xml).toContain('&apos;')
  })

  it('returns valid XML with no posts', () => {
    const xml = generateRSSFeed([], BASE_URL)

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain('<channel>')
    expect(xml).toContain('</channel>')
    expect(xml).not.toContain('<item>')
  })
})

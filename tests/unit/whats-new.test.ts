import { describe, it, expect } from 'vitest'
import { groupPostsByWeek, WeekGroup } from '@/lib/whats-new'

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
    date: '2026-03-11',
    excerpt: 'A test excerpt.',
    category: 'news',
    tags: ['robots'],
    author: 'bob-jiang',
    published: true,
    permalink: '/blog/test-post',
    readingTime: 3,
    content: 'Content here.',
    ...overrides,
  }
}

describe('groupPostsByWeek', () => {
  it('returns empty array for empty input', () => {
    const result = groupPostsByWeek([])
    expect(result).toEqual([])
  })

  it('groups posts into correct ISO weeks (Monday start)', () => {
    // 2026-03-09 is a Monday, 2026-03-15 is Sunday — same ISO week
    const posts = [
      createMockPost({ title: 'Monday Post', slug: 'mon', date: '2026-03-09' }),
      createMockPost({ title: 'Friday Post', slug: 'fri', date: '2026-03-13' }),
      createMockPost({ title: 'Sunday Post', slug: 'sun', date: '2026-03-15' }),
    ]
    const result = groupPostsByWeek(posts)

    expect(result).toHaveLength(1)
    expect(result[0].posts).toHaveLength(3)
    expect(result[0].weekLabel).toBe('Mar 9 – Mar 15, 2026')
  })

  it('puts posts from different weeks into separate groups', () => {
    const posts = [
      createMockPost({ title: 'Week 11', slug: 'w11', date: '2026-03-09' }), // Mon Mar 9
      createMockPost({ title: 'Week 12', slug: 'w12', date: '2026-03-16' }), // Mon Mar 16
    ]
    const result = groupPostsByWeek(posts)

    expect(result).toHaveLength(2)
  })

  it('sorts weeks descending (newest first)', () => {
    const posts = [
      createMockPost({ title: 'Old', slug: 'old', date: '2026-02-02' }),
      createMockPost({ title: 'New', slug: 'new', date: '2026-03-11' }),
      createMockPost({ title: 'Mid', slug: 'mid', date: '2026-02-16' }),
    ]
    const result = groupPostsByWeek(posts)

    expect(result.length).toBeGreaterThanOrEqual(3)
    // First group should contain the newest post
    expect(result[0].posts[0].title).toBe('New')
    // Last group should contain the oldest post
    expect(result[result.length - 1].posts[0].title).toBe('Old')
  })

  it('sorts posts within a week by date descending', () => {
    const posts = [
      createMockPost({ title: 'Early', slug: 'early', date: '2026-03-09' }),
      createMockPost({ title: 'Late', slug: 'late', date: '2026-03-13' }),
      createMockPost({ title: 'Mid', slug: 'mid', date: '2026-03-11' }),
    ]
    const result = groupPostsByWeek(posts)

    expect(result).toHaveLength(1)
    expect(result[0].posts[0].title).toBe('Late')
    expect(result[0].posts[1].title).toBe('Mid')
    expect(result[0].posts[2].title).toBe('Early')
  })

  it('generates correct weekLabel format across month boundary', () => {
    // 2026-02-23 is Monday, 2026-03-01 is Sunday
    const posts = [
      createMockPost({ title: 'Cross Month', slug: 'cross', date: '2026-02-25' }),
    ]
    const result = groupPostsByWeek(posts)

    expect(result[0].weekLabel).toBe('Feb 23 – Mar 1, 2026')
  })

  it('generates correct weekLabel for year-crossing week', () => {
    // 2025-12-29 is Monday, 2026-01-04 is Sunday — ISO week 1 of 2026
    const posts = [
      createMockPost({ title: 'New Year', slug: 'ny', date: '2025-12-31' }),
    ]
    const result = groupPostsByWeek(posts)

    expect(result[0].weekLabel).toBe('Dec 29 – Jan 4, 2026')
  })
})

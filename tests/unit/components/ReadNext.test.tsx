/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import ReadNext, { ReadNextPost } from '@/components/blog/ReadNext'

const mockPost: ReadNextPost = {
  title: 'Getting Started with Humanoid Robots',
  slug: 'getting-started-humanoid-robots',
  category: 'tutorials',
  excerpt: 'A comprehensive guide to choosing and setting up your first humanoid robot for home or business use.',
  readingTime: 8,
}

describe('ReadNext', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders CTA with first post title and excerpt', () => {
    render(<ReadNext posts={[mockPost]} />)

    expect(screen.getByText('Read Next')).toBeInTheDocument()
    expect(screen.getByText(mockPost.title)).toBeInTheDocument()
    expect(screen.getByText(mockPost.excerpt)).toBeInTheDocument()
    expect(screen.getByText('Continue reading (8 min) →')).toBeInTheDocument()
  })

  it('returns nothing when posts is empty', () => {
    const { container } = render(<ReadNext posts={[]} />)

    expect(container.innerHTML).toBe('')
  })

  it('links to the correct blog post URL', () => {
    render(<ReadNext posts={[mockPost]} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', `/blog/${mockPost.slug}`)
  })

  it('only shows the first post even when multiple are provided', () => {
    const secondPost: ReadNextPost = {
      title: 'Advanced Robot Programming',
      slug: 'advanced-robot-programming',
      category: 'tutorials',
      excerpt: 'Take your robot skills to the next level.',
      readingTime: 12,
    }

    render(<ReadNext posts={[mockPost, secondPost]} />)

    expect(screen.getByText(mockPost.title)).toBeInTheDocument()
    expect(screen.queryByText(secondPost.title)).not.toBeInTheDocument()
  })
})

/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

vi.mock('#site/content', () => ({
  posts: [
    {
      title: 'Getting Started with Humanoid Robots',
      slug: 'getting-started-humanoid-robots',
      excerpt: 'A guide to humanoid robots for beginners.',
      category: 'tutorials',
      tags: ['humanoid', 'beginner'],
      published: true,
    },
    {
      title: 'Best Quadruped Robots of 2025',
      slug: 'best-quadruped-robots-2025',
      excerpt: 'Top picks for quadruped robots this year.',
      category: 'buying-guides',
      tags: ['quadruped', 'buying-guide'],
      published: true,
    },
    {
      title: 'Draft Post Not Published',
      slug: 'draft-post',
      excerpt: 'This post is not published yet.',
      category: 'news',
      tags: ['draft'],
      published: false,
    },
  ],
}))

// Must import after vi.mock
import SearchDialog from '@/components/SearchDialog'

describe('SearchDialog', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders search input when open', () => {
    render(<SearchDialog isOpen={true} onClose={() => {}} />)

    expect(screen.getByPlaceholderText('Search blog posts...')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    const { container } = render(<SearchDialog isOpen={false} onClose={() => {}} />)

    expect(container.innerHTML).toBe('')
  })

  it('filters posts by title', () => {
    render(<SearchDialog isOpen={true} onClose={() => {}} />)

    const input = screen.getByPlaceholderText('Search blog posts...')
    fireEvent.change(input, { target: { value: 'humanoid' } })

    expect(screen.getByText('Getting Started with Humanoid Robots')).toBeInTheDocument()
    expect(screen.queryByText('Best Quadruped Robots of 2025')).not.toBeInTheDocument()
  })

  it('excludes unpublished posts', () => {
    render(<SearchDialog isOpen={true} onClose={() => {}} />)

    const input = screen.getByPlaceholderText('Search blog posts...')
    fireEvent.change(input, { target: { value: 'draft' } })

    expect(screen.queryByText('Draft Post Not Published')).not.toBeInTheDocument()
  })

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn()
    render(<SearchDialog isOpen={true} onClose={onClose} />)

    const closeButton = screen.getByLabelText('Close search')
    fireEvent.click(closeButton)

    expect(onClose).toHaveBeenCalledOnce()
  })
})

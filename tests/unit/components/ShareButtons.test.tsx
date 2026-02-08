/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import ShareButtons from '@/components/blog/ShareButtons'

const defaultProps = {
  title: 'Test Blog Post Title',
  url: 'https://www.awesomerobots.xyz/blog/test-post',
  excerpt: 'This is a test excerpt for the blog post.',
}

describe('ShareButtons', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('renders all five share buttons', () => {
    render(<ShareButtons {...defaultProps} />)

    expect(screen.getByText('Twitter')).toBeInTheDocument()
    expect(screen.getByText('Facebook')).toBeInTheDocument()
    expect(screen.getByText('LinkedIn')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Copy Link')).toBeInTheDocument()
  })

  it('renders Twitter link with correct href', () => {
    render(<ShareButtons {...defaultProps} />)

    const twitterLink = screen.getByText('Twitter').closest('a')
    expect(twitterLink).toHaveAttribute(
      'href',
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(defaultProps.title)}&url=${encodeURIComponent(defaultProps.url)}`
    )
    expect(twitterLink).toHaveAttribute('target', '_blank')
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders Facebook link with correct href', () => {
    render(<ShareButtons {...defaultProps} />)

    const facebookLink = screen.getByText('Facebook').closest('a')
    expect(facebookLink).toHaveAttribute(
      'href',
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(defaultProps.url)}`
    )
    expect(facebookLink).toHaveAttribute('target', '_blank')
  })

  it('renders LinkedIn link with correct href', () => {
    render(<ShareButtons {...defaultProps} />)

    const linkedinLink = screen.getByText('LinkedIn').closest('a')
    expect(linkedinLink).toHaveAttribute(
      'href',
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(defaultProps.url)}`
    )
    expect(linkedinLink).toHaveAttribute('target', '_blank')
  })

  it('renders Email link with correct mailto href', () => {
    render(<ShareButtons {...defaultProps} />)

    const emailLink = screen.getByText('Email').closest('a')
    const expectedBody = encodeURIComponent(`${defaultProps.excerpt}\n\n${defaultProps.url}`)
    expect(emailLink).toHaveAttribute(
      'href',
      `mailto:?subject=${encodeURIComponent(defaultProps.title)}&body=${expectedBody}`
    )
  })

  it('copies URL to clipboard and shows "Copied!" feedback', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    })

    render(<ShareButtons {...defaultProps} />)

    const copyButton = screen.getByText('Copy Link').closest('button')!
    await user.click(copyButton)

    expect(writeText).toHaveBeenCalledWith(defaultProps.url)
    expect(screen.getByText('Copied!')).toBeInTheDocument()
  })

  it('resets "Copied!" text back to "Copy Link" after 2 seconds', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    })

    render(<ShareButtons {...defaultProps} />)

    const copyButton = screen.getByText('Copy Link').closest('button')!
    await userEvent.click(copyButton)

    expect(screen.getByText('Copied!')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Copy Link')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('encodes special characters in title and excerpt', () => {
    const specialProps = {
      title: "NASA's Mars Rover & AI",
      url: 'https://www.awesomerobots.xyz/blog/nasa-mars',
      excerpt: 'Testing "quotes" & <special> chars',
    }

    render(<ShareButtons {...specialProps} />)

    const twitterLink = screen.getByText('Twitter').closest('a')
    expect(twitterLink?.getAttribute('href')).toContain(encodeURIComponent(specialProps.title))
    expect(twitterLink?.getAttribute('href')).toContain(encodeURIComponent(specialProps.url))
  })

  it('renders all links as pill-shaped buttons with consistent styling', () => {
    render(<ShareButtons {...defaultProps} />)

    const links = screen.getAllByRole('link')
    links.forEach((link) => {
      expect(link.className).toContain('rounded-full')
      expect(link.className).toContain('bg-gray-100')
    })

    const copyButton = screen.getByText('Copy Link').closest('button')!
    expect(copyButton.className).toContain('rounded-full')
    expect(copyButton.className).toContain('bg-gray-100')
  })
})

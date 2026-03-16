/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import TableOfContents from '@/components/blog/TableOfContents'

describe('TableOfContents', () => {
  afterEach(() => {
    cleanup()
  })

  it('extracts h2 headings from HTML', () => {
    const content = `
      <h2>Getting Started</h2>
      <p>Some text</p>
      <h2>Advanced Usage</h2>
      <p>More text</p>
      <h2>Conclusion</h2>
    `
    render(<TableOfContents content={content} />)

    expect(screen.getByText('Getting Started')).toBeInTheDocument()
    expect(screen.getByText('Advanced Usage')).toBeInTheDocument()
    expect(screen.getByText('Conclusion')).toBeInTheDocument()
  })

  it('renders nothing with fewer than 2 headings', () => {
    const content = `
      <h2>Only One Heading</h2>
      <p>Some text</p>
    `
    const { container } = render(<TableOfContents content={content} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders nothing with zero headings', () => {
    const content = '<p>No headings here</p>'
    const { container } = render(<TableOfContents content={content} />)
    expect(container.innerHTML).toBe('')
  })

  it('generates correct anchor links from heading text', () => {
    const content = `
      <h2>Getting Started</h2>
      <h2>Advanced Usage & Tips</h2>
    `
    render(<TableOfContents content={content} />)

    const link1 = screen.getByText('Getting Started').closest('a')
    const link2 = screen.getByText('Advanced Usage & Tips').closest('a')

    expect(link1).toHaveAttribute('href', '#getting-started')
    expect(link2).toHaveAttribute('href', '#advanced-usage-tips')
  })

  it('renders "In this article" title', () => {
    const content = `
      <h2>First Heading</h2>
      <h2>Second Heading</h2>
    `
    render(<TableOfContents content={content} />)

    expect(screen.getByText('In this article')).toBeInTheDocument()
  })

  it('strips inner HTML tags from heading text', () => {
    const content = `
      <h2><strong>Bold</strong> Heading</h2>
      <h2>Normal <em>Italic</em> Heading</h2>
    `
    render(<TableOfContents content={content} />)

    expect(screen.getByText('Bold Heading')).toBeInTheDocument()
    expect(screen.getByText('Normal Italic Heading')).toBeInTheDocument()
  })

  it('renders numbered links', () => {
    const content = `
      <h2>First</h2>
      <h2>Second</h2>
      <h2>Third</h2>
    `
    render(<TableOfContents content={content} />)

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})

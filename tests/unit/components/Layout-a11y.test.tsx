/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

// Mock next/script
vi.mock('next/script', () => ({
  default: () => null,
}))

// Mock NewsletterSignup to avoid iframe issues in jsdom
vi.mock('@/components/NewsletterSignup', () => ({
  default: () => <div data-testid="newsletter-mock">Newsletter</div>,
}))

import Layout from '@/components/Layout'

describe('Layout - A11Y-002: Hamburger button accessible name', () => {
  afterEach(() => {
    cleanup()
  })

  it('hamburger button has aria-label', () => {
    render(<Layout><div>Content</div></Layout>)

    // Find the mobile menu button (md:hidden)
    const buttons = screen.getAllByRole('button')
    const hamburgerButton = buttons.find(
      (btn) => btn.closest('.md\\:hidden') !== null
    )

    expect(hamburgerButton).toBeDefined()
    expect(hamburgerButton).toHaveAttribute('aria-label')
    expect(hamburgerButton?.getAttribute('aria-label')).toMatch(/menu/i)
  })

  it('hamburger button has aria-expanded="false" initially', () => {
    render(<Layout><div>Content</div></Layout>)

    const buttons = screen.getAllByRole('button')
    const hamburgerButton = buttons.find(
      (btn) => btn.closest('.md\\:hidden') !== null
    )

    expect(hamburgerButton).toBeDefined()
    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('hamburger button aria-expanded changes to "true" when clicked', async () => {
    const user = userEvent.setup()
    render(<Layout><div>Content</div></Layout>)

    const buttons = screen.getAllByRole('button')
    const hamburgerButton = buttons.find(
      (btn) => btn.closest('.md\\:hidden') !== null
    )

    expect(hamburgerButton).toBeDefined()
    await user.click(hamburgerButton!)

    expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('hamburger button has aria-controls pointing to mobile nav', () => {
    render(<Layout><div>Content</div></Layout>)

    const buttons = screen.getAllByRole('button')
    const hamburgerButton = buttons.find(
      (btn) => btn.closest('.md\\:hidden') !== null
    )

    expect(hamburgerButton).toBeDefined()
    expect(hamburgerButton).toHaveAttribute('aria-controls', 'mobile-navigation')
  })

  it('hamburger SVG icon has aria-hidden="true"', () => {
    render(<Layout><div>Content</div></Layout>)

    const buttons = screen.getAllByRole('button')
    const hamburgerButton = buttons.find(
      (btn) => btn.closest('.md\\:hidden') !== null
    )

    expect(hamburgerButton).toBeDefined()
    const svg = hamburgerButton?.querySelector('svg')
    expect(svg).toBeDefined()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })
})

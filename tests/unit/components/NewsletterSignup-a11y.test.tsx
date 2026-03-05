/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Mock next/script to avoid side effects
vi.mock('next/script', () => ({
  default: () => null,
}))

import NewsletterSignup from '@/components/NewsletterSignup'

describe('NewsletterSignup - A11Y-007: iframe has title attribute', () => {
  afterEach(() => {
    cleanup()
  })

  it('iframe has a title attribute for screen readers', () => {
    const { container } = render(<NewsletterSignup />)

    const iframe = container.querySelector('iframe')
    expect(iframe).toBeDefined()
    expect(iframe).toHaveAttribute('title')
    expect(iframe?.getAttribute('title')).toBeTruthy()
  })

  it('iframe title describes the purpose of the embedded content', () => {
    const { container } = render(<NewsletterSignup />)

    const iframe = container.querySelector('iframe')
    expect(iframe?.getAttribute('title')).toMatch(/newsletter/i)
  })
})

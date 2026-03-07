/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Mock the validation module
vi.mock('@/lib/validations/quote', () => ({
  validateQuoteForm: vi.fn(() => ({
    success: true,
    data: {},
  })),
}))

import QuoteForm from '@/components/QuoteForm'

const defaultProps = {
  robotName: 'Go2',
  robotBrand: 'Unitree',
  onClose: vi.fn(),
}

describe('QuoteForm - A11Y-006: Close button accessible name', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('close button has aria-label="Close quote form"', () => {
    render(<QuoteForm {...defaultProps} />)

    const closeButton = screen.getByRole('button', { name: /close quote form/i })
    expect(closeButton).toBeInTheDocument()
    expect(closeButton).toHaveAttribute('aria-label', 'Close quote form')
  })

  it('close button SVG has aria-hidden="true"', () => {
    render(<QuoteForm {...defaultProps} />)

    const closeButton = screen.getByRole('button', { name: /close quote form/i })
    const svg = closeButton.querySelector('svg')
    expect(svg).toBeDefined()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })
})

describe('QuoteForm - A11Y-001: Modal dialog semantics', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('modal has role="dialog"', () => {
    render(<QuoteForm {...defaultProps} />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
  })

  it('modal has aria-modal="true"', () => {
    render(<QuoteForm {...defaultProps} />)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('modal has aria-labelledby pointing to the title', () => {
    render(<QuoteForm {...defaultProps} />)

    const dialog = screen.getByRole('dialog')
    const labelledBy = dialog.getAttribute('aria-labelledby')
    expect(labelledBy).toBeTruthy()

    // The referenced element should exist and contain the title text
    const titleElement = document.getElementById(labelledBy!)
    expect(titleElement).toBeDefined()
    expect(titleElement?.textContent).toMatch(/request quote/i)
  })

  it('Escape key calls onClose', async () => {
    const onClose = vi.fn()
    render(<QuoteForm {...defaultProps} onClose={onClose} />)

    // Simulate Escape key press
    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    })
    document.dispatchEvent(event)

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

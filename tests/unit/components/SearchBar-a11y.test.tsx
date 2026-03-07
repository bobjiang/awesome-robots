/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

import SearchBar from '@/components/SearchBar'

describe('SearchBar - A11Y-003: Accessible label and role', () => {
  afterEach(() => {
    cleanup()
  })

  it('form element has role="search"', () => {
    render(<SearchBar onSearch={vi.fn()} />)

    const form = screen.getByRole('search')
    expect(form).toBeInTheDocument()
  })

  it('input has aria-label for screen readers', () => {
    render(<SearchBar onSearch={vi.fn()} />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-label')
    expect(input.getAttribute('aria-label')).toBeTruthy()
  })

  it('search icon SVG has aria-hidden="true"', () => {
    const { container } = render(<SearchBar onSearch={vi.fn()} />)

    const svg = container.querySelector('svg')
    expect(svg).toBeDefined()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })
})

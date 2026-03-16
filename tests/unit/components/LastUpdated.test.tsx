/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import LastUpdated from '@/components/LastUpdated'

describe('LastUpdated', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders formatted date with default label', () => {
    render(<LastUpdated date="2026-03-15" />)

    expect(screen.getByText(/Last verified/)).toBeInTheDocument()
    expect(screen.getByText(/Mar 15, 2026/)).toBeInTheDocument()
  })

  it('renders with custom label', () => {
    render(<LastUpdated date="2026-01-10" label="Last updated" />)

    expect(screen.getByText(/Last updated/)).toBeInTheDocument()
    expect(screen.getByText(/Jan 10, 2026/)).toBeInTheDocument()
  })
})

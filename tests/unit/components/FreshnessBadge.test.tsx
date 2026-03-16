/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import FreshnessBadge from '@/components/blog/FreshnessBadge'

describe('FreshnessBadge', () => {
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('shows "Updated" badge with formatted date when updated differs from date', () => {
    const { container } = render(
      <FreshnessBadge date="2025-01-15" updated="2025-06-20" />
    )

    const badge = screen.getByText(/Updated/)
    expect(badge).toBeInTheDocument()
    expect(badge.textContent).toContain('Jun 2025')
    expect(badge.className).toContain('bg-green-100')
    expect(badge.className).toContain('text-green-800')
  })

  it('does NOT show badge when updated equals date', () => {
    const { container } = render(
      <FreshnessBadge date="2025-01-15" updated="2025-01-15" />
    )

    expect(container.innerHTML).toBe('')
  })

  it('does NOT show badge when no updated date and post is not new', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-16'))

    const { container } = render(
      <FreshnessBadge date="2025-01-15" />
    )

    expect(container.innerHTML).toBe('')
  })

  it('shows "New" badge for posts within last 7 days', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-16'))

    render(<FreshnessBadge date="2026-03-12" />)

    const badge = screen.getByText('New')
    expect(badge).toBeInTheDocument()
    expect(badge.className).toContain('bg-blue-100')
    expect(badge.className).toContain('text-blue-800')
  })

  it('does NOT show "New" badge for posts older than 7 days', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-16'))

    const { container } = render(
      <FreshnessBadge date="2026-03-01" />
    )

    expect(container.innerHTML).toBe('')
  })

  it('prefers "Updated" badge over "New" badge when both apply', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-16'))

    render(
      <FreshnessBadge date="2026-03-12" updated="2026-03-14" />
    )

    const badge = screen.getByText(/Updated/)
    expect(badge).toBeInTheDocument()
    expect(screen.queryByText('New')).not.toBeInTheDocument()
  })
})

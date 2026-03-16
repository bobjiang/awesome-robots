/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'

describe('PWAInstallPrompt', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('renders nothing by default when no beforeinstallprompt event is fired', () => {
    const { container } = render(<PWAInstallPrompt />)
    expect(container.innerHTML).toBe('')
  })

  it('shows install card when beforeinstallprompt event fires', () => {
    render(<PWAInstallPrompt />)

    act(() => {
      const event = new Event('beforeinstallprompt')
      Object.defineProperty(event, 'preventDefault', { value: vi.fn() })
      window.dispatchEvent(event)
    })

    expect(screen.getByText('Install')).toBeInTheDocument()
    expect(screen.getByText('Not now')).toBeInTheDocument()
  })

  it('hides the prompt when "Not now" is clicked', async () => {
    const user = userEvent.setup()
    render(<PWAInstallPrompt />)

    act(() => {
      const event = new Event('beforeinstallprompt')
      Object.defineProperty(event, 'preventDefault', { value: vi.fn() })
      window.dispatchEvent(event)
    })

    const dismissButton = screen.getByText('Not now')
    await user.click(dismissButton)

    expect(screen.queryByText('Install')).not.toBeInTheDocument()
  })

  it('calls prompt() on the deferred event when "Install" is clicked', async () => {
    const user = userEvent.setup()
    render(<PWAInstallPrompt />)

    const mockPrompt = vi.fn().mockResolvedValue({ outcome: 'accepted' })

    act(() => {
      const event = new Event('beforeinstallprompt') as Event & { prompt: () => Promise<unknown> }
      Object.defineProperty(event, 'preventDefault', { value: vi.fn() })
      Object.defineProperty(event, 'prompt', { value: mockPrompt })
      window.dispatchEvent(event)
    })

    const installButton = screen.getByText('Install')
    await user.click(installButton)

    expect(mockPrompt).toHaveBeenCalled()
  })
})

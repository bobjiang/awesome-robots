/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ alt, ...props }: { alt: string; [key: string]: unknown }) => (
    <img alt={alt} {...props} />
  ),
}))

// Mock gtag
vi.mock('@/lib/gtag', () => ({
  trackRobotView: vi.fn(),
  trackCategoryView: vi.fn(),
}))

// Mock image-utils
vi.mock('@/utils/image-utils', () => ({
  getFirstImage: vi.fn(() => '/test-image.png'),
}))

// Mock robot-utils
vi.mock('@/utils/robot-utils', () => ({
  formatRobotWeight: vi.fn(() => '15 kg'),
  formatRobotBattery: vi.fn(() => '2 hours'),
}))

// Mock price-utils
vi.mock('@/utils/price-utils', () => ({
  formatPrice: vi.fn((price: number) => `$${price.toLocaleString()}`),
}))

import CategoryBrowser from '@/components/CategoryBrowser'
import BrandBrowser from '@/components/BrandBrowser'

const mockRobot = {
  id: 'test-robot',
  name: 'Test Bot',
  brand: 'TestBrand',
  category: 'humanoid' as const,
  price: { starting: 5000, currency: 'USD', models: [] },
  specifications: {},
  features: ['Walking'],
  images: ['/test.png'],
  officialUrl: null,
  description: 'A test robot',
}

describe('A11Y-004: Sort dropdowns have programmatic label association', () => {
  afterEach(() => {
    cleanup()
  })

  describe('CategoryBrowser sort dropdown', () => {
    it('select element has an id attribute', () => {
      const { container } = render(
        <CategoryBrowser
          robots={[mockRobot]}
          categoryId="humanoid"
          categoryName="Humanoid Robots"
          availableBrands={['TestBrand']}
        />
      )

      const select = container.querySelector('select')
      expect(select).toBeDefined()
      expect(select).toHaveAttribute('id')
    })

    it('label has htmlFor matching the select id', () => {
      const { container } = render(
        <CategoryBrowser
          robots={[mockRobot]}
          categoryId="humanoid"
          categoryName="Humanoid Robots"
          availableBrands={['TestBrand']}
        />
      )

      const select = container.querySelector('select')
      const selectId = select?.getAttribute('id')
      expect(selectId).toBeTruthy()

      const labels = container.querySelectorAll('label')
      const sortLabel = Array.from(labels).find(
        (label) => label.textContent?.includes('Sort')
      )
      expect(sortLabel).toBeDefined()
      expect(sortLabel).toHaveAttribute('for', selectId)
    })
  })

  describe('BrandBrowser sort dropdown', () => {
    it('select element has an id attribute', () => {
      const { container } = render(
        <BrandBrowser
          robots={[mockRobot]}
          brandName="TestBrand"
        />
      )

      const select = container.querySelector('select')
      expect(select).toBeDefined()
      expect(select).toHaveAttribute('id')
    })

    it('label has htmlFor matching the select id', () => {
      const { container } = render(
        <BrandBrowser
          robots={[mockRobot]}
          brandName="TestBrand"
        />
      )

      const select = container.querySelector('select')
      const selectId = select?.getAttribute('id')
      expect(selectId).toBeTruthy()

      const labels = container.querySelectorAll('label')
      const sortLabel = Array.from(labels).find(
        (label) => label.textContent?.includes('Sort')
      )
      expect(sortLabel).toBeDefined()
      expect(sortLabel).toHaveAttribute('for', selectId)
    })
  })
})

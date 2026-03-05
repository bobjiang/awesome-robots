import { describe, it, expect } from 'vitest'
import { generateProductSchema } from '@/lib/structured-data'
import type { Robot } from '@/types/robot'

const mockRobot: Robot = {
  id: 'test-robot-1',
  name: 'TestBot',
  brand: 'TestBrand',
  category: 'humanoid',
  price: {
    starting: 5000,
    currency: 'USD',
    models: [{ name: 'Standard', price: 5000 }],
  },
  specifications: {
    weight: '15 kg',
    dimensions: '1.2m x 0.5m x 0.3m',
  },
  features: ['Walking', 'Object recognition'],
  images: ['/images/test-robot.png'],
  officialUrl: 'https://example.com',
  description: 'A test humanoid robot for unit testing.',
}

const baseUrl = 'https://www.awesomerobots.xyz'

describe('SEO-001: generateProductSchema should NOT include fabricated ratings', () => {
  it('should NOT include aggregateRating in product schema', () => {
    const result = generateProductSchema(mockRobot, baseUrl)
    expect(result).not.toHaveProperty('aggregateRating')
  })

  it('should NOT include review in product schema', () => {
    const result = generateProductSchema(mockRobot, baseUrl)
    expect(result).not.toHaveProperty('review')
  })

  it('should still include core Product schema fields', () => {
    const result = generateProductSchema(mockRobot, baseUrl)
    expect(result['@type']).toBe('Product')
    expect(result.name).toBe('TestBrand TestBot')
    expect(result.brand).toEqual({ '@type': 'Brand', name: 'TestBrand' })
    expect(result.url).toBe(`${baseUrl}/robots/test-robot-1`)
  })

  it('should NOT include aggregateRating for premium brand robots', () => {
    const premiumRobot: Robot = {
      ...mockRobot,
      brand: 'Boston Dynamics',
    }
    const result = generateProductSchema(premiumRobot, baseUrl)
    expect(result).not.toHaveProperty('aggregateRating')
  })

  it('should NOT include aggregateRating for robots with "request" pricing', () => {
    const requestRobot = {
      ...mockRobot,
      price: { ...mockRobot.price, starting: 'request' as unknown as number },
    } as Robot
    const result = generateProductSchema(requestRobot, baseUrl)
    expect(result).not.toHaveProperty('aggregateRating')
  })
})

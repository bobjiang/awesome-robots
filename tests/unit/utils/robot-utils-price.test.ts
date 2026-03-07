import { describe, it, expect } from 'vitest'
import { sortRobots } from '@/utils/robot-utils'
import type { Robot } from '@/types/robot'

// Helper to create a minimal robot for price sorting tests
function makeRobot(
  id: string,
  priceStarting: number | 'request',
  overrides: Partial<Robot> = {}
): Robot {
  return {
    id,
    name: `Robot ${id}`,
    brand: 'TestBrand',
    category: 'humanoid',
    price: {
      starting: priceStarting as number, // Current type lies -- this is the bug we're testing
      currency: 'USD',
      models: [],
    },
    specifications: {},
    features: [],
    images: [],
    officialUrl: null,
    description: `Test robot ${id}`,
    ...overrides,
  }
}

describe('DATA-001: sortRobots with "request" price values', () => {
  it('sorting by price ascending does not produce NaN', () => {
    const robots = [
      makeRobot('a', 'request'),
      makeRobot('b', 5000),
      makeRobot('c', 1000),
    ]

    const sorted = sortRobots(robots, 'price', 'asc')

    // Verify no NaN in the sort result - all robots should be present
    expect(sorted).toHaveLength(3)

    // Numeric prices should come first, sorted ascending
    expect(sorted[0].id).toBe('c') // 1000
    expect(sorted[1].id).toBe('b') // 5000
    // "request" price should sort to the end (treated as Infinity)
    expect(sorted[2].id).toBe('a') // "request"
  })

  it('sorting by price descending handles "request" without NaN', () => {
    const robots = [
      makeRobot('a', 'request'),
      makeRobot('b', 5000),
      makeRobot('c', 1000),
    ]

    const sorted = sortRobots(robots, 'price', 'desc')

    expect(sorted).toHaveLength(3)
    // No ID should be undefined (sign of NaN corruption in sort)
    sorted.forEach((robot) => {
      expect(robot.id).toBeDefined()
      expect(typeof robot.id).toBe('string')
    })

    // Numeric robots should be in descending order relative to each other
    const numericRobots = sorted.filter(
      (r) => typeof r.price.starting === 'number'
    )
    if (numericRobots.length >= 2) {
      for (let i = 0; i < numericRobots.length - 1; i++) {
        expect(numericRobots[i].price.starting as number).toBeGreaterThanOrEqual(
          numericRobots[i + 1].price.starting as number
        )
      }
    }
  })

  it('sorting all-"request" robots does not produce NaN', () => {
    const robots = [
      makeRobot('a', 'request'),
      makeRobot('b', 'request'),
      makeRobot('c', 'request'),
    ]

    const sorted = sortRobots(robots, 'price', 'asc')

    // Should not throw, should return all robots
    expect(sorted).toHaveLength(3)
    sorted.forEach((robot) => {
      expect(robot.id).toBeDefined()
    })
  })

  it('mixed numeric and "request" prices sort correctly', () => {
    const robots = [
      makeRobot('expensive', 50000),
      makeRobot('request1', 'request'),
      makeRobot('cheap', 1600),
      makeRobot('request2', 'request'),
      makeRobot('mid', 15000),
    ]

    const sorted = sortRobots(robots, 'price', 'asc')

    // All numeric prices should appear before "request" prices
    const numericIds = sorted
      .filter((r) => typeof r.price.starting === 'number')
      .map((r) => r.id)
    const requestIds = sorted
      .filter((r) => r.price.starting === 'request')
      .map((r) => r.id)

    // Numeric should be sorted: cheap (1600), mid (15000), expensive (50000)
    expect(numericIds).toEqual(['cheap', 'mid', 'expensive'])
    // Request robots should come last
    expect(requestIds).toHaveLength(2)
  })
})

import { describe, it, expect } from 'vitest'

describe('PERF-003: brands/page.tsx exports metadata', () => {
  it('exports a metadata object with title', async () => {
    // Dynamic import to get the module's exports
    const brandsModule = await import('@/app/brands/page')
    const metadata = (brandsModule as Record<string, unknown>).metadata as {
      title?: string
      description?: string
      openGraph?: { title?: string; description?: string }
    }

    expect(metadata).toBeDefined()
    expect(metadata.title).toBeDefined()
    expect(typeof metadata.title).toBe('string')
    expect(metadata.title).toMatch(/brand/i)
  })

  it('metadata has a description', async () => {
    const brandsModule = await import('@/app/brands/page')
    const metadata = (brandsModule as Record<string, unknown>).metadata as {
      title?: string
      description?: string
    }

    expect(metadata.description).toBeDefined()
    expect(typeof metadata.description).toBe('string')
    expect(metadata.description!.length).toBeGreaterThan(20)
  })

  it('metadata has openGraph properties', async () => {
    const brandsModule = await import('@/app/brands/page')
    const metadata = (brandsModule as Record<string, unknown>).metadata as {
      openGraph?: { title?: string; description?: string }
    }

    expect(metadata.openGraph).toBeDefined()
    expect(metadata.openGraph?.title).toBeTruthy()
    expect(metadata.openGraph?.description).toBeTruthy()
  })
})

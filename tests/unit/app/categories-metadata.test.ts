import { describe, it, expect } from 'vitest'

describe('PERF-003: categories/page.tsx exports metadata', () => {
  it('exports a metadata object with title', async () => {
    const categoriesModule = await import('@/app/categories/page')
    const metadata = (categoriesModule as Record<string, unknown>).metadata as {
      title?: string
      description?: string
      openGraph?: { title?: string; description?: string }
    }

    expect(metadata).toBeDefined()
    expect(metadata.title).toBeDefined()
    expect(typeof metadata.title).toBe('string')
    expect(metadata.title).toMatch(/categor/i)
  })

  it('metadata has a description', async () => {
    const categoriesModule = await import('@/app/categories/page')
    const metadata = (categoriesModule as Record<string, unknown>).metadata as {
      title?: string
      description?: string
    }

    expect(metadata.description).toBeDefined()
    expect(typeof metadata.description).toBe('string')
    expect(metadata.description!.length).toBeGreaterThan(20)
  })

  it('metadata has openGraph properties', async () => {
    const categoriesModule = await import('@/app/categories/page')
    const metadata = (categoriesModule as Record<string, unknown>).metadata as {
      openGraph?: { title?: string; description?: string }
    }

    expect(metadata.openGraph).toBeDefined()
    expect(metadata.openGraph?.title).toBeTruthy()
    expect(metadata.openGraph?.description).toBeTruthy()
  })
})

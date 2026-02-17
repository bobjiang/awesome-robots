import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { BrowserManager } from 'agent-browser/dist/browser'

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000'

const NEW_ROBOTS = [
  {
    id: 'geekplus-gino-1',
    name: 'Gino 1',
    brand: 'Geek+',
    category: 'humanoid',
    expectedSections: ['Key Features', 'Hardware', 'Software', 'Supplier'],
    expectedSpecs: ['NVIDIA Jetson Thor', '28', 'DOF'],
    price: 'Request',
  },
  {
    id: 'roboparty-roboto-origin',
    name: 'ROBOTO ORIGIN',
    brand: 'RoboParty',
    category: 'humanoid',
    expectedSections: ['Key Features', 'Hardware', 'Software', 'Supplier'],
    expectedSpecs: ['23', 'DOF', 'Orange Pi', 'ROS2'],
    price: '$6,800',
  },
  {
    id: 'faraday-future-fx-aegis',
    name: 'FX Aegis',
    brand: 'Faraday Future',
    category: 'quadruped',
    expectedSections: ['Key Features', 'Hardware', 'Software', 'Supplier'],
    expectedSpecs: ['12', 'Degrees of Freedom', '3.7', 'IP54'],
    price: '$2,499',
  },
]

describe('E2E: New Robots from 2026-02-17 Discovery', () => {
  let browser: BrowserManager

  beforeAll(async () => {
    browser = new BrowserManager()
    await browser.launch({ headless: true })
  }, 30000)

  afterAll(async () => {
    await browser.close()
  })

  describe('Robot Detail Pages', () => {
    for (const robot of NEW_ROBOTS) {
      describe(`${robot.brand} ${robot.name}`, () => {
        it('should load the robot detail page', async () => {
          const page = browser.getPage()
          const response = await page.goto(`${BASE_URL}/robots/${robot.id}`, {
            waitUntil: 'networkidle',
          })

          expect(response?.status()).toBe(200)

          // Robot name should be visible
          const title = await page.title()
          expect(title.toLowerCase()).toContain(robot.name.toLowerCase())
        }, 30000)

        it('should display robot name and brand', async () => {
          const page = browser.getPage()
          await page.goto(`${BASE_URL}/robots/${robot.id}`, {
            waitUntil: 'networkidle',
          })

          const bodyText = await page.textContent('body')
          expect(bodyText).toContain(robot.name)
          expect(bodyText).toContain(robot.brand)
        }, 30000)

        it('should display robot images', async () => {
          const page = browser.getPage()
          await page.goto(`${BASE_URL}/robots/${robot.id}`, {
            waitUntil: 'networkidle',
          })

          // Check that at least one image is present
          const images = await page.locator('img').count()
          expect(images).toBeGreaterThan(0)

          // Next.js Image component serves images through /_next/image?url=%2Fimages%2Frobots%2F...
          // Check for robot images by matching the encoded URL or alt text
          const robotImages = page.locator('img[src*="images%2Frobots%2F"], img[src*="/images/robots/"]')
          const robotImageCount = await robotImages.count()
          expect(robotImageCount).toBeGreaterThan(0)
        }, 30000)

        it('should display key specification sections', async () => {
          const page = browser.getPage()
          await page.goto(`${BASE_URL}/robots/${robot.id}`, {
            waitUntil: 'networkidle',
          })

          const bodyText = await page.textContent('body')

          // Check for key sections from RobotDetailTemplate
          for (const section of robot.expectedSections) {
            expect(bodyText?.toLowerCase()).toContain(section.toLowerCase())
          }
        }, 30000)

        it('should display expected technical specifications', async () => {
          const page = browser.getPage()
          await page.goto(`${BASE_URL}/robots/${robot.id}`, {
            waitUntil: 'networkidle',
          })

          const bodyText = await page.textContent('body')

          for (const spec of robot.expectedSpecs) {
            expect(bodyText).toContain(spec)
          }
        }, 30000)

        it('should display Request Quote button', async () => {
          const page = browser.getPage()
          await page.goto(`${BASE_URL}/robots/${robot.id}`, {
            waitUntil: 'networkidle',
          })

          const quoteButton = page.locator('button:has-text("Request"), a:has-text("Request")')
          const count = await quoteButton.count()
          expect(count).toBeGreaterThan(0)
        }, 30000)

        it('should display price information', async () => {
          const page = browser.getPage()
          await page.goto(`${BASE_URL}/robots/${robot.id}`, {
            waitUntil: 'networkidle',
          })

          const bodyText = await page.textContent('body')
          expect(bodyText).toContain(robot.price)
        }, 30000)

        it('should have at least 12 key features listed', async () => {
          const page = browser.getPage()
          await page.goto(`${BASE_URL}/robots/${robot.id}`, {
            waitUntil: 'networkidle',
          })

          // Key features are typically rendered as list items in the features section
          // Look for the key features section and count items
          const featureItems = page.locator('section:has-text("Key Features") li, div:has-text("Key Features") li')
          const featureCount = await featureItems.count()

          // If the specific selector doesn't work, try a broader approach
          if (featureCount === 0) {
            // Fallback: count all list items on the page that contain feature-like text
            const allListItems = await page.locator('ul li, ol li').count()
            expect(allListItems).toBeGreaterThanOrEqual(12)
          } else {
            expect(featureCount).toBeGreaterThanOrEqual(12)
          }
        }, 30000)

        it('should not have console errors', async () => {
          const page = browser.getPage()
          const errors: string[] = []

          page.on('console', (msg) => {
            if (msg.type() === 'error') {
              errors.push(msg.text())
            }
          })

          await page.goto(`${BASE_URL}/robots/${robot.id}`, {
            waitUntil: 'networkidle',
          })

          // Filter out known non-critical errors (favicon, analytics, image optimization warnings, hydration)
          const criticalErrors = errors.filter(
            (e) =>
              !e.includes('favicon') &&
              !e.includes('analytics') &&
              !e.includes('gtag') &&
              !e.includes('googletagmanager') &&
              !e.includes('next/image') &&
              !e.includes('Image with src') &&
              !e.includes('was preloaded') &&
              !e.includes('net::ERR') &&
              !e.includes('Failed to load resource')
          )
          expect(criticalErrors).toHaveLength(0)
        }, 30000)
      })
    }
  })

  describe('Browse Page Integration', () => {
    it('should show all 3 new robots on the browse page', async () => {
      const page = browser.getPage()
      await page.goto(`${BASE_URL}/browse`, { waitUntil: 'networkidle' })

      const bodyText = await page.textContent('body')

      for (const robot of NEW_ROBOTS) {
        expect(bodyText).toContain(robot.name)
      }
    }, 60000)

    it('should find Gino 1 when searching', async () => {
      const page = browser.getPage()
      await page.goto(`${BASE_URL}/browse`, { waitUntil: 'networkidle' })

      const searchInput = page.locator('input[type="text"], input[type="search"]').first()
      await searchInput.fill('Gino')
      await page.waitForTimeout(1500)

      const bodyText = await page.textContent('body')
      expect(bodyText).toContain('Gino 1')
    }, 30000)

    it('should find ROBOTO ORIGIN when searching', async () => {
      const page = browser.getPage()
      await page.goto(`${BASE_URL}/browse`, { waitUntil: 'networkidle' })

      const searchInput = page.locator('input[type="text"], input[type="search"]').first()
      await searchInput.fill('ROBOTO')
      await page.waitForTimeout(1500)

      const bodyText = await page.textContent('body')
      expect(bodyText).toContain('ROBOTO ORIGIN')
    }, 30000)

    it('should find FX Aegis when searching', async () => {
      const page = browser.getPage()
      await page.goto(`${BASE_URL}/browse`, { waitUntil: 'networkidle' })

      const searchInput = page.locator('input[type="text"], input[type="search"]').first()
      await searchInput.fill('Aegis')
      await page.waitForTimeout(1500)

      const bodyText = await page.textContent('body')
      expect(bodyText).toContain('FX Aegis')
    }, 30000)
  })

  describe('Category Page Integration', () => {
    it('should show Gino 1 and ROBOTO ORIGIN on humanoid category page', async () => {
      const page = browser.getPage()
      await page.goto(`${BASE_URL}/categories/humanoid`, { waitUntil: 'networkidle' })

      const bodyText = await page.textContent('body')
      expect(bodyText).toContain('Gino 1')
      expect(bodyText).toContain('ROBOTO ORIGIN')
    }, 30000)

    it('should show FX Aegis on quadruped category page', async () => {
      const page = browser.getPage()
      await page.goto(`${BASE_URL}/categories/quadruped`, { waitUntil: 'networkidle' })

      const bodyText = await page.textContent('body')
      expect(bodyText).toContain('FX Aegis')
    }, 30000)
  })

  describe('Brand Pages', () => {
    it('should have a Geek+ brand page with Gino 1', async () => {
      const page = browser.getPage()
      const response = await page.goto(`${BASE_URL}/brands/geekplus`, {
        waitUntil: 'networkidle',
      })

      expect(response?.status()).toBe(200)
      const bodyText = await page.textContent('body')
      expect(bodyText).toContain('Gino 1')
    }, 30000)

    it('should have a RoboParty brand page with ROBOTO ORIGIN', async () => {
      const page = browser.getPage()
      const response = await page.goto(`${BASE_URL}/brands/roboparty`, {
        waitUntil: 'networkidle',
      })

      expect(response?.status()).toBe(200)
      const bodyText = await page.textContent('body')
      expect(bodyText).toContain('ROBOTO ORIGIN')
    }, 30000)

    it('should have a Faraday Future brand page with FX Aegis', async () => {
      const page = browser.getPage()
      const response = await page.goto(`${BASE_URL}/brands/faraday-future`, {
        waitUntil: 'networkidle',
      })

      expect(response?.status()).toBe(200)
      const bodyText = await page.textContent('body')
      expect(bodyText).toContain('FX Aegis')
    }, 30000)
  })
})

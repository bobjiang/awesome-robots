import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { BrowserManager } from 'agent-browser/dist/browser'

const BASE_URL = process.env.TEST_BASE_URL || 'https://www.awesomerobots.xyz'
const BLOG_POST_SLUG = 'unitree-go2-comprehensive-review'
const BLOG_POST_URL = `${BASE_URL}/blog/${BLOG_POST_SLUG}`

describe('E2E: Share Buttons on Blog Posts', () => {
  let browser: BrowserManager

  beforeAll(async () => {
    browser = new BrowserManager()
    await browser.launch({ headless: true })
  }, 30000)

  afterAll(async () => {
    await browser.close()
  })

  it('should display share buttons in two locations on blog post page', async () => {
    const page = browser.getPage()
    await page.goto(BLOG_POST_URL, { waitUntil: 'networkidle' })

    // Check share buttons appear in at least 2 sets (top and bottom)
    // Note: author bio may also contain a "Twitter" link, so we check >= 2
    expect(await page.locator('a:has-text("Twitter")').count()).toBeGreaterThanOrEqual(2)
    expect(await page.locator('a:has-text("Facebook")').count()).toBeGreaterThanOrEqual(2)
    expect(await page.locator('a:has-text("LinkedIn")').count()).toBeGreaterThanOrEqual(2)
    expect(await page.locator('a:has-text("Email")').count()).toBe(2)
    expect(await page.locator('button:has-text("Copy Link")').count()).toBe(2)
  }, 30000)

  it('should have correct Twitter share URL', async () => {
    const page = browser.getPage()
    await page.goto(BLOG_POST_URL, { waitUntil: 'networkidle' })

    const twitterLink = page.locator('a:has-text("Twitter")').first()
    const href = await twitterLink.getAttribute('href')

    expect(href).toContain('https://twitter.com/intent/tweet')
    expect(href).toContain(`url=${encodeURIComponent(BLOG_POST_URL)}`)
  }, 30000)

  it('should have correct Facebook share URL', async () => {
    const page = browser.getPage()
    await page.goto(BLOG_POST_URL, { waitUntil: 'networkidle' })

    const facebookLink = page.locator('a:has-text("Facebook")').first()
    const href = await facebookLink.getAttribute('href')

    expect(href).toContain('https://www.facebook.com/sharer/sharer.php')
    expect(href).toContain(`u=${encodeURIComponent(BLOG_POST_URL)}`)
  }, 30000)

  it('should have correct LinkedIn share URL', async () => {
    const page = browser.getPage()
    await page.goto(BLOG_POST_URL, { waitUntil: 'networkidle' })

    const linkedinLink = page.locator('a:has-text("LinkedIn")').first()
    const href = await linkedinLink.getAttribute('href')

    expect(href).toContain('https://www.linkedin.com/sharing/share-offsite/')
    expect(href).toContain(`url=${encodeURIComponent(BLOG_POST_URL)}`)
  }, 30000)

  it('should have correct Email mailto link', async () => {
    const page = browser.getPage()
    await page.goto(BLOG_POST_URL, { waitUntil: 'networkidle' })

    const emailLink = page.locator('a:has-text("Email")').first()
    const href = await emailLink.getAttribute('href')

    expect(href).toContain('mailto:?subject=')
    expect(href).toContain(encodeURIComponent(BLOG_POST_URL))
  }, 30000)

  it('should open share links in new tab', async () => {
    const page = browser.getPage()
    await page.goto(BLOG_POST_URL, { waitUntil: 'networkidle' })

    const socialLinks = page.locator('a:has-text("Twitter"), a:has-text("Facebook"), a:has-text("LinkedIn")')
    const count = await socialLinks.count()

    for (let i = 0; i < count; i++) {
      const target = await socialLinks.nth(i).getAttribute('target')
      expect(target).toBe('_blank')

      const rel = await socialLinks.nth(i).getAttribute('rel')
      expect(rel).toContain('noopener')
    }
  }, 30000)

  it('should show "Copied!" feedback when copy link is clicked', async () => {
    const page = browser.getPage()
    await page.goto(BLOG_POST_URL, { waitUntil: 'networkidle' })

    // Grant clipboard permissions
    const context = page.context()
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    const copyButton = page.locator('button:has-text("Copy Link")').first()
    await copyButton.click()

    // Check "Copied!" text appears
    await page.locator('text=Copied!').waitFor({ state: 'visible', timeout: 2000 })
    const copiedVisible = await page.locator('text=Copied!').isVisible()
    expect(copiedVisible).toBe(true)

    // Wait for it to reset back to "Copy Link"
    await page.waitForTimeout(2500)
    const resetVisible = await copyButton.locator('span:has-text("Copy Link")').isVisible()
    expect(resetVisible).toBe(true)
  }, 30000)

  it('should display "Share this article:" label before bottom share buttons', async () => {
    const page = browser.getPage()
    await page.goto(BLOG_POST_URL, { waitUntil: 'networkidle' })

    const shareLabel = page.locator('h3:has-text("Share this article:")')
    const isVisible = await shareLabel.isVisible()
    expect(isVisible).toBe(true)
  }, 30000)
})

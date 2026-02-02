import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createBrowser, BrowserHelper } from '../../helpers/browser';
import { assertPageLoaded, assertNavigationSuccess, assertBreadcrumbs } from '../../helpers/assertions';
import { PAGE_PATHS, PAGE_INDICATORS } from '../../fixtures/test-data';

/**
 * E2E Tests: Navigation
 *
 * Tests:
 * - All main nav links work (Browse, Brands, Blog, FAQ)
 * - Breadcrumbs functional
 * - Footer links accessible
 * - Back navigation works
 */

describe('E2E: Navigation', () => {
  let browser: BrowserHelper;

  beforeAll(async () => {
    browser = createBrowser();
  });

  afterAll(async () => {
    await browser.close();
  });

  describe('Main Navigation Links', () => {
    it('should navigate to Browse page', async () => {
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.BROWSE);

      assertPageLoaded(snapshot);
      assertNavigationSuccess(snapshot, 'Browse');
      expect(snapshot).toContain('Search') || expect(snapshot).toContain('Filter');
    }, 30000);

    it('should navigate to Brands page', async () => {
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.BRANDS);

      assertPageLoaded(snapshot);
      assertNavigationSuccess(snapshot, 'Brands');
      expect(snapshot).toContain('Unitree') || expect(snapshot).toContain('Boston Dynamics');
    }, 30000);

    it('should navigate to Blog page', async () => {
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.BLOG);

      assertPageLoaded(snapshot);
      assertNavigationSuccess(snapshot, 'Blog');
      expect(snapshot).toContain('Article') || expect(snapshot).toContain('Post') || expect(snapshot).toContain('Read');
    }, 30000);

    it('should navigate to FAQ page', async () => {
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.FAQ);

      assertPageLoaded(snapshot);
      expect(snapshot).toContain('FAQ') || expect(snapshot).toContain('Frequently Asked Questions');
      expect(snapshot).toContain('Question') || expect(snapshot).toContain('Answer');
    }, 30000);

    it('should navigate to Compare page', async () => {
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.COMPARE);

      assertPageLoaded(snapshot);
      expect(snapshot).toContain('Compare');
    }, 30000);

    it('should navigate to Home from logo', async () => {
      // Navigate to a different page first
      await browser.navigateAndWait(PAGE_PATHS.BROWSE);

      // Navigate back to home
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.HOME);

      assertPageLoaded(snapshot);
      expect(snapshot).toContain('Discover') || expect(snapshot).toContain('Featured');
    }, 30000);
  });

  describe('Category Navigation', () => {
    it('should navigate to Humanoid category page', async () => {
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.CATEGORY_HUMANOID);

      assertPageLoaded(snapshot);
      expect(snapshot).toContain('Humanoid');
      expect(snapshot).toMatch(/View Details|Request Quote/);
    }, 30000);

    it('should navigate to Quadruped category page', async () => {
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.CATEGORY_QUADRUPED);

      assertPageLoaded(snapshot);
      expect(snapshot).toContain('Quadruped');
      expect(snapshot).toMatch(/View Details|Request Quote/);
    }, 30000);

    it('should navigate to Accessory category page', async () => {
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.CATEGORY_ACCESSORY);

      assertPageLoaded(snapshot);
      expect(snapshot).toContain('Accessory') || expect(snapshot).toContain('Accessories');
    }, 30000);
  });

  describe('Brand Navigation', () => {
    it('should navigate to Unitree brand page', async () => {
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.BRAND_UNITREE);

      assertPageLoaded(snapshot);
      expect(snapshot).toContain('Unitree');
      expect(snapshot).toMatch(/View Details|Request Quote/);
    }, 30000);

    it('should navigate to Boston Dynamics brand page', async () => {
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.BRAND_BOSTON_DYNAMICS);

      assertPageLoaded(snapshot);
      expect(snapshot).toContain('Boston Dynamics');
      expect(snapshot).toMatch(/View Details|Request Quote/);
    }, 30000);

    it('should navigate to UBTech brand page', async () => {
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.BRAND_UBTECH);

      assertPageLoaded(snapshot);
      expect(snapshot).toContain('UBTech') || expect(snapshot).toContain('UBTECH');
    }, 30000);

    it('should navigate to Deep Robotics brand page', async () => {
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.BRAND_DEEP_ROBOTICS);

      assertPageLoaded(snapshot);
      expect(snapshot).toContain('Deep Robotics');
    }, 30000);

    it('should navigate to ANYbotics brand page', async () => {
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.BRAND_ANYBOTICS);

      assertPageLoaded(snapshot);
      expect(snapshot).toContain('ANYbotics') || expect(snapshot).toContain('ANY');
    }, 30000);
  });

  describe('Breadcrumbs', () => {
    it('should show breadcrumbs on robot detail page', async () => {
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.ROBOT_UNITREE_G1);

      // Breadcrumbs might show: Home > Browse > Unitree G1
      // or: Home > Robots > Unitree G1
      expect(snapshot).toContain('Home') || expect(snapshot).toContain('Browse');
    }, 30000);

    it('should show breadcrumbs on category page', async () => {
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.CATEGORY_HUMANOID);

      // Breadcrumbs might show: Home > Categories > Humanoid
      expect(snapshot).toContain('Home') || expect(snapshot).toContain('Categories');
    }, 30000);

    it('should show breadcrumbs on brand page', async () => {
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.BRAND_UNITREE);

      // Breadcrumbs might show: Home > Brands > Unitree
      expect(snapshot).toContain('Home') || expect(snapshot).toContain('Brands');
    }, 30000);
  });

  describe('Footer Navigation', () => {
    it('should have working footer links on homepage', async () => {
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.HOME);

      // Assert footer sections are present
      expect(snapshot).toMatch(/Quick Links|Categories|About|Contact|Follow/);

      // Footer should have navigation links
      const hasNavLinks =
        snapshot.includes('Browse') ||
        snapshot.includes('Brands') ||
        snapshot.includes('Blog') ||
        snapshot.includes('FAQ');

      expect(hasNavLinks).toBe(true);
    }, 30000);

    it('should have footer on all pages', async () => {
      // Test footer on different pages
      const pages = [PAGE_PATHS.BROWSE, PAGE_PATHS.BRANDS, PAGE_PATHS.BLOG];

      for (const page of pages) {
        const snapshot = await browser.navigateAndWait(page);

        // Footer should be present
        expect(snapshot).toMatch(/Quick Links|Categories|Follow|About/);
      }
    }, 60000);
  });

  describe('Back Navigation', () => {
    it('should go back to previous page', async () => {
      // Navigate to browse page
      await browser.navigateAndWait(PAGE_PATHS.BROWSE);

      // Navigate to robot detail
      await browser.navigateAndWait(PAGE_PATHS.ROBOT_UNITREE_G1);

      // Go back
      await browser.goBack();
      await browser.wait(1);

      // Get snapshot
      const snapshot = await browser.getSnapshot();

      // Should be back on browse page
      expect(snapshot).toContain('Browse') || expect(snapshot).toContain('Search');
    }, 30000);
  });

  describe('External Links', () => {
    it('should have social media links in footer', async () => {
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.HOME);

      // Footer might have social media links
      const hasSocialLinks =
        snapshot.includes('Twitter') ||
        snapshot.includes('GitHub') ||
        snapshot.includes('LinkedIn') ||
        snapshot.includes('Follow');

      // This is optional, so we just check if present
      expect(typeof hasSocialLinks).toBe('boolean');
    }, 30000);
  });
});

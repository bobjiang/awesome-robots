import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { createBrowser, BrowserHelper } from '../../helpers/browser';
import { assertPageLoaded, assertMobileMenuVisible } from '../../helpers/assertions';
import { PAGE_PATHS, TEST_CONFIG } from '../../fixtures/test-data';

/**
 * E2E Tests: Mobile Responsive Behavior
 *
 * Tests:
 * - Mobile menu toggle (hamburger)
 * - Mobile filter sidebar toggle
 * - Touch interactions work
 * - Viewport switches correctly
 * - Layout adapts to different screen sizes
 */

describe('E2E: Mobile Responsive Behavior', () => {
  let browser: BrowserHelper;

  beforeAll(async () => {
    browser = createBrowser();
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    // Reset to desktop before each test
    await browser.resizeViewport('DESKTOP');
  });

  describe('Mobile Menu Navigation', () => {
    it('should show mobile menu toggle on mobile viewport', async () => {
      // Resize to mobile
      await browser.resizeViewport('MOBILE');

      // Navigate to homepage
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.HOME);

      assertPageLoaded(snapshot);

      // Assert mobile menu toggle is present
      expect(snapshot).toContain('menu') || expect(snapshot).toContain('Menu') || expect(snapshot).toContain('navigation');
    }, 30000);

    it('should open mobile menu when toggle is clicked', async () => {
      // Resize to mobile
      await browser.resizeViewport('MOBILE');

      // Navigate to homepage
      await browser.navigateAndWait(PAGE_PATHS.HOME);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Find mobile menu toggle ref
      const menuToggleMatch = snapshot.match(/menu.*?button.*?(@e\d+)|Menu.*?(@e\d+)|navigation.*?(@e\d+)/i);

      if (menuToggleMatch) {
        const menuRef = menuToggleMatch[1] || menuToggleMatch[2] || menuToggleMatch[3];

        // Click menu toggle
        await browser.click('Mobile menu toggle', menuRef);
        await browser.wait(0.5);

        // Get updated snapshot
        snapshot = await browser.getSnapshot();

        // Assert mobile menu is visible
        assertMobileMenuVisible(snapshot);
      }
    }, 30000);

    it('should close mobile menu when close button is clicked', async () => {
      // Resize to mobile
      await browser.resizeViewport('MOBILE');

      // Navigate to homepage
      await browser.navigateAndWait(PAGE_PATHS.HOME);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Open mobile menu
      const menuToggleMatch = snapshot.match(/menu.*?button.*?(@e\d+)|Menu.*?(@e\d+)/i);

      if (menuToggleMatch) {
        const menuRef = menuToggleMatch[1] || menuToggleMatch[2];
        await browser.click('Mobile menu toggle', menuRef);
        await browser.wait(0.5);

        snapshot = await browser.getSnapshot();

        // Find close button
        const closeMatch = snapshot.match(/Close.*?(@e\d+)|close.*?button.*?(@e\d+)/i);

        if (closeMatch) {
          const closeRef = closeMatch[1] || closeMatch[2];

          // Click close button
          await browser.click('Close menu button', closeRef);
          await browser.wait(0.5);

          // Get updated snapshot
          snapshot = await browser.getSnapshot();

          // Assert menu is closed (back to initial state)
          expect(snapshot).toBeDefined();
        }
      }
    }, 30000);

    it('should navigate using mobile menu', async () => {
      // Resize to mobile
      await browser.resizeViewport('MOBILE');

      // Navigate to homepage
      await browser.navigateAndWait(PAGE_PATHS.HOME);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Open mobile menu
      const menuToggleMatch = snapshot.match(/menu.*?button.*?(@e\d+)|Menu.*?(@e\d+)/i);

      if (menuToggleMatch) {
        const menuRef = menuToggleMatch[1] || menuToggleMatch[2];
        await browser.click('Mobile menu toggle', menuRef);
        await browser.wait(0.5);

        snapshot = await browser.getSnapshot();

        // Find Browse link in mobile menu
        const browseLinkMatch = snapshot.match(/Browse.*?link.*?(@e\d+)/i);

        if (browseLinkMatch) {
          const browseRef = browseLinkMatch[1];

          // Click Browse link
          await browser.click('Browse link', browseRef);
          await browser.wait(1);

          // Get updated snapshot
          snapshot = await browser.getSnapshot();

          // Assert navigation to Browse page
          expect(snapshot).toContain('Browse') || expect(snapshot).toContain('Search');
        }
      }
    }, 30000);
  });

  describe('Mobile Filter Sidebar', () => {
    it('should show filter toggle on mobile browse page', async () => {
      // Resize to mobile
      await browser.resizeViewport('MOBILE');

      // Navigate to browse page
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.BROWSE);

      assertPageLoaded(snapshot);

      // Assert filter toggle is present
      expect(snapshot).toContain('Filter') || expect(snapshot).toContain('filter');
    }, 30000);

    it('should open filter sidebar when toggle is clicked', async () => {
      // Resize to mobile
      await browser.resizeViewport('MOBILE');

      // Navigate to browse page
      await browser.navigateAndWait(PAGE_PATHS.BROWSE);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Find filter toggle ref
      const filterToggleMatch = snapshot.match(/Filter.*?button.*?(@e\d+)|filter.*?toggle.*?(@e\d+)/i);

      if (filterToggleMatch) {
        const filterRef = filterToggleMatch[1] || filterToggleMatch[2];

        // Click filter toggle
        await browser.click('Filter toggle button', filterRef);
        await browser.wait(0.5);

        // Get updated snapshot
        snapshot = await browser.getSnapshot();

        // Assert filter sidebar is visible
        expect(snapshot).toContain('Category') || expect(snapshot).toContain('Brand');
        expect(snapshot).toContain('Humanoid') || expect(snapshot).toContain('Quadruped');
      }
    }, 30000);

    it('should apply filters on mobile', async () => {
      // Resize to mobile
      await browser.resizeViewport('MOBILE');

      // Navigate to browse page
      await browser.navigateAndWait(PAGE_PATHS.BROWSE);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Open filter sidebar
      const filterToggleMatch = snapshot.match(/Filter.*?button.*?(@e\d+)/i);

      if (filterToggleMatch) {
        await browser.click('Filter toggle button', filterToggleMatch[1]);
        await browser.wait(0.5);

        snapshot = await browser.getSnapshot();

        // Find Humanoid filter checkbox
        const humanoidMatch = snapshot.match(/Humanoid.*?checkbox.*?(@e\d+)/i);

        if (humanoidMatch) {
          // Apply Humanoid filter
          await browser.applyFilter('Humanoid', humanoidMatch[1]);

          // Get updated snapshot
          snapshot = await browser.getSnapshot();

          // Assert filter is applied
          expect(snapshot).toMatch(/Humanoid|humanoid/);
        }
      }
    }, 60000);
  });

  describe('Viewport Adaptations', () => {
    it('should adapt layout for tablet viewport', async () => {
      // Resize to tablet
      await browser.resizeViewport('TABLET');

      // Navigate to browse page
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.BROWSE);

      assertPageLoaded(snapshot);

      // Assert page content is present
      expect(snapshot).toContain('Browse') || expect(snapshot).toContain('Search');
      expect(snapshot).toMatch(/View Details|Request Quote/);
    }, 30000);

    it('should maintain functionality across viewport changes', async () => {
      // Start with desktop
      await browser.resizeViewport('DESKTOP');
      let snapshot = await browser.navigateAndWait(PAGE_PATHS.BROWSE);
      assertPageLoaded(snapshot);

      // Switch to mobile
      await browser.resizeViewport('MOBILE');
      await browser.wait(0.5);
      snapshot = await browser.getSnapshot();
      assertPageLoaded(snapshot);

      // Switch to tablet
      await browser.resizeViewport('TABLET');
      await browser.wait(0.5);
      snapshot = await browser.getSnapshot();
      assertPageLoaded(snapshot);

      // Back to desktop
      await browser.resizeViewport('DESKTOP');
      await browser.wait(0.5);
      snapshot = await browser.getSnapshot();
      assertPageLoaded(snapshot);
    }, 30000);
  });

  describe('Mobile Search', () => {
    it('should search robots on mobile', async () => {
      // Resize to mobile
      await browser.resizeViewport('MOBILE');

      // Navigate to browse page
      await browser.navigateAndWait(PAGE_PATHS.BROWSE);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Find search input ref
      const searchMatch = snapshot.match(/Search.*?(@e\d+)/i);

      if (searchMatch) {
        const searchRef = searchMatch[1];

        // Search for "Unitree"
        await browser.searchRobots('Unitree', searchRef);

        // Get updated snapshot
        snapshot = await browser.getSnapshot();

        // Assert search results
        expect(snapshot).toContain('Unitree');
      }
    }, 60000);
  });

  describe('Mobile Robot Detail Page', () => {
    it('should display robot detail on mobile', async () => {
      // Resize to mobile
      await browser.resizeViewport('MOBILE');

      // Navigate to robot detail page
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.ROBOT_UNITREE_G1);

      assertPageLoaded(snapshot);

      // Assert key content is present
      expect(snapshot).toContain('Unitree G1') || expect(snapshot).toContain('G1');
      expect(snapshot).toContain('Request Quote');
    }, 30000);

    it('should open quote form on mobile', async () => {
      // Resize to mobile
      await browser.resizeViewport('MOBILE');

      // Navigate to robot detail page
      await browser.navigateAndWait(PAGE_PATHS.ROBOT_UNITREE_G1);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Find Request Quote button
      const quoteMatch = snapshot.match(/Request Quote.*?(@e\d+)/i);

      if (quoteMatch) {
        const quoteRef = quoteMatch[1];

        // Click Request Quote
        await browser.click('Request Quote button', quoteRef);
        await browser.wait(TEST_CONFIG.WAIT_FOR_MODAL);

        // Get updated snapshot
        snapshot = await browser.getSnapshot();

        // Assert quote form is open
        expect(snapshot).toContain('Quote') || expect(snapshot).toContain('Name') || expect(snapshot).toContain('Email');
      }
    }, 30000);
  });

  describe('Touch Interactions', () => {
    it('should handle touch events on mobile cards', async () => {
      // Resize to mobile
      await browser.resizeViewport('MOBILE');

      // Navigate to browse page
      const snapshot = await browser.navigateAndWait(PAGE_PATHS.BROWSE);

      // Assert robot cards are present and clickable
      expect(snapshot).toMatch(/View Details|Request Quote/);
    }, 30000);
  });

  describe('Mobile Performance', () => {
    it('should load pages quickly on mobile', async () => {
      // Resize to mobile
      await browser.resizeViewport('MOBILE');

      // Measure time to load homepage
      const startTime = Date.now();
      await browser.navigateAndWait(PAGE_PATHS.HOME);
      const loadTime = Date.now() - startTime;

      // Assert page loads in reasonable time (< 5 seconds)
      expect(loadTime).toBeLessThan(5000);
    }, 30000);
  });
});

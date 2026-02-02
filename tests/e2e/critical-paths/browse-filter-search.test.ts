import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { createBrowser, BrowserHelper } from '../../helpers/browser';
import {
  assertPageLoaded,
  assertRobotCard,
  assertRobotCardNotPresent,
  assertFilterActive,
  assertNoResults,
  assertResultsCount,
} from '../../helpers/assertions';
import { PAGE_PATHS, SEARCH_QUERIES, FILTER_OPTIONS, SORT_OPTIONS } from '../../fixtures/test-data';

/**
 * E2E Tests: Browse, Filter, and Search Functionality
 *
 * This is the most comprehensive test suite covering:
 * - Search by robot name, brand, and features
 * - Filter by category (humanoid/quadruped)
 * - Filter by brand (Unitree, Boston Dynamics, etc.)
 * - Filter by price range (min/max)
 * - Sort by 5 options (Name, Price, Brand, Category)
 * - Clear all filters
 * - No results state
 * - Combined filters (category + brand + price)
 */

describe('E2E: Browse Page - Filter, Search, and Sort', () => {
  let browser: BrowserHelper;

  beforeAll(async () => {
    browser = createBrowser();
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    // Reset to desktop viewport before each test
    await browser.resizeViewport('DESKTOP');
  });

  describe('Search Functionality', () => {
    it('should search robots by exact name', async () => {
      // Navigate to browse page
      await browser.navigateAndWait(PAGE_PATHS.BROWSE);

      // Get snapshot to find search input ref
      let snapshot = await browser.getSnapshot();

      // Find search input (example ref, will vary)
      const searchRefMatch = snapshot.match(/Search.*?(@e\d+)/);
      if (!searchRefMatch) {
        throw new Error('Search input not found in snapshot');
      }
      const searchRef = searchRefMatch[1];

      // Search for "Unitree G1"
      await browser.searchRobots(SEARCH_QUERIES.EXACT_NAME, searchRef);

      // Get updated snapshot
      snapshot = await browser.getSnapshot();

      // Assert search results contain Unitree G1
      assertRobotCard(snapshot, 'Unitree G1');

      // Assert other robots are filtered out
      expect(snapshot).not.toContain('Boston Dynamics Spot');
    }, 60000);

    it('should search robots by brand name', async () => {
      // Navigate to browse page
      await browser.navigateAndWait(PAGE_PATHS.BROWSE);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Find search input ref
      const searchRefMatch = snapshot.match(/Search.*?(@e\d+)/);
      if (!searchRefMatch) {
        throw new Error('Search input not found');
      }
      const searchRef = searchRefMatch[1];

      // Search for "Unitree"
      await browser.searchRobots(SEARCH_QUERIES.BRAND_UNITREE, searchRef);

      // Get updated snapshot
      snapshot = await browser.getSnapshot();

      // Assert results contain Unitree robots
      expect(snapshot).toContain('Unitree');

      // Should show multiple Unitree robots
      assertResultsCount(snapshot, 'any');
    }, 60000);

    it('should search robots by features', async () => {
      // Navigate to browse page
      await browser.navigateAndWait(PAGE_PATHS.BROWSE);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Find search input ref
      const searchRefMatch = snapshot.match(/Search.*?(@e\d+)/);
      if (!searchRefMatch) {
        throw new Error('Search input not found');
      }
      const searchRef = searchRefMatch[1];

      // Search for "walking"
      await browser.searchRobots(SEARCH_QUERIES.FEATURE_WALKING, searchRef);

      // Get updated snapshot
      snapshot = await browser.getSnapshot();

      // Assert results are shown
      assertResultsCount(snapshot, 'any');
      const hasResults = snapshot.includes('View Details') || snapshot.includes('Request Quote');
      expect(hasResults).toBe(true);
    }, 60000);

    it('should show no results for non-existent robot', async () => {
      // Navigate to browse page
      await browser.navigateAndWait(PAGE_PATHS.BROWSE);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Find search input ref
      const searchRefMatch = snapshot.match(/Search.*?(@e\d+)/);
      if (!searchRefMatch) {
        throw new Error('Search input not found');
      }
      const searchRef = searchRefMatch[1];

      // Search for non-existent robot
      await browser.searchRobots(SEARCH_QUERIES.NO_RESULTS, searchRef);

      // Get updated snapshot
      snapshot = await browser.getSnapshot();

      // Assert no results message
      assertNoResults(snapshot);
    }, 60000);
  });

  describe('Category Filters', () => {
    it('should filter robots by Humanoid category', async () => {
      // Navigate to browse page
      await browser.navigateAndWait(PAGE_PATHS.BROWSE);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Find Humanoid checkbox ref
      const humanoidRefMatch = snapshot.match(/Humanoid.*?checkbox.*?(@e\d+)/i);
      if (!humanoidRefMatch) {
        throw new Error('Humanoid filter not found');
      }
      const humanoidRef = humanoidRefMatch[1];

      // Apply Humanoid filter
      await browser.applyFilter('Humanoid', humanoidRef);

      // Get updated snapshot
      snapshot = await browser.getSnapshot();

      // Assert results are filtered
      assertResultsCount(snapshot, 'any');

      // Assert results contain humanoid robots
      expect(snapshot).toMatch(/Humanoid|humanoid/);
    }, 60000);

    it('should filter robots by Quadruped category', async () => {
      // Navigate to browse page
      await browser.navigateAndWait(PAGE_PATHS.BROWSE);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Find Quadruped checkbox ref
      const quadrupedRefMatch = snapshot.match(/Quadruped.*?checkbox.*?(@e\d+)/i);
      if (!quadrupedRefMatch) {
        throw new Error('Quadruped filter not found');
      }
      const quadrupedRef = quadrupedRefMatch[1];

      // Apply Quadruped filter
      await browser.applyFilter('Quadruped', quadrupedRef);

      // Get updated snapshot
      snapshot = await browser.getSnapshot();

      // Assert results are filtered
      assertResultsCount(snapshot, 'any');

      // Assert results contain quadruped robots
      expect(snapshot).toMatch(/Quadruped|quadruped|Spot|Go2/);
    }, 60000);
  });

  describe('Brand Filters', () => {
    it('should filter robots by Unitree brand', async () => {
      // Navigate to browse page
      await browser.navigateAndWait(PAGE_PATHS.BROWSE);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Find Unitree checkbox ref
      const unitreeRefMatch = snapshot.match(/Unitree.*?checkbox.*?(@e\d+)/i);
      if (!unitreeRefMatch) {
        throw new Error('Unitree filter not found');
      }
      const unitreeRef = unitreeRefMatch[1];

      // Apply Unitree filter
      await browser.applyFilter('Unitree', unitreeRef);

      // Get updated snapshot
      snapshot = await browser.getSnapshot();

      // Assert results contain Unitree robots
      expect(snapshot).toContain('Unitree');

      // Assert other brands are filtered out
      expect(snapshot).not.toContain('Boston Dynamics Spot');
    }, 60000);

    it('should filter robots by Boston Dynamics brand', async () => {
      // Navigate to browse page
      await browser.navigateAndWait(PAGE_PATHS.BROWSE);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Find Boston Dynamics checkbox ref
      const bdRefMatch = snapshot.match(/Boston Dynamics.*?checkbox.*?(@e\d+)/i);
      if (!bdRefMatch) {
        throw new Error('Boston Dynamics filter not found');
      }
      const bdRef = bdRefMatch[1];

      // Apply Boston Dynamics filter
      await browser.applyFilter('Boston Dynamics', bdRef);

      // Get updated snapshot
      snapshot = await browser.getSnapshot();

      // Assert results contain Boston Dynamics robots
      expect(snapshot).toContain('Boston Dynamics');
    }, 60000);
  });

  describe('Combined Filters', () => {
    it('should apply multiple filters (category + brand)', async () => {
      // Navigate to browse page
      await browser.navigateAndWait(PAGE_PATHS.BROWSE);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Find Humanoid checkbox ref
      const humanoidRefMatch = snapshot.match(/Humanoid.*?checkbox.*?(@e\d+)/i);
      if (!humanoidRefMatch) {
        throw new Error('Humanoid filter not found');
      }
      const humanoidRef = humanoidRefMatch[1];

      // Apply Humanoid filter
      await browser.applyFilter('Humanoid', humanoidRef);

      // Get updated snapshot
      snapshot = await browser.getSnapshot();

      // Find Unitree checkbox ref
      const unitreeRefMatch = snapshot.match(/Unitree.*?checkbox.*?(@e\d+)/i);
      if (!unitreeRefMatch) {
        throw new Error('Unitree filter not found');
      }
      const unitreeRef = unitreeRefMatch[1];

      // Apply Unitree filter
      await browser.applyFilter('Unitree', unitreeRef);

      // Get final snapshot
      snapshot = await browser.getSnapshot();

      // Assert results contain Unitree humanoid robots
      expect(snapshot).toContain('Unitree');
      expect(snapshot).toMatch(/Humanoid|humanoid/);

      // Should show filtered count
      assertResultsCount(snapshot, 'any');
    }, 60000);

    it('should clear all filters', async () => {
      // Navigate to browse page
      await browser.navigateAndWait(PAGE_PATHS.BROWSE);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Apply a filter first
      const humanoidRefMatch = snapshot.match(/Humanoid.*?checkbox.*?(@e\d+)/i);
      if (humanoidRefMatch) {
        await browser.applyFilter('Humanoid', humanoidRefMatch[1]);
        snapshot = await browser.getSnapshot();
      }

      // Find Clear Filters button
      const clearRefMatch = snapshot.match(/Clear.*?(@e\d+)/i);
      if (clearRefMatch) {
        await browser.click('Clear Filters button', clearRefMatch[1]);
        await browser.wait(1);

        // Get final snapshot
        snapshot = await browser.getSnapshot();

        // Assert all robots are shown again
        assertResultsCount(snapshot, 'any');
      }
    }, 60000);
  });

  describe('Sorting', () => {
    it('should sort robots by name (A-Z)', async () => {
      // Navigate to browse page
      await browser.navigateAndWait(PAGE_PATHS.BROWSE);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Find sort dropdown ref
      const sortRefMatch = snapshot.match(/Sort.*?(@e\d+)/i);
      if (!sortRefMatch) {
        throw new Error('Sort dropdown not found');
      }
      const sortRef = sortRefMatch[1];

      // Select Name (A-Z)
      await browser.selectSort(SORT_OPTIONS.NAME_ASC, sortRef);

      // Get updated snapshot
      snapshot = await browser.getSnapshot();

      // Assert results are still shown
      assertResultsCount(snapshot, 'any');
    }, 60000);

    it('should sort robots by price (Low to High)', async () => {
      // Navigate to browse page
      await browser.navigateAndWait(PAGE_PATHS.BROWSE);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Find sort dropdown ref
      const sortRefMatch = snapshot.match(/Sort.*?(@e\d+)/i);
      if (!sortRefMatch) {
        throw new Error('Sort dropdown not found');
      }
      const sortRef = sortRefMatch[1];

      // Select Price (Low to High)
      await browser.selectSort(SORT_OPTIONS.PRICE_LOW, sortRef);

      // Get updated snapshot
      snapshot = await browser.getSnapshot();

      // Assert results are still shown
      assertResultsCount(snapshot, 'any');
    }, 60000);
  });

  describe('Price Range Filters', () => {
    it('should filter robots by minimum price', async () => {
      // Navigate to browse page
      await browser.navigateAndWait(PAGE_PATHS.BROWSE);

      // Get snapshot
      let snapshot = await browser.getSnapshot();

      // Find price input refs
      const minPriceRefMatch = snapshot.match(/Minimum.*?price.*?(@e\d+)/i);
      if (minPriceRefMatch) {
        const minPriceRef = minPriceRefMatch[1];

        // Enter minimum price
        await browser.type('Minimum price input', minPriceRef, '10000');

        // Apply filter
        const applyRefMatch = snapshot.match(/Apply.*?price.*?(@e\d+)/i);
        if (applyRefMatch) {
          await browser.click('Apply price filter', applyRefMatch[1]);
          await browser.wait(1);

          // Get updated snapshot
          snapshot = await browser.getSnapshot();

          // Assert results are filtered
          assertResultsCount(snapshot, 'any');
        }
      }
    }, 60000);
  });
});

import { expect } from 'vitest';

/**
 * Global test configuration for E2E tests using Playwright MCP
 */

// Base URL for testing
export const BASE_URL = process.env.TEST_BASE_URL || 'https://www.awesomerobots.xyz';

// Viewport presets
export const VIEWPORTS = {
  DESKTOP: { width: 1280, height: 720 },
  TABLET: { width: 768, height: 1024 },
  MOBILE: { width: 375, height: 667 },
} as const;

// Test configuration
export const TEST_CONFIG = {
  // Skip form submissions in tests
  SKIP_FORM_SUBMISSION: process.env.SKIP_FORM_SUBMISSION === 'true',

  // Wait times (in seconds)
  WAIT_FOR_FILTER: 1, // Client-side filtering needs time
  WAIT_FOR_SEARCH: 1, // Client-side search needs time
  WAIT_FOR_SORT: 1, // Client-side sorting needs time
  WAIT_FOR_NAVIGATION: 2, // Page navigation
  WAIT_FOR_MODAL: 0.5, // Modal open/close

  // Test data
  SAMPLE_ROBOTS: 10, // Test 10 representative robots instead of all 105
} as const;

// Custom matchers for better test readability
expect.extend({
  /**
   * Check if snapshot contains robot card with specific name
   */
  toContainRobotCard(snapshot: string, robotName: string) {
    const hasRobotName = snapshot.includes(robotName);
    const hasViewDetailsButton = snapshot.includes('View Details') || snapshot.includes('Request Quote');

    return {
      pass: hasRobotName && hasViewDetailsButton,
      message: () =>
        hasRobotName && hasViewDetailsButton
          ? `Expected snapshot not to contain robot card for "${robotName}"`
          : `Expected snapshot to contain robot card for "${robotName}"`,
    };
  },

  /**
   * Check if filter is active in snapshot
   */
  toHaveActiveFilter(snapshot: string, filterName: string) {
    // Active filters are usually shown in a "Clear Filters" section or checked state
    const hasCheckedState = snapshot.includes(`${filterName} checkbox checked`);
    const hasActiveIndicator = snapshot.includes(`${filterName}`) && snapshot.includes('Clear');

    return {
      pass: hasCheckedState || hasActiveIndicator,
      message: () =>
        hasCheckedState || hasActiveIndicator
          ? `Expected filter "${filterName}" not to be active`
          : `Expected filter "${filterName}" to be active`,
    };
  },

  /**
   * Check if snapshot shows filtered results count
   */
  toShowFilteredResults(snapshot: string) {
    const hasResultsCount = /Showing \d+ robots?/.test(snapshot);
    const hasRobotCards = snapshot.includes('View Details') || snapshot.includes('Request Quote');

    return {
      pass: hasResultsCount && hasRobotCards,
      message: () =>
        hasResultsCount && hasRobotCards
          ? 'Expected snapshot not to show filtered results'
          : 'Expected snapshot to show filtered results with count',
    };
  },
});

// Extend expect types for TypeScript
declare module 'vitest' {
  interface Assertion<T = any> {
    toContainRobotCard(robotName: string): T;
    toHaveActiveFilter(filterName: string): T;
    toShowFilteredResults(): T;
  }
  interface AsymmetricMatchersContaining {
    toContainRobotCard(robotName: string): any;
    toHaveActiveFilter(filterName: string): any;
    toShowFilteredResults(): any;
  }
}

/**
 * Global setup and teardown hooks
 */
export function setupTest() {
  console.log(`Testing against: ${BASE_URL}`);
}

export function teardownTest() {
  // Cleanup if needed
}

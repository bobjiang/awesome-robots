import { expect } from 'vitest';

/**
 * Custom assertion helpers for E2E tests
 * Provides domain-specific assertions for robot catalog testing
 */

/**
 * Assert that a robot card is present in the snapshot
 * @param snapshot - Page snapshot from browser_snapshot()
 * @param robotName - Name of the robot to check for
 */
export function assertRobotCard(snapshot: string, robotName: string): void {
  expect(snapshot).toContain(robotName);
  // Robot cards should have either "View Details" or "Request Quote" button
  const hasViewDetails = snapshot.includes('View Details');
  const hasRequestQuote = snapshot.includes('Request Quote');
  expect(hasViewDetails || hasRequestQuote).toBe(true);
}

/**
 * Assert that a robot card is NOT present in the snapshot
 * @param snapshot - Page snapshot
 * @param robotName - Name of the robot to check for
 */
export function assertRobotCardNotPresent(snapshot: string, robotName: string): void {
  expect(snapshot).not.toContain(robotName);
}

/**
 * Assert that a filter is active (checked)
 * @param snapshot - Page snapshot
 * @param filterName - Name of the filter
 */
export function assertFilterActive(snapshot: string, filterName: string): void {
  // Active filters show as "checked" in accessibility snapshot
  const filterPattern = new RegExp(`${filterName}.*checkbox.*checked`, 'i');
  expect(snapshot).toMatch(filterPattern);
}

/**
 * Assert that a filter is inactive (unchecked)
 * @param snapshot - Page snapshot
 * @param filterName - Name of the filter
 */
export function assertFilterInactive(snapshot: string, filterName: string): void {
  // Inactive filters don't have "checked" in their description
  const filterPattern = new RegExp(`${filterName}.*checkbox.*checked`, 'i');
  expect(snapshot).not.toMatch(filterPattern);
}

/**
 * Assert that the results count matches expected pattern
 * @param snapshot - Page snapshot
 * @param expectedCount - Expected count (number or 'any')
 */
export function assertResultsCount(snapshot: string, expectedCount: number | 'any'): void {
  if (expectedCount === 'any') {
    expect(snapshot).toMatch(/Showing \d+ robots?/);
  } else {
    const countPattern = new RegExp(`Showing ${expectedCount} robots?`);
    expect(snapshot).toMatch(countPattern);
  }
}

/**
 * Assert that "no results" message is shown
 * @param snapshot - Page snapshot
 */
export function assertNoResults(snapshot: string): void {
  expect(snapshot).toContain('No robots found');
}

/**
 * Assert that specific number of robot cards are present
 * @param snapshot - Page snapshot
 * @param expectedCount - Expected number of cards
 */
export function assertRobotCardCount(snapshot: string, expectedCount: number): void {
  // Count "View Details" and "Request Quote" buttons as proxy for cards
  const viewDetailsCount = (snapshot.match(/View Details/g) || []).length;
  const requestQuoteCount = (snapshot.match(/Request Quote/g) || []).length;
  const totalCards = viewDetailsCount + requestQuoteCount;

  expect(totalCards).toBe(expectedCount);
}

/**
 * Assert that a modal is open
 * @param snapshot - Page snapshot
 * @param modalTitle - Title of the modal
 */
export function assertModalOpen(snapshot: string, modalTitle: string): void {
  expect(snapshot).toContain(modalTitle);
  const hasCloseButton = snapshot.includes('Close modal') || snapshot.includes('close button');
  expect(hasCloseButton).toBe(true);
}

/**
 * Assert that a modal is closed
 * @param snapshot - Page snapshot
 * @param modalTitle - Title of the modal
 */
export function assertModalClosed(snapshot: string, modalTitle: string): void {
  expect(snapshot).not.toContain(modalTitle);
}

/**
 * Assert that a form field has an error
 * @param snapshot - Page snapshot
 * @param fieldName - Name of the field
 * @param errorMessage - Expected error message (optional)
 */
export function assertFormFieldError(snapshot: string, fieldName: string, errorMessage?: string): void {
  expect(snapshot).toContain(fieldName);
  if (errorMessage) {
    expect(snapshot).toContain(errorMessage);
  } else {
    // Generic error indicators
    expect(snapshot).toMatch(/error|required|invalid/i);
  }
}

/**
 * Assert that navigation is working
 * @param snapshot - Page snapshot after navigation
 * @param expectedPageIndicator - Text that indicates correct page
 */
export function assertNavigationSuccess(snapshot: string, expectedPageIndicator: string): void {
  expect(snapshot).toContain(expectedPageIndicator);
}

/**
 * Assert that sort is applied
 * @param snapshot - Page snapshot
 * @param sortOption - Selected sort option
 */
export function assertSortApplied(snapshot: string, sortOption: string): void {
  // Sort dropdown should show the selected option
  expect(snapshot).toContain(sortOption);
}

/**
 * Assert that price filter is applied
 * @param snapshot - Page snapshot
 * @param minPrice - Minimum price (optional)
 * @param maxPrice - Maximum price (optional)
 */
export function assertPriceFilterApplied(snapshot: string, minPrice?: number, maxPrice?: number): void {
  if (minPrice !== undefined) {
    expect(snapshot).toContain(`${minPrice}`);
  }
  if (maxPrice !== undefined) {
    expect(snapshot).toContain(`${maxPrice}`);
  }
}

/**
 * Assert that breadcrumbs are present
 * @param snapshot - Page snapshot
 * @param breadcrumbs - Array of breadcrumb texts
 */
export function assertBreadcrumbs(snapshot: string, breadcrumbs: string[]): void {
  breadcrumbs.forEach((crumb) => {
    expect(snapshot).toContain(crumb);
  });
}

/**
 * Assert that mobile menu is visible
 * @param snapshot - Page snapshot
 */
export function assertMobileMenuVisible(snapshot: string): void {
  expect(snapshot).toContain('Browse');
  expect(snapshot).toContain('Brands');
  expect(snapshot).toContain('Blog');
  const hasCloseOrMenu = snapshot.includes('Close') || snapshot.includes('menu');
  expect(hasCloseOrMenu).toBe(true);
}

/**
 * Assert that element is clickable
 * @param snapshot - Page snapshot
 * @param elementName - Name of the element
 */
export function assertElementClickable(snapshot: string, elementName: string): void {
  expect(snapshot).toContain(elementName);
  // Buttons and links should be present in accessibility tree
  expect(snapshot).toMatch(new RegExp(`${elementName}.*(button|link)`, 'i'));
}

/**
 * Assert that page has loaded completely
 * @param snapshot - Page snapshot
 */
export function assertPageLoaded(snapshot: string): void {
  // Page should not have loading indicators
  expect(snapshot).not.toContain('Loading...');
  expect(snapshot).not.toContain('loading spinner');
  // Page should have main content
  expect(snapshot.length).toBeGreaterThan(100);
}

/**
 * Assert that search results match query
 * @param snapshot - Page snapshot
 * @param query - Search query
 */
export function assertSearchResults(snapshot: string, query: string): void {
  // Results should contain the search query in some form
  const normalizedQuery = query.toLowerCase();
  const normalizedSnapshot = snapshot.toLowerCase();
  expect(normalizedSnapshot).toContain(normalizedQuery);
}

/**
 * Assert that filters can be cleared
 * @param snapshot - Page snapshot
 */
export function assertClearFiltersAvailable(snapshot: string): void {
  const hasClearOrReset = snapshot.includes('Clear') || snapshot.includes('Reset');
  expect(hasClearOrReset).toBe(true);
}

/**
 * Extract element ref from snapshot using pattern
 * @param snapshot - Page snapshot
 * @param elementPattern - Regex pattern to find element and its ref
 * @returns Element ref (e.g., "@e24") or null if not found
 */
export function extractElementRef(snapshot: string, elementPattern: RegExp): string | null {
  const match = snapshot.match(elementPattern);
  if (!match) return null;

  // Look for @eXX pattern near the matched text
  const contextStart = Math.max(0, match.index! - 50);
  const contextEnd = Math.min(snapshot.length, match.index! + match[0].length + 50);
  const context = snapshot.slice(contextStart, contextEnd);

  const refMatch = context.match(/@e\d+/);
  return refMatch ? refMatch[0] : null;
}

/**
 * Assert that element has specific ref
 * @param snapshot - Page snapshot
 * @param elementName - Name of the element
 * @param expectedRef - Expected ref (e.g., "@e24")
 */
export function assertElementRef(snapshot: string, elementName: string, expectedRef: string): void {
  const pattern = new RegExp(`${elementName}.*${expectedRef}|${expectedRef}.*${elementName}`, 'i');
  expect(snapshot).toMatch(pattern);
}

/**
 * Get all robot names from snapshot
 * @param snapshot - Page snapshot
 * @returns Array of robot names found in snapshot
 */
export function getRobotNamesFromSnapshot(snapshot: string): string[] {
  // This is a helper, not an assertion
  // Look for patterns like "Unitree G1", "Boston Dynamics Spot", etc.
  const robotNamePattern = /([A-Z][a-z]+ ?[A-Z][a-z]*[\w\d]*)/g;
  const matches = snapshot.match(robotNamePattern) || [];

  // Filter out common false positives
  const excludePatterns = ['View Details', 'Request Quote', 'Learn More', 'Read More'];
  return matches.filter((name) => !excludePatterns.includes(name));
}

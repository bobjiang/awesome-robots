/**
 * Price Utility Functions
 *
 * Centralized utilities for formatting and handling robot prices
 */

/**
 * Formats a price for display, handling multiple value types
 *
 * @param price - Price value (number, 'request', null, or undefined)
 * @returns Formatted price string
 *
 * @example
 * formatPrice(5400) // "$5,400"
 * formatPrice('request') // "Request Quote"
 * formatPrice(null) // "Request Quote"
 */
export function formatPrice(price: number | 'request' | null | undefined): string {
  if (price === 'request' || price === null || price === undefined) {
    return 'Request Quote';
  }
  return `$${price.toLocaleString()}`;
}

/**
 * Formats a price range for display
 *
 * @param min - Minimum price
 * @param max - Maximum price
 * @returns Formatted price range string
 *
 * @example
 * formatPriceRange(1600, 16000) // "$1,600 - $16,000"
 */
export function formatPriceRange(min: number, max: number): string {
  return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
}

/**
 * Checks if a price is publicly available
 *
 * @param price - Price value to check
 * @returns True if price is a number, false otherwise
 *
 * @example
 * isPriceAvailable(5400) // true
 * isPriceAvailable('request') // false
 * isPriceAvailable(null) // false
 */
export function isPriceAvailable(price: unknown): price is number {
  return typeof price === 'number' && !isNaN(price) && price > 0;
}

/**
 * Gets the lowest price from a robot's pricing models
 *
 * @param models - Array of pricing models
 * @returns Lowest price or 'request' if no numeric prices available
 *
 * @example
 * getLowestPrice([{name: 'Basic', price: 1600}, {name: 'Pro', price: 2800}]) // 1600
 */
export function getLowestPrice(
  models: Array<{ name: string; price: number | 'request' }>
): number | 'request' {
  const numericPrices = models
    .map(m => m.price)
    .filter((price): price is number => typeof price === 'number');

  if (numericPrices.length === 0) {
    return 'request';
  }

  return Math.min(...numericPrices);
}

/**
 * Compares two prices for sorting
 *
 * @param a - First price
 * @param b - Second price
 * @returns Comparison result for Array.sort()
 *
 * @example
 * robots.sort((a, b) => comparePrice(a.price.starting, b.price.starting))
 */
export function comparePrice(
  a: number | 'request' | null | undefined,
  b: number | 'request' | null | undefined
): number {
  // Convert to numbers for comparison, treating non-numbers as Infinity
  const aNum = isPriceAvailable(a) ? a : Infinity;
  const bNum = isPriceAvailable(b) ? b : Infinity;

  return aNum - bNum;
}

/**
 * Price Utility Functions
 *
 * Centralized utilities for formatting and handling robot prices
 * Enhanced with Zod runtime validation (T3 pattern)
 */

import { z } from 'zod';

/**
 * Zod schema for price values
 * Accepts number, 'request', null, or undefined
 */
export const PriceSchema = z.union([
  z.number().positive(),
  z.literal('request'),
  z.null(),
  z.undefined()
]);

export type Price = z.infer<typeof PriceSchema>;

/**
 * Zod schema for price models
 */
export const PriceModelSchema = z.object({
  name: z.string(),
  price: z.union([z.number().positive(), z.literal('request')])
});

export type PriceModel = z.infer<typeof PriceModelSchema>;

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
export function formatPrice(price: unknown): string {
  // Validate with Zod schema (runtime type checking)
  const result = PriceSchema.safeParse(price);

  if (!result.success || result.data === 'request' || result.data === null || result.data === undefined) {
    return 'Request Quote';
  }

  return `$${result.data.toLocaleString()}`;
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
  models: unknown
): number | 'request' {
  // Validate with Zod schema (runtime type checking)
  const ModelsArraySchema = z.array(PriceModelSchema);
  const result = ModelsArraySchema.safeParse(models);

  if (!result.success) {
    console.warn('Invalid price models data:', result.error);
    return 'request';
  }

  const numericPrices = result.data
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
  a: unknown,
  b: unknown
): number {
  // Validate with Zod schema (runtime type checking)
  const aResult = PriceSchema.safeParse(a);
  const bResult = PriceSchema.safeParse(b);

  // Convert to numbers for comparison, treating invalid/non-numbers as Infinity
  const aNum = (aResult.success && isPriceAvailable(aResult.data)) ? aResult.data : Infinity;
  const bNum = (bResult.success && isPriceAvailable(bResult.data)) ? bResult.data : Infinity;

  return aNum - bNum;
}

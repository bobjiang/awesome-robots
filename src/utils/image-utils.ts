/**
 * Image Utility Functions
 *
 * Utilities for handling robot images, including remote and local sources
 * Enhanced with Zod runtime validation (T3 pattern)
 */

import { z } from 'zod';

/**
 * Zod schema for image URL (remote or local)
 */
export const ImageUrlSchema = z.string().refine((url) => {
  if (url.startsWith('/')) return true; // Local path
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}, {
  message: 'Invalid image URL format'
});

export type ImageUrl = z.infer<typeof ImageUrlSchema>;

/**
 * Zod schema for category names
 */
export const CategorySchema = z.enum(['humanoid', 'quadruped', 'accessory', 'other']);

export type Category = z.infer<typeof CategorySchema>;

/**
 * Checks if an image URL is from a remote source
 *
 * @param url - Image URL to check
 * @returns True if URL is remote (starts with http/https)
 *
 * @example
 * isRemoteImage('https://cdn.example.com/robot.jpg') // true
 * isRemoteImage('/images/robot.jpg') // false
 */
export function isRemoteImage(url: unknown): boolean {
  const result = ImageUrlSchema.safeParse(url);
  if (!result.success) return false;

  return result.data.startsWith('http://') || result.data.startsWith('https://');
}

/**
 * Gets fallback image for a robot category
 *
 * @param category - Robot category
 * @returns Path to fallback category image
 *
 * @example
 * getCategoryFallbackImage('humanoid') // '/images/categories/humanoid.png'
 */
export function getCategoryFallbackImage(category: string): string {
  const categoryImages: Record<string, string> = {
    'humanoid': '/images/categories/humanoid.png',
    'quadruped': '/images/categories/quadruped.png',
    'accessory': '/images/categories/accessories.png',
  };

  return categoryImages[category] || '/images/categories/other.svg';
}

/**
 * Gets the first available image for a robot
 *
 * @param images - Array of image URLs
 * @param category - Robot category (for fallback)
 * @returns Image URL or category fallback
 *
 * @example
 * getFirstImage(['https://cdn.example.com/robot.jpg'], 'humanoid')
 * // 'https://cdn.example.com/robot.jpg'
 */
export function getFirstImage(images: unknown, category: unknown): string {
  // Validate with Zod schema (runtime type checking)
  const ImagesArraySchema = z.array(z.string()).optional().nullable();
  const imagesResult = ImagesArraySchema.safeParse(images);

  if (imagesResult.success && imagesResult.data && imagesResult.data.length > 0) {
    // Validate first image URL
    const firstImageResult = ImageUrlSchema.safeParse(imagesResult.data[0]);
    if (firstImageResult.success) {
      return firstImageResult.data;
    }
  }

  // Fallback to category image
  const categoryResult = z.string().safeParse(category);
  return getCategoryFallbackImage(categoryResult.success ? categoryResult.data : 'other');
}

/**
 * Generates optimized image URL with Next.js loader
 * Note: This is a placeholder for future image optimization logic
 *
 * @param url - Original image URL
 * @param width - Desired width
 * @returns Optimized image URL
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getOptimizedImageUrl(url: string, width: number): string {
  // For now, return the original URL
  // Future: Implement image optimization/resizing logic
  return url;
}

/**
 * Validates image URL format
 *
 * @param url - Image URL to validate
 * @returns True if URL appears valid
 *
 * @example
 * isValidImageUrl('https://cdn.example.com/robot.jpg') // true
 * isValidImageUrl('invalid') // false
 */
export function isValidImageUrl(url: unknown): boolean {
  // Validate with Zod schema (runtime type checking)
  const result = ImageUrlSchema.safeParse(url);
  return result.success;
}

/**
 * Gets image alt text for SEO
 *
 * @param robotName - Name of the robot
 * @param robotBrand - Brand/manufacturer name
 * @param imageIndex - Index of the image (optional)
 * @returns Alt text string
 *
 * @example
 * getImageAltText('Go2', 'Unitree', 0) // 'Unitree Go2 - Image 1'
 */
export function getImageAltText(
  robotName: unknown,
  robotBrand: unknown,
  imageIndex?: unknown
): string {
  // Validate with Zod schema (runtime type checking)
  const nameResult = z.string().min(1).safeParse(robotName);
  const brandResult = z.string().min(1).safeParse(robotBrand);
  const indexResult = z.number().int().nonnegative().optional().safeParse(imageIndex);

  const name = nameResult.success ? nameResult.data : 'Robot';
  const brand = brandResult.success ? brandResult.data : 'Unknown Brand';
  const base = `${brand} ${name}`;

  if (indexResult.success && typeof indexResult.data === 'number') {
    return `${base} - Image ${indexResult.data + 1}`;
  }
  return base;
}

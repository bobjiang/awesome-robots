/**
 * Image Utility Functions
 *
 * Utilities for handling robot images, including remote and local sources
 */

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
export function isRemoteImage(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
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
export function getFirstImage(images: string[], category: string): string {
  if (images && images.length > 0) {
    return images[0];
  }
  return getCategoryFallbackImage(category);
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
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Check if it's a valid HTTP(S) URL or local path
  if (url.startsWith('/')) {
    return true;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
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
  robotName: string,
  robotBrand: string,
  imageIndex?: number
): string {
  const base = `${robotBrand} ${robotName}`;
  if (typeof imageIndex === 'number') {
    return `${base} - Image ${imageIndex + 1}`;
  }
  return base;
}

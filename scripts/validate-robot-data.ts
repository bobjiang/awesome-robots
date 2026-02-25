#!/usr/bin/env node

/**
 * Validate robot data against schemas and check for consistency.
 *
 * Single source of truth for Robot shape: src/lib/robot-schema.ts
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { RobotsSchema } from '../src/lib/robot-schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROBOTS_PATH = path.join(__dirname, '../src/data/robots.json');
const BRANDS_PATH = path.join(__dirname, '../src/data/brands.json');
const CATEGORIES_PATH = path.join(__dirname, '../src/data/categories.json');

function loadJsonFile<T = unknown>(filePath: string): T {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content) as T;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`Error loading ${path.basename(filePath)}:`, msg);
    process.exit(1);
  }
}

function validateRobotData(
  robots: z.infer<typeof RobotsSchema>,
  brands: Array<{ id: string; name: string }>,
  categories: Array<{ id: string }>
) {
  const errors: string[] = [];
  const brandIds = new Set(brands.map(b => b.id));
  const categoryIds = new Set(categories.map(c => c.id));
  const robotIds = new Set<string>();

  robots.forEach((robot) => {
    // Duplicate IDs
    if (robotIds.has(robot.id)) {
      errors.push(`Duplicate robot ID: ${robot.id}`);
    } else {
      robotIds.add(robot.id);
    }

    // Validate brand exists
    const normalizedBrandId = robot.brand.toLowerCase().replace(/\s+/g, '-');
    if (robot.brand && !brandIds.has(normalizedBrandId)) {
      const brandExists = brands.some(b =>
        b.name.toLowerCase() === robot.brand.toLowerCase() ||
        b.id === normalizedBrandId
      );
      if (!brandExists) {
        errors.push(`Robot ${robot.id}: Brand "${robot.brand}" not found in brands.json`);
      }
    }

    // Validate category exists
    if (robot.category && !categoryIds.has(robot.category)) {
      errors.push(`Robot ${robot.id}: Category "${robot.category}" not found in categories.json`);
    }

    // Check image paths
    robot.images.forEach((image, imgIndex) => {
      if (typeof image !== 'string') {
        errors.push(`Robot ${robot.id}: Image ${imgIndex} must be a string`);
      } else if (image.startsWith('/') && !image.startsWith('http')) {
        const imagePath = path.join(__dirname, '../public', image);
        if (!fs.existsSync(imagePath)) {
          errors.push(`Robot ${robot.id}: Local image not found: ${image}`);
        }
      }
    });
  });

  return errors;
}

function checkBrandConsistency(brands: Array<any>) {
  const errors: string[] = [];
  const brandIds = new Set<string>();

  brands.forEach((brand, index) => {
    const required = ['id', 'name', 'description', 'website', 'logo'] as const;
    required.forEach((field) => {
      if (!brand[field]) {
        errors.push(`Brand ${index} (${brand.id || 'unknown'}): Missing required field: ${field}`);
      }
    });

    if (brandIds.has(brand.id)) {
      errors.push(`Duplicate brand ID: ${brand.id}`);
    } else {
      brandIds.add(brand.id);
    }

    if (brand.website && !String(brand.website).match(/^https?:\/\/.+/)) {
      errors.push(`Brand ${brand.id}: Invalid website URL format`);
    }

    if (brand.logo && String(brand.logo).startsWith('/')) {
      const logoPath = path.join(__dirname, '../public', brand.logo);
      if (!fs.existsSync(logoPath)) {
        errors.push(`Brand ${brand.id}: Logo file not found: ${brand.logo}`);
      }
    }

    if (brand.imagePatterns && Array.isArray(brand.imagePatterns)) {
      brand.imagePatterns.forEach((pattern: any, patternIndex: number) => {
        if (!pattern.hostname) {
          errors.push(`Brand ${brand.id}: Image pattern ${patternIndex} missing hostname`);
        }
        if (!pattern.pathname) {
          errors.push(`Brand ${brand.id}: Image pattern ${patternIndex} missing pathname`);
        }
      });
    }
  });

  return errors;
}

function generateReport(
  robots: z.infer<typeof RobotsSchema>,
  brands: any[],
  categories: any[],
  errors: string[]
) {
  console.log('\n📊 VALIDATION REPORT');
  console.log('===================');
  console.log(`Robots: ${robots.length}`);
  console.log(`Brands: ${brands.length}`);
  console.log(`Categories: ${categories.length}`);

  const categoryStats: Record<string, number> = {};
  robots.forEach((robot) => {
    categoryStats[robot.category] = (categoryStats[robot.category] || 0) + 1;
  });

  console.log('\nRobots by category:');
  Object.entries(categoryStats).forEach(([category, count]) => {
    console.log(`  ${category}: ${count}`);
  });

  const brandStats: Record<string, number> = {};
  robots.forEach((robot) => {
    brandStats[robot.brand] = (brandStats[robot.brand] || 0) + 1;
  });

  console.log('\nTop brands by robot count:');
  Object.entries(brandStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .forEach(([brand, count]) => {
      console.log(`  ${brand}: ${count}`);
    });

  if (errors.length === 0) {
    console.log('\n✅ All validations passed!');
  } else {
    console.log(`\n❌ Found ${errors.length} validation errors:`);
    errors.forEach((error) => {
      console.log(`  ${error}`);
    });
  }
}

function main() {
  console.log('🔍 Starting robot data validation...');

  const robotsRaw = loadJsonFile(ROBOTS_PATH);
  const robotsParsed = RobotsSchema.safeParse(robotsRaw);

  if (!robotsParsed.success) {
    console.error('❌ robots.json failed schema validation');
    console.error(robotsParsed.error.format());
    process.exit(1);
  }

  const robots = robotsParsed.data;
  const brands = loadJsonFile<any[]>(BRANDS_PATH);
  const categories = loadJsonFile<any[]>(CATEGORIES_PATH);

  console.log(`📁 Loaded ${robots.length} robots, ${brands.length} brands, ${categories.length} categories`);

  const robotErrors = validateRobotData(robots, brands, categories);
  const brandErrors = checkBrandConsistency(brands);
  const allErrors = [...robotErrors, ...brandErrors];

  generateReport(robots, brands, categories, allErrors);

  if (allErrors.length > 0) {
    process.exit(1);
  }
}

main();

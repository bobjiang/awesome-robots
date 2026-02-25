#!/usr/bin/env node

/**
 * Validate robot data against schemas and check for consistency
 */

const fs = require('fs');
const path = require('path');

const ROBOTS_PATH = path.join(__dirname, '../src/data/robots.json');
const BRANDS_PATH = path.join(__dirname, '../src/data/brands.json');
const CATEGORIES_PATH = path.join(__dirname, '../src/data/categories.json');

function loadJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading ${path.basename(filePath)}:`, error.message);
    process.exit(1);
  }
}

function validateRobotSchema(robot) {
  const errors = [];
  const required = ['id', 'name', 'brand', 'category', 'price', 'specifications', 'features', 'images', 'officialUrl', 'description'];

  required.forEach(field => {
    if (!robot[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Validate price structure
  if (robot.price) {
    if (typeof robot.price.starting !== 'number' && robot.price.starting !== 'request') {
      errors.push('Price starting must be a number or "request"');
    }
    if (!robot.price.currency) {
      errors.push('Price currency is required');
    }
    if (!Array.isArray(robot.price.models)) {
      errors.push('Price models must be an array');
    }
  }

  // Validate arrays
  ['features', 'images'].forEach(field => {
    if (robot[field] && !Array.isArray(robot[field])) {
      errors.push(`${field} must be an array`);
    }
  });

  // Validate category
  if (robot.category && !['humanoid', 'quadruped', 'accessory', 'other'].includes(robot.category)) {
    errors.push(`Invalid category: ${robot.category}`);
  }

  return errors;
}

function validateRobotData(robots, brands, categories) {
  const errors = [];
  const brandIds = new Set(brands.map(b => b.id));
  const categoryIds = new Set(categories.map(c => c.id));
  const robotIds = new Set();

  robots.forEach((robot, index) => {
    const robotErrors = validateRobotSchema(robot);

    if (robotErrors.length > 0) {
      errors.push(`Robot ${index} (${robot.id || 'unknown'}):`, ...robotErrors.map(e => `  - ${e}`));
    }

    // Check for duplicate IDs
    if (robotIds.has(robot.id)) {
      errors.push(`Duplicate robot ID: ${robot.id}`);
    } else {
      robotIds.add(robot.id);
    }

    // Validate brand exists
    if (robot.brand && !brandIds.has(robot.brand.toLowerCase().replace(/\s+/g, '-'))) {
      // Try to find brand by name instead of ID
      const brandExists = brands.some(b =>
        b.name.toLowerCase() === robot.brand.toLowerCase() ||
        b.id === robot.brand.toLowerCase().replace(/\s+/g, '-')
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
    if (robot.images && Array.isArray(robot.images)) {
      robot.images.forEach((image, imgIndex) => {
        if (typeof image !== 'string') {
          errors.push(`Robot ${robot.id}: Image ${imgIndex} must be a string`);
        } else if (image.startsWith('/') && !image.startsWith('http')) {
          // Check if local image file exists
          const imagePath = path.join(__dirname, '../public', image);
          if (!fs.existsSync(imagePath)) {
            errors.push(`Robot ${robot.id}: Local image not found: ${image}`);
          }
        }
      });
    }
  });

  return errors;
}

function checkBrandConsistency(brands) {
  const errors = [];
  const brandIds = new Set();

  brands.forEach((brand, index) => {
    // Check required fields
    const required = ['id', 'name', 'description', 'website'];
    required.forEach(field => {
      if (!brand[field]) {
        errors.push(`Brand ${index} (${brand.id || 'unknown'}): Missing required field: ${field}`);
      }
    });

    // Check for duplicate IDs
    if (brandIds.has(brand.id)) {
      errors.push(`Duplicate brand ID: ${brand.id}`);
    } else {
      brandIds.add(brand.id);
    }

    // Validate website URL
    if (brand.website && !brand.website.match(/^https?:\/\/.+/)) {
      errors.push(`Brand ${brand.id}: Invalid website URL format`);
    }

    // Validate imagePatterns structure if present
    if (brand.imagePatterns && Array.isArray(brand.imagePatterns)) {
      brand.imagePatterns.forEach((pattern, patternIndex) => {
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

function generateReport(robots, brands, categories, errors) {
  console.log('\n📊 VALIDATION REPORT');
  console.log('===================');
  console.log(`Robots: ${robots.length}`);
  console.log(`Brands: ${brands.length}`);
  console.log(`Categories: ${categories.length}`);

  // Count robots by category
  const categoryStats = {};
  robots.forEach(robot => {
    categoryStats[robot.category] = (categoryStats[robot.category] || 0) + 1;
  });

  console.log('\nRobots by category:');
  Object.entries(categoryStats).forEach(([category, count]) => {
    console.log(`  ${category}: ${count}`);
  });

  // Count robots by brand
  const brandStats = {};
  robots.forEach(robot => {
    brandStats[robot.brand] = (brandStats[robot.brand] || 0) + 1;
  });

  console.log('\nTop brands by robot count:');
  Object.entries(brandStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .forEach(([brand, count]) => {
      console.log(`  ${brand}: ${count}`);
    });

  if (errors.length === 0) {
    console.log('\n✅ All validations passed!');
  } else {
    console.log(`\n❌ Found ${errors.length} validation errors:`);
    errors.forEach(error => {
      console.log(`  ${error}`);
    });
  }
}

function main() {
  console.log('🔍 Starting robot data validation...');

  const robots = loadJsonFile(ROBOTS_PATH);
  const brands = loadJsonFile(BRANDS_PATH);
  const categories = loadJsonFile(CATEGORIES_PATH);

  console.log(`📁 Loaded ${robots.length} robots, ${brands.length} brands, ${categories.length} categories`);

  const robotErrors = validateRobotData(robots, brands, categories);
  const brandErrors = checkBrandConsistency(brands);

  const allErrors = [...robotErrors, ...brandErrors];

  generateReport(robots, brands, categories, allErrors);

  if (allErrors.length > 0) {
    process.exit(1);
  }
}

// Run script if called directly
if (require.main === module) {
  main();
}

module.exports = { validateRobotSchema, validateRobotData, checkBrandConsistency };
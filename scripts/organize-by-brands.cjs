#!/usr/bin/env node

/**
 * Organize robot data by brands for better scalability
 * This script creates brand-specific directories and can split robot data
 */

const fs = require('fs');
const path = require('path');

const ROBOTS_PATH = path.join(__dirname, '../src/data/robots.json');
const BRANDS_PATH = path.join(__dirname, '../src/data/brands.json');
const BRANDS_DIR = path.join(__dirname, '../src/data/brands');
const IMAGES_DIR = path.join(__dirname, '../public/images/robots');

function loadJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading ${path.basename(filePath)}:`, error.message);
    process.exit(1);
  }
}

function createBrandDirectories(brands) {
  console.log('📁 Creating brand directories...');

  // Create brands data directory
  if (!fs.existsSync(BRANDS_DIR)) {
    fs.mkdirSync(BRANDS_DIR, { recursive: true });
    console.log(`  Created: ${BRANDS_DIR}`);
  }

  // Create image directories for each brand
  brands.forEach(brand => {
    const brandSlug = brand.id;
    const brandImageDir = path.join(IMAGES_DIR, brandSlug);

    if (!fs.existsSync(brandImageDir)) {
      fs.mkdirSync(brandImageDir, { recursive: true });
      console.log(`  Created: ${brandImageDir}`);
    }
  });
}

function groupRobotsByBrand(robots) {
  const robotsByBrand = {};

  robots.forEach(robot => {
    const brandSlug = robot.brand.toLowerCase().replace(/\s+/g, '-');
    if (!robotsByBrand[brandSlug]) {
      robotsByBrand[brandSlug] = [];
    }
    robotsByBrand[brandSlug].push(robot);
  });

  return robotsByBrand;
}

function createBrandDataFiles(robotsByBrand, brands) {
  console.log('📄 Creating brand-specific data files...');

  Object.entries(robotsByBrand).forEach(([brandSlug, robots]) => {
    const brand = brands.find(b => b.id === brandSlug);

    if (!brand) {
      console.warn(`⚠️  Brand not found for slug: ${brandSlug}`);
      return;
    }

    const brandData = {
      brand: brand,
      robots: robots,
      metadata: {
        totalRobots: robots.length,
        categories: [...new Set(robots.map(r => r.category))],
        lastUpdated: new Date().toISOString(),
      }
    };

    const brandFilePath = path.join(BRANDS_DIR, `${brandSlug}.json`);
    fs.writeFileSync(brandFilePath, JSON.stringify(brandData, null, 2));
    console.log(`  Created: ${brandFilePath} (${robots.length} robots)`);
  });
}

function createIndexFile(robotsByBrand, brands) {
  console.log('📊 Creating brands index file...');

  const brandsIndex = brands.map(brand => {
    const brandRobots = robotsByBrand[brand.id] || [];
    return {
      ...brand,
      stats: {
        totalRobots: brandRobots.length,
        categories: [...new Set(brandRobots.map(r => r.category))],
        priceRange: {
          min: Math.min(...brandRobots.map(r => typeof r.price.starting === 'number' ? r.price.starting : 999999)),
          max: Math.max(...brandRobots.map(r => typeof r.price.starting === 'number' ? r.price.starting : 0)),
        }
      }
    };
  });

  const indexFilePath = path.join(BRANDS_DIR, 'index.json');
  fs.writeFileSync(indexFilePath, JSON.stringify(brandsIndex, null, 2));
  console.log(`  Created: ${indexFilePath}`);
}

function generateReadme() {
  const readmeContent = `# Brand-Organized Robot Data

This directory contains robot data organized by brand for better scalability and maintainability.

## Structure

- \`index.json\` - Overview of all brands with statistics
- \`{brand-slug}.json\` - Individual brand files containing:
  - Brand information
  - All robots for that brand
  - Metadata and statistics

## Usage

\`\`\`typescript
// Load all brands with stats
import brandsIndex from '@/data/brands/index.json';

// Load specific brand data
import unitreeData from '@/data/brands/unitree.json';
\`\`\`

## Maintenance

Run \`npm run organize-brands\` to regenerate this structure when robot data changes.

Generated on: ${new Date().toISOString()}
`;

  const readmePath = path.join(BRANDS_DIR, 'README.md');
  fs.writeFileSync(readmePath, readmeContent);
  console.log(`  Created: ${readmePath}`);
}

function main() {
  console.log('🚀 Starting brand organization...');

  const robots = loadJsonFile(ROBOTS_PATH);
  const brands = loadJsonFile(BRANDS_PATH);

  console.log(`📊 Processing ${robots.length} robots across ${brands.length} brands`);

  // Create directory structure
  createBrandDirectories(brands);

  // Group robots by brand
  const robotsByBrand = groupRobotsByBrand(robots);

  // Create brand-specific data files
  createBrandDataFiles(robotsByBrand, brands);

  // Create brands index
  createIndexFile(robotsByBrand, brands);

  // Generate README
  generateReadme();

  console.log('✅ Brand organization completed successfully!');
  console.log(`\n📁 Created ${Object.keys(robotsByBrand).length} brand data files`);
  console.log('💡 Consider updating imports to use brand-specific files for better performance');
}

// Run script if called directly
if (require.main === module) {
  main();
}

module.exports = { groupRobotsByBrand, createBrandDirectories };
#!/usr/bin/env node

/**
 * Auto-generate next.config.js image patterns from brands.json
 * This script reads brand configurations and updates the Next.js image patterns
 */

const fs = require('fs');
const path = require('path');

const BRANDS_PATH = path.join(__dirname, '../src/data/brands.json');
const NEXT_CONFIG_PATH = path.join(__dirname, '../next.config.js');

function loadBrands() {
  try {
    const brandsData = fs.readFileSync(BRANDS_PATH, 'utf8');
    return JSON.parse(brandsData);
  } catch (error) {
    console.error('Error loading brands.json:', error.message);
    process.exit(1);
  }
}

function generateImagePatterns(brands) {
  const patterns = [];

  brands.forEach(brand => {
    if (brand.imagePatterns && Array.isArray(brand.imagePatterns)) {
      brand.imagePatterns.forEach(pattern => {
        patterns.push({
          protocol: pattern.protocol || 'https',
          hostname: pattern.hostname,
          port: pattern.port || '',
          pathname: pattern.pathname,
        });
      });
    }
  });

  return patterns;
}

function updateNextConfig(patterns) {
  try {
    let configContent = fs.readFileSync(NEXT_CONFIG_PATH, 'utf8');

    // Find the remotePatterns array in the config
    const remotePatternStart = configContent.indexOf('remotePatterns: [');
    const remotePatternEnd = configContent.indexOf('],', remotePatternStart) + 2;

    if (remotePatternStart === -1 || remotePatternEnd === -1) {
      throw new Error('Could not find remotePatterns array in next.config.js');
    }

    // Generate new patterns string
    const patternsString = patterns.map(pattern => {
      return `      {
        protocol: '${pattern.protocol}',
        hostname: '${pattern.hostname}',
        port: '${pattern.port}',
        pathname: '${pattern.pathname}',
      }`;
    }).join(',\n');

    const newRemotePatterns = `remotePatterns: [
${patternsString},
    ]`;

    // Replace the old patterns with new ones
    const beforePatterns = configContent.substring(0, remotePatternStart);
    const afterPatterns = configContent.substring(remotePatternEnd);

    const newConfigContent = beforePatterns + newRemotePatterns + afterPatterns;

    fs.writeFileSync(NEXT_CONFIG_PATH, newConfigContent);
    console.log(`✅ Updated next.config.js with ${patterns.length} image patterns`);

  } catch (error) {
    console.error('Error updating next.config.js:', error.message);
    process.exit(1);
  }
}

function validatePatterns(patterns) {
  const uniquePatterns = new Set();
  const duplicates = [];

  patterns.forEach(pattern => {
    const key = `${pattern.hostname}${pattern.pathname}`;
    if (uniquePatterns.has(key)) {
      duplicates.push(key);
    } else {
      uniquePatterns.add(key);
    }
  });

  if (duplicates.length > 0) {
    console.warn('⚠️  Duplicate patterns found:', duplicates);
  }

  console.log(`📊 Processed ${patterns.length} unique image patterns from ${patterns.length} brand configs`);
}

function main() {
  console.log('🚀 Starting image pattern update...');

  const brands = loadBrands();
  console.log(`📁 Loaded ${brands.length} brands from brands.json`);

  const patterns = generateImagePatterns(brands);
  validatePatterns(patterns);

  // Create backup of current config
  const backupPath = `${NEXT_CONFIG_PATH}.backup.${Date.now()}`;
  fs.copyFileSync(NEXT_CONFIG_PATH, backupPath);
  console.log(`💾 Created backup: ${path.basename(backupPath)}`);

  updateNextConfig(patterns);

  console.log('✨ Image pattern update completed successfully!');
}

// Run script if called directly
if (require.main === module) {
  main();
}

module.exports = { generateImagePatterns, validatePatterns };
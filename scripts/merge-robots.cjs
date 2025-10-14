const fs = require('fs');
const path = require('path');

// File paths
const existingRobotsPath = path.join(__dirname, '../src/data/robots.json');
const newRobotsPath = path.join(__dirname, '../src/data/new-robots-batch-1.json');
const outputPath = path.join(__dirname, '../src/data/robots.json');

try {
  // Read existing robots
  console.log('Reading existing robots...');
  const existingRobots = JSON.parse(fs.readFileSync(existingRobotsPath, 'utf8'));
  console.log(`Found ${existingRobots.length} existing robots`);

  // Read new robots
  console.log('Reading new robots...');
  const newRobots = JSON.parse(fs.readFileSync(newRobotsPath, 'utf8'));
  console.log(`Found ${newRobots.length} new robots to add`);

  // Check for duplicate IDs
  const existingIds = new Set(existingRobots.map(r => r.id));
  const duplicates = newRobots.filter(r => existingIds.has(r.id));

  if (duplicates.length > 0) {
    console.warn(`Warning: Found ${duplicates.length} duplicate IDs:`, duplicates.map(r => r.id));
  }

  // Merge robots
  const mergedRobots = [...existingRobots, ...newRobots];
  console.log(`Total robots after merge: ${mergedRobots.length}`);

  // Write merged file
  console.log('Writing merged robots.json...');
  fs.writeFileSync(outputPath, JSON.stringify(mergedRobots, null, 2), 'utf8');
  console.log('✓ Successfully merged robots!');

  // Display brand summary
  const brands = {};
  mergedRobots.forEach(r => {
    brands[r.brand] = (brands[r.brand] || 0) + 1;
  });

  console.log('\nRobots by brand:');
  Object.entries(brands).sort((a, b) => b[1] - a[1]).forEach(([brand, count]) => {
    console.log(`  ${brand}: ${count} robot(s)`);
  });

} catch (error) {
  console.error('Error merging robots:', error.message);
  process.exit(1);
}

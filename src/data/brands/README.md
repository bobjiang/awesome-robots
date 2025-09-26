# Brand-Organized Robot Data

This directory contains robot data organized by brand for better scalability and maintainability.

## Structure

- `index.json` - Overview of all brands with statistics
- `{brand-slug}.json` - Individual brand files containing:
  - Brand information
  - All robots for that brand
  - Metadata and statistics

## Usage

```typescript
// Load all brands with stats
import brandsIndex from '@/data/brands/index.json';

// Load specific brand data
import unitreeData from '@/data/brands/unitree.json';
```

## Maintenance

Run `npm run organize-brands` to regenerate this structure when robot data changes.

Generated on: 2025-09-25T04:47:42.327Z

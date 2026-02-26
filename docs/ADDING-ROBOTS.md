# Adding Robots, Brands, and Content

This document covers the detailed procedures for adding new robots, brands, and blog content to the Awesome Robots catalog.

---

## Adding New Robots

### Automated Discovery (Preferred)

New robots are discovered weekly through the automated system (see [WORKFLOWS.md](WORKFLOWS.md)). When processing discoveries:

1. **Research specifications** from official websites using Task tool
2. **Download ALL images locally** to `public/images/robots/[brand]-[model]/`
   - Never use remote URLs in `robots.json`
   - Use curl or browser to download high-res images
   - Name files sequentially: `robot-1.jpg`, `robot-2.jpg`, etc.
3. **Add complete specifications** following `RobotDetailTemplate.tsx` schema
   - All fields required: generalInfo, keyFeatures, hardwareBuildQuality, softwareEcosystem, supplierReliability
   - Minimum 12 keyFeatures bullet points
   - Include dimensions with standing height and weight
4. **Update `src/data/brands.json`** if introducing a new brand
5. **Add to `src/data/robots.json`** with complete data
6. Robot automatically appears in sitemap and relevant category pages

### Manual Addition

For robots not from automated discovery:
1. Research official website for complete specifications
2. Follow same process as automated discovery above
3. Ensure all required fields from `Robot` interface are complete

---

## Critical Best Practices

### 1. Always Download Images Locally

**DO NOT** use remote image URLs in `robots.json`. Always:
```bash
# Create directory
mkdir -p public/images/robots/[brand]-[model]

# Download image
curl -L "https://example.com/robot.jpg" -o public/images/robots/[brand]-[model]/robot-1.jpg

# Use local path in robots.json
"images": ["/images/robots/[brand]-[model]/robot-1.jpg"]
```

**Why?** Local images ensure:
- Faster load times with Next.js optimization
- No broken images if external sites change
- Full control over image quality and format
- Better SEO with local assets

### 2. Complete Specifications Required

Every robot entry MUST include all fields from `RobotDetailTemplate.tsx`:
- `generalInfo`: manufacturer, modelName, dimensions (standing height, weight)
- `keyFeatures`: Array of 12+ bullet points
- `hardwareBuildQuality`: DOF, payload, battery, sensors, interfaces
- `softwareEcosystem`: ROS support, SDK languages, AI frameworks, documentation quality
- `supplierReliability`: warranty, post-sales support, track record
- `specifications`: Detailed technical specs (processors, speed, etc.)
- `features`: Short feature list for cards
- `images`: Array of local image paths
- `officialUrl`: Official product/company website
- `description`: 2-3 sentence summary

### 3. Research Official Sources

Before adding a robot, visit the official website to gather:
- High-resolution product images
- Complete technical specifications
- Pricing information
- Company background and founding year
- Warranty and support details

Use the Task tool with Explore subagent to research specifications:
```
Use Task tool: "Research complete specifications for [Robot Name]
from [official-website.com]"
```

---

## Adding New Brands

1. Add brand to `src/data/brands.json` with logo and description
2. Add logo SVG to `public/images/brands/`
3. Add remote image patterns to `next.config.js` if needed
4. Brand page is automatically generated at `/brands/[brand-id]`
5. Add brand link to the footer

---

## Content Creation Workflow

1. Create markdown files in `content/blog/` with proper frontmatter
2. Follow the schema defined in `velite.config.ts`
3. Required fields: `title`, `date`, `author`, `category`, `tags`, `excerpt`
4. Content is automatically processed and type-checked during build
5. Use subdirectories for specific content types: `comparisons/` for robot comparisons, `guides/` for buying guides

### Blog Content Types
- **Daily posts**: News and industry updates published to `content/blog/` root
- **Weekly digests**: Auto-generated summaries named `awesome-robots-digest-issue-N.md`
- **Comparisons**: Robot head-to-head comparisons in `content/blog/comparisons/`
- **Guides**: Buying guides and comprehensive guides in `content/blog/guides/`

### Cross-Publishing to Dev.to
```bash
npm run publish-blog              # Interactive CLI for publishing
```
The script uses `src/utils/devto-client.ts` and `src/utils/blog-converter.ts` to convert and publish posts.

---

## Community Robot Submissions

Users can submit new robots via GitHub Issue template:
- **Issue template**: `.github/ISSUE_TEMPLATE/new-robot.yml`
- **UI**: "Submit Robot" button in site header (desktop + mobile)
- Template collects all fields matching `RobotDetailTemplate.tsx` schema
- Submissions are reviewed manually before being added to the catalog

---

## Data File Structures

### Collected Articles (`data/collected-articles/YYYY-MM-DD.json`)
```json
{
  "fetch_date": "2026-01-09T10:00:00.000Z",
  "week_range": "Jan 2-8",
  "sources": {
    "ieee": [...],
    "robotreport": [...],
    "arxiv": [...]
  },
  "summary": {
    "total_articles": 24,
    "ieee_count": 0,
    "robotreport_count": 15,
    "arxiv_count": 9
  }
}
```

### Discovered Robots (`data/discovered-robots/YYYY-MM-DD.json`)
```json
{
  "fetch_date": "2026-01-09T00:30:00.000Z",
  "week_range": "Jan 2-8",
  "summary": {
    "total_discovered": 6,
    "duplicates_filtered": 1,
    "new_robots": 5,
    "quality_breakdown": {"high": 3, "medium": 2, "low": 0}
  },
  "robots": [
    {
      "company": "Company Name",
      "robot_name": "Robot Model",
      "type": "humanoid",
      "status": "commercial",
      "confidence_score": 95,
      "quality_score": {
        "overall": 92,
        "completeness": 100,
        "reliability": 80,
        "flags": []
      }
    }
  ]
}
```

### Type Definitions

See `src/types/discovered-robot.ts` for complete TypeScript interfaces:
- `DiscoveredRobot`: Individual robot discovery data
- `QualityScore`: Quality assessment metrics
- `QualityFlag`: Data completeness flags
- `FetchResult`: Complete fetch operation result
- `FetchError`: Error tracking structure

---

**Last Updated**: 2026-02-26

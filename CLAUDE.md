# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **awesome-robots** project - a catalog website for AI-powered robots including humanoids, quadrupeds, and accessories. The project is a production Next.js application with comprehensive content management and SEO optimization.

Key characteristics:
- Next.js 15.4.6 with App Router and TypeScript
- Static site generation with client-side filtering and search
- Quotation-based sales model using FormBold integration
- Educational blog powered by Velite markdown processor
- Comprehensive SEO optimization with dynamic sitemaps
- Target audience: researchers, educators, hobbyists, tech enthusiasts

## Development Commands

### Core Development
```bash
npm run dev        # Start development server (uses --turbopack)
npm run build      # Build production application
npm run start      # Start production server
npm run lint       # Run ESLint for code quality
```

### Robot Discovery
```bash
npm run fetch-articles              # Collect articles from RSS/arXiv (runs weekly via GitHub Actions)
npm run fetch-articles -- --dry-run # Preview without saving
```

### Content Management
The project uses **Velite** for markdown-based content:
- Blog posts are in `content/blog/` and auto-processed during build
- Authors are in `content/authors/` 
- Content is compiled to `.velite/` directory with full type safety

### Testing and Quality
- Run `npm run lint` before commits to ensure code quality
- Build process includes Velite content compilation and Next.js optimization
- Production builds remove console logs and optimize for performance

## Project Architecture

### Technical Stack
- **Framework**: Next.js 15.4.6 with App Router
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS v4 with custom postcss integration
- **Content**: Velite for markdown processing with Zod schema validation
- **Forms**: FormBold React integration for quote requests
- **Analytics**: Google Analytics 4 with custom tracking

### Data Architecture

#### Core Data Sources
Robot data is centralized in JSON files with TypeScript interfaces:
- `src/data/robots.json` - Complete robot specifications and metadata
- `src/data/brands.json` - Brand information and official websites
- `src/data/categories.json` - Product categories with descriptions
- `src/types/robot.ts` - Comprehensive TypeScript interfaces

#### Discovery Data (Weekly Automation)
- `data/collected-articles/YYYY-MM-DD.json` - Weekly collected articles from RSS/arXiv
- `data/discovered-robots/YYYY-MM-DD.json` - Extracted robot data awaiting review
- `src/types/discovered-robot.ts` - TypeScript interfaces for discoveries

#### Content Management
```
content/
├── blog/           # Markdown blog posts with frontmatter
├── authors/        # Author profiles and bios
└── templates/      # Content templates for consistency
```

#### Generated Content
Velite processes markdown into:
- `.velite/posts.json` - Compiled blog posts with metadata
- `.velite/authors.json` - Author data with processed markdown
- Type-safe imports available throughout the application

### Application Structure

#### Page Types and Routing
1. **Product Catalog Pages**:
   - `/robots/[id]` - Individual robot detail pages with comprehensive specs
   - `/categories/[category]` - Category listings with filtering
   - `/brands/[brand]` - Brand-specific robot collections
   - `/browse` - Main product browsing with advanced filters

2. **Content Pages**:
   - `/blog` - Blog listing with category filtering
   - `/blog/[slug]` - Individual blog posts  
   - `/blog/category/[category]` - Category-specific blog listings

3. **Utility Pages**:
   - `/sitemap.xml` - Dynamic sitemap generation (381+ URLs)
   - `/robots.txt` - SEO-optimized robots.txt with AI bot protection

#### Key Components Architecture

**Layout System**:
- `src/components/Layout.tsx` - Main layout wrapper
- `src/app/layout.tsx` - App-level layout with metadata and analytics

**Product Components**:
- `ProductCard` - Reusable robot listing card
- `RobotDetailTemplate` - Comprehensive robot detail view
- `SpecificationTable` - Dynamic specification rendering
- `QuoteForm` - FormBold integration for quote requests

**Search and Filter System**:
- `SearchBar` - Client-side search implementation
- `FilterSidebar` - Advanced filtering by category, brand, price
- All filtering happens client-side for performance

### Image and Asset Management

#### Image Optimization
Next.js Image component with:
- WebP/AVIF format support
- Responsive sizing: `[16, 32, 48, 64, 96, 128, 256, 384]`
- Device sizes: `[640, 750, 828, 1080, 1200, 1920, 2048, 3840]`
- 1-year cache TTL for optimal performance

#### Remote Image Sources
Configure new robot brand domains in `next.config.js`:
```javascript
remotePatterns: [
  {
    protocol: 'https',
    hostname: 'example-robot-company.com',
    pathname: '/images/**',
  }
]
```

### SEO and Performance

#### SEO Implementation
- Dynamic sitemap generation from all data sources
- Robots.txt with AI training bot protection
- Google Analytics 4 with custom event tracking
- Meta tags and Open Graph optimization
- Performance optimization with font preloading

#### Critical Performance Features
- Turbopack for faster development builds
- Console removal in production builds
- Optimized bundle splitting
- Critical CSS inlining for above-the-fold content

## Data Management Patterns

### Adding New Robots

**Automated Discovery (Preferred)**
New robots are discovered weekly through the automated system (see "Weekly Robot Discovery System" section). When processing discoveries:

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

**Manual Addition**
For robots not from automated discovery:
1. Research official website for complete specifications
2. Follow same process as automated discovery above
3. Ensure all required fields from `Robot` interface are complete

### Adding New Brands
1. Add brand to `src/data/brands.json` with logo and description
2. Add logo SVG to `public/images/brands/`
3. Add remote image patterns to `next.config.js` if needed
4. Brand page is automatically generated at `/brands/[brand-id]`
5. Add brand link to the footer

### Content Creation Workflow
1. Create markdown files in `content/blog/` with proper frontmatter
2. Follow the schema defined in `velite.config.ts`
3. Required fields: `title`, `date`, `author`, `category`, `tags`, `excerpt`
4. Content is automatically processed and type-checked during build

## Weekly Robot Discovery System

This project includes an automated weekly system to discover new robots from industry sources.

### Architecture Overview

```
Weekly GitHub Actions (Friday 10 AM UTC)
    ↓
Collect articles from RSS/arXiv
    ↓
Save to data/collected-articles/YYYY-MM-DD.json
    ↓
Create GitHub Issue reminder
    ↓
Manual processing with Claude Code Pro
    ↓
Extract robot data → data/discovered-robots/YYYY-MM-DD.json
    ↓
Manual review and enrichment
    ↓
Add approved robots to src/data/robots.json
```

### Data Sources
- **IEEE TV RSS**: https://ieeetv.ieee.org/channel_rss/channel_77/rss
- **The Robot Report RSS**: https://www.therobotreport.com/feed/
- **arXiv cs.RO**: https://arxiv.org/list/cs.RO/new

### Automation Scripts

#### `npm run fetch-articles`
Automated article collection script that runs weekly:
- Fetches articles from last 7 days from all sources
- Saves to `data/collected-articles/YYYY-MM-DD.json`
- No API costs, no LLM calls
- Runs automatically via GitHub Actions

**Manual usage:**
```bash
npm run fetch-articles              # Collect from all sources
npm run fetch-articles -- --dry-run # Preview without saving
```

### Processing Workflow with Claude Code Pro

**Step 1: Wait for GitHub Issue**
- Every Friday at 10 AM UTC, GitHub Actions collects articles
- A GitHub Issue is created with a reminder to process discoveries
- Review the collected articles in `data/collected-articles/YYYY-MM-DD.json`

**Step 2: Extract Robot Data**
Use Claude Code Pro to process the collected articles:
```
Ask Claude Code: "Please extract robot information from
@data/collected-articles/YYYY-MM-DD.json and save structured
data to data/discovered-robots/YYYY-MM-DD.json"
```

Claude will extract:
- `company`: Manufacturer name
- `robot_name`: Official product/prototype name
- `type`: "humanoid" | "quadruped" | null
- `status`: "research" | "prototype" | "commercial"
- `image_link`: Image URL if found
- `specs_link`: Official specifications page
- `source_link`: Original article URL
- `description`: Brief 1-sentence summary
- `confidence_score`: 0-100 confidence rating
- `quality_score`: Completeness and reliability metrics

**Step 3: Add to Website**
Ask Claude Code to add discovered robots:
```
Ask Claude Code: "Add the new robots from
@data/discovered-robots/YYYY-MM-DD.json to our website.
Get full specs from official websites and download all images locally."
```

### Critical Best Practices

#### 1. Always Download Images Locally
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

#### 2. Complete Specifications Required
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

#### 3. Research Official Sources
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

### Data File Structure

#### Collected Articles (`data/collected-articles/YYYY-MM-DD.json`)
```json
{
  "fetch_date": "2026-01-09T10:00:00.000Z",
  "week_range": "Jan 2–8",
  "sources": {
    "ieee": [...articles],
    "robotreport": [...articles],
    "arxiv": [...papers]
  },
  "summary": {
    "total_articles": 24,
    "ieee_count": 0,
    "robotreport_count": 15,
    "arxiv_count": 9
  }
}
```

#### Discovered Robots (`data/discovered-robots/YYYY-MM-DD.json`)
```json
{
  "fetch_date": "2026-01-09T00:30:00.000Z",
  "week_range": "Jan 2–8",
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

### GitHub Actions Workflow

**File**: `.github/workflows/weekly-robot-fetch.yml`

**Trigger**:
- Scheduled: Every Friday at 10:00 AM UTC (`cron: '0 10 * * 5'`)
- Manual: Via `workflow_dispatch` in GitHub Actions UI

**What it does:**
1. Checks out repository
2. Installs dependencies
3. Runs `npm run fetch-articles`
4. Commits collected articles to `data/collected-articles/`
5. Creates GitHub Issue with reminder to process with Claude Code Pro

**No API costs**: Uses only RSS/HTML parsing, no LLM API calls

### Type Definitions

See `src/types/discovered-robot.ts` for complete TypeScript interfaces:
- `DiscoveredRobot`: Individual robot discovery data
- `QualityScore`: Quality assessment metrics
- `QualityFlag`: Data completeness flags
- `FetchResult`: Complete fetch operation result
- `FetchError`: Error tracking structure

### Cost Efficiency

This system is designed for **zero ongoing costs**:
- ✅ Article collection: Free (RSS/HTML parsing only)
- ✅ Data extraction: Free (uses Claude Code Pro subscription)
- ✅ GitHub Actions: Free tier sufficient (< 5 min/week)
- ❌ No Anthropic API usage
- ❌ No external API dependencies

**Comparison to API approach:**
- API-based: ~$0.10-0.50/week (20 articles × LLM calls)
- Current approach: $0/week (included in Claude Code Pro)

## Environment and Configuration

### Required Environment Variables
```bash
NEXT_PUBLIC_BASE_URL=https://www.awesomerobots.xyz
# Google Analytics tracking ID already configured in layout.tsx
```

### Build Configuration
- **Velite Integration**: Custom webpack plugin processes content during build
- **Image Domains**: Configure robot manufacturer domains for image optimization
- **SEO Optimization**: Automatic sitemap generation includes all content types
- **Production Optimizations**: Console removal, compression, and caching headers

## Content Strategy and SEO

### Content Types and Purpose
1. **Product Listings**: Comprehensive robot catalog with filtering
2. **Educational Content**: Tutorials, news, buying guides, case studies  
3. **Quotation Integration**: FormBold integration for lead generation
4. **SEO Content**: 381+ auto-generated URLs for maximum search visibility

### SEO Optimization Features
- Dynamic metadata generation for all pages
- Structured URL patterns for search engine crawling
- Content-driven sitemap updates
- Google Analytics event tracking for user behavior analysis
- Robot.txt configuration prevents AI training bot scraping while allowing search indexing

## Performance and Monitoring

The application includes Google Analytics 4 integration with custom event tracking for:
- Robot quote requests with product details
- Category page views with result counts  
- Search query tracking and conversion monitoring
- User engagement metrics across all page types
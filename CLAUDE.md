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

## Automated Digest & Analytics System

This project includes a fully automated system to generate weekly content digests and analytics updates.

### System Overview

The automation runs every Friday at 10 AM UTC and performs:
1. **Article Collection**: Fetch from RSS/arXiv (no API costs)
2. **Robot Extraction**: Use Claude API to extract robot data
3. **Digest Generation**: Create weekly blog post with insights
4. **Analytics Update**: Refresh dashboard metrics
5. **Pull Request**: Create PR with all changes for review

### Automation Scripts

#### `npm run extract-robots`
Extracts robot data from collected articles using Claude API:
- Input: `data/collected-articles/YYYY-MM-DD.json`
- Output: `data/discovered-robots/YYYY-MM-DD.json`
- Uses Claude Sonnet 4.5 for structured data extraction
- Deduplicates against existing robots in catalog
- Assigns quality scores and confidence ratings

**Manual usage:**
```bash
export ANTHROPIC_API_KEY="your-key"
npm run extract-robots              # Process latest articles
npm run extract-robots -- --dry-run # Preview without saving
```

#### `npm run generate-digest`
Generates weekly Awesome Robots Digest blog post:
- Input: Latest collected articles and discovered robots
- Output: `content/blog/YYYY-MM-DD-digest-issue-N.md`
- Creates engaging summaries with key insights
- Includes robot highlights and industry trends
- Automatically published when PR is merged

**Manual usage:**
```bash
export ANTHROPIC_API_KEY="your-key"
npm run generate-digest              # Generate digest
npm run generate-digest -- --dry-run # Preview without saving
```

#### `npm run update-analytics`
Updates analytics dashboard with latest metrics:
- Aggregates robot catalog statistics
- Tracks discovery trends over time
- Updates brand and category distributions
- No API calls required

**Manual usage:**
```bash
npm run update-analytics  # Update analytics files
```

### GitHub Actions Workflow

**File**: `.github/workflows/weekly-robot-fetch.yml`

The workflow automatically:
1. Collects articles from all sources
2. Extracts robot data using Claude API
3. Generates weekly digest blog post
4. Updates analytics dashboard
5. Creates feature branch with all changes
6. Opens pull request for editorial review
7. Reports failures as GitHub issues if errors occur

**Environment requirements:**
- `ANTHROPIC_API_KEY` secret must be configured in GitHub Settings
- See `docs/SETUP.md` for configuration instructions

**Cost estimation:**
- Article collection: Free (RSS/HTML parsing)
- Robot extraction: ~$0.06/week
- Digest generation: ~$0.015/week
- Total: **~$0.08/week** or **$4/year**

### Editorial Review Workflow

When automation runs successfully:
1. **PR Created**: Review at `automation/weekly-digest-YYYY-MM-DD` branch
2. **Review Checklist**:
   - Verify digest content quality and accuracy
   - Check discovered robots against official sources
   - Validate analytics data integrity
3. **Merge**: Approve and merge to publish digest to blog
4. **Post-Merge**: Consider adding high-quality discoveries to main catalog

### Manual Override

If you need to run automation manually:
```bash
# Full automation pipeline
npm run fetch-articles
export ANTHROPIC_API_KEY="your-key"
npm run extract-robots
npm run generate-digest
npm run update-analytics

# Create PR manually
git checkout -b automation/manual-$(date +%Y-%m-%d)
git add data/ content/blog/ src/data/analytics-*.json
git commit -m "feat: Manual automation run"
git push -u origin automation/manual-$(date +%Y-%m-%d)
```

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

## SEO Implementation and Best Practices

### Overview

Awesome Robots has comprehensive SEO implementation including structured data, dynamic OG images, and optimized metadata across all pages. This section documents SEO patterns and best practices for maintaining and improving search visibility.

### Structured Data (JSON-LD)

**Location**: `src/lib/structured-data.ts`

All structured data follows schema.org standards and is implemented using JSON-LD format. The following schemas are implemented:

#### 1. WebSite Schema (Root Layout)
**Purpose**: Enables Google SiteLinks search box in SERPs
**Implementation**: `src/app/layout.tsx`
**Function**: `generateWebSiteSchema()`

```typescript
// Enables search box in Google results
{
  "@type": "WebSite",
  "name": "Awesome Robots",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.awesomerobots.xyz/browse?q={search_term_string}"
  }
}
```

#### 2. Product Schema (Robot Detail Pages)
**Purpose**: Rich snippets with price, ratings, availability
**Implementation**: `src/app/robots/[id]/page.tsx`
**Function**: `generateProductSchema(robot, baseUrl)`

**Required Fields**:
- `name`: `${robot.brand} ${robot.name}`
- `description`: Minimum 50 characters
- `brand`: Organization schema
- `image`: Array of image URLs (local preferred)
- `offers`: Price and availability
- `aggregateRating`: Editorial ratings (4.2-4.9 range)

**Best Practices**:
- Always include at least 3 images
- Use local image paths (not remote URLs) for better performance
- Add price information when available
- Include technical specifications in `additionalProperty`

#### 3. CollectionPage Schema (Category/Brand Pages)
**Purpose**: Rich listings in search results with item counts
**Implementation**: Category and brand pages
**Function**: `generateCollectionPageSchema()`

```typescript
{
  "@type": "CollectionPage",
  "mainEntity": {
    "@type": "ItemList",
    "numberOfItems": 25,
    "itemListElement": [...] // First 50 items
  }
}
```

**Applied To**:
- `/categories/[category]` - All category listing pages
- `/brands/[brand]` - All brand listing pages

#### 4. Article Schema (Blog Posts)
**Purpose**: Enhanced blog post display in search results
**Implementation**: `src/app/blog/[slug]/page.tsx`
**Function**: `generateArticleSchema()`

**Required Fields**:
- `headline`: Blog post title
- `author`: Author with social links
- `datePublished`: ISO 8601 format
- `publisher`: Organization with logo
- `articleSection`: Category
- `wordCount`: Calculated from content

#### 5. Breadcrumb Schema (All Detail Pages)
**Purpose**: Breadcrumb navigation in search results
**Implementation**: All product, category, and content pages
**Function**: `generateBreadcrumbSchema(breadcrumbs, baseUrl)`

#### 6. FAQ Schema (Category Pages)
**Purpose**: FAQ rich snippets in search results
**Implementation**: Category-specific FAQ content
**Functions**: `generateRobotFAQSchema()`, `generateCategoryFAQSchema()`

### Dynamic Open Graph Images

**Location**: `opengraph-image.tsx` files in route directories

Next.js automatic OG image generation using `@vercel/og`:

**Implemented Pages**:
1. **Homepage**: `src/app/opengraph-image.tsx`
2. **Robot Detail**: `src/app/robots/[id]/opengraph-image.tsx`
3. **Blog Posts**: `src/app/blog/[slug]/opengraph-image.tsx`
4. **Category Pages**: `src/app/categories/[category]/opengraph-image.tsx`

**Image Specifications**:
- Size: 1200x630px (Facebook/Twitter optimal)
- Format: PNG
- Runtime: Edge (fast generation)
- Content: Dynamic text, gradients, branding

**Best Practices**:
- Use contrasting colors for readability
- Include site branding (logo/name)
- Show key information (price, category, title)
- Test on Twitter Card Validator and Facebook Debugger

### Metadata Best Practices

#### Page Title Format
```typescript
// Robot Detail Pages
`${robot.brand} ${robot.name} - ${category} Robot ${priceText} | Specs & Review`
// Max 60 characters for Google display

// Category Pages
`${category} Robots - ${count} Models ${priceRange} | Compare & Buy`

// Brand Pages
`${brand} Robots - ${count} Models ${priceRange} | ${categories}`
```

#### Description Format
```typescript
// 150-160 characters optimal for Google snippets
`${robot.description} ${keyFeature}. Compare specs, pricing, and request a quote. Perfect for research, education, and industrial applications.`
```

#### Keywords Strategy
```typescript
// Robot pages: 10-15 targeted keywords
[
  `${brand} ${name}`,
  `${name} robot`,
  `buy ${name}`,
  `${name} price`,
  `${name} specifications`,
  `best ${category} robot`,
  ...features // Top 5 features as keywords
]
```

### Canonical URLs

**Implementation**: All pages include canonical tags via `alternates.canonical`

```typescript
export const metadata = {
  alternates: {
    canonical: `${baseUrl}/robots/${robotId}`,
  },
};
```

**Rules**:
- Homepage: `/`
- Robot detail: `/robots/{id}`
- Category: `/categories/{category}`
- Brand: `/brands/{brand}`
- Blog post: `/blog/{slug}`
- No trailing slashes
- Always use `env.NEXT_PUBLIC_BASE_URL`

### Sitemap Generation

**Location**: `src/app/sitemap.ts`

Dynamic sitemap generation with proper priorities and change frequencies:

**Priority Levels**:
- Homepage: `1.0` (daily)
- Browse page: `0.9` (daily)
- Robot detail: `0.9` (weekly)
- Brand pages: `0.7` (weekly)
- Category pages: `0.7-0.8` (weekly)
- Blog posts: `0.7` (monthly)

**Change Frequencies**:
- Product pages: Weekly (specs/pricing updates)
- Blog posts: Monthly (archived content)
- Category/Brand: Weekly (new products)

### Robots.txt Configuration

**Location**: `src/app/robots.ts`

**AI Bot Protection**:
```typescript
// Blocked bots for AI training
userAgent: ['GPTBot', 'Google-Extended', 'CCBot', 'ChatGPT-User', 'Claude-Web', 'anthropic-ai']
disallow: '/'
```

**SEO Bots Allowed**:
- Googlebot: Full access
- Bingbot: Full access
- Other search engines: Full access

**Disallowed Paths**:
- `/api/` - Private API routes
- `/admin/` - Admin pages
- `/_next/` - Next.js internals

### Image SEO

**Best Practices**:
1. **Always use local images** (not remote URLs)
   - Download manufacturer images to `public/images/robots/[brand]-[model]/`
   - Name files descriptively: `robot-1.jpg`, `robot-2.jpg`

2. **Alt text format**:
   ```typescript
   `${brand} ${name} - ${category} robot showcasing advanced features and capabilities`
   ```

3. **Next.js Image optimization**:
   - Use `<Image>` component for automatic optimization
   - Set `priority` for above-the-fold images
   - Define `sizes` for responsive images
   - Use WebP/AVIF formats automatically

4. **Image dimensions**:
   - Product images: 800x800px minimum
   - OG images: 1200x630px
   - Logos: SVG preferred, or PNG with transparent background

### Internal Linking Strategy

**Principles**:
1. **Context-aware linking**: Related robots, categories, brands
2. **Breadcrumb navigation**: All detail pages
3. **Related content**: 3-5 related items per page
4. **Footer navigation**: Categories, brands, resources

**Implementation**:
```typescript
// Robot detail pages show:
- Related robots (same category or brand)
- Category breadcrumb link
- Brand page link

// Category pages show:
- Individual robot links
- Related category links
- Brand filter links

// Brand pages show:
- All brand robots
- Category distribution
- Official brand website
```

### SEO Audit Script

**Location**: `scripts/seo-audit.ts`

Automated SEO validation script that checks:
- Robot data completeness
- Metadata requirements
- Image availability
- Structured data fields
- Sitemap coverage
- SEO-friendly IDs

**Usage**:
```bash
npm run seo-audit              # Full audit
npm run seo-audit -- --fix     # Auto-fix issues
```

**Audit Categories**:
1. **Robot Data**: Descriptions, images, pricing, features
2. **Brand Data**: Descriptions, logos, websites
3. **Category Data**: Descriptions, definitions
4. **Sitemap**: Coverage, duplicate IDs
5. **Structured Data**: Required fields validation
6. **Best Practices**: ID formats, unique names

**Passing Criteria**:
- Score 95%+: Grade A (production ready)
- Score 85-94%: Grade B (minor improvements)
- Score 75-84%: Grade C (needs attention)
- Score < 75%: Grade D/F (critical issues)

### Adding New Robots (SEO Checklist)

When adding new robots, ensure:

1. **Required Fields**:
   - ✅ `name`, `brand`, `category`
   - ✅ `description` (minimum 50 characters)
   - ✅ `images` (at least 1 local image)
   - ✅ `price` (number or "Request Quote")
   - ✅ `features` (minimum 3 items)

2. **SEO Optimization**:
   - ✅ SEO-friendly `id` (lowercase, hyphens only)
   - ✅ Unique `brand + name` combination
   - ✅ All images downloaded locally
   - ✅ `officialUrl` to manufacturer site

3. **Structured Data**:
   - ✅ Product schema will auto-generate
   - ✅ Breadcrumb schema will auto-generate
   - ✅ OG image will auto-generate

4. **Verification**:
   ```bash
   npm run seo-audit          # Check data completeness
   npm run build              # Verify no errors
   ```

### SEO Performance Targets

**Current Performance** (as of 2026-01):
- 381+ indexed URLs
- Product pages: avg 0.9 priority
- Structured data coverage: 100%
- OG image coverage: 100% (homepage, robots, blog, categories)
- Mobile-friendly: 100%
- Core Web Vitals: All green

**Goals**:
- Organic traffic: +50% YoY
- Featured snippets: 10+ robot terms
- Rich snippets: 100% product pages
- Page speed: < 2s LCP

### Common SEO Issues and Fixes

#### Issue: Robot missing description
```bash
Fix: Add description (minimum 50 characters) to robots.json
```

#### Issue: Remote image URLs
```bash
Fix: Download images locally to public/images/robots/[brand]-[model]/
Update robots.json with local paths
```

#### Issue: Missing pricing
```bash
Fix: Add price.starting: number or "Request Quote"
```

#### Issue: Non-SEO-friendly IDs
```bash
Bad: "Unitree_G1", "UnitreeG1", "UNITREE-G1"
Good: "unitree-g1"
```

#### Issue: Duplicate robot names
```bash
Fix: Make names unique with model numbers or variants
Example: "Walker" → "Walker S1" vs "Walker X"
```

### Tools and Resources

**SEO Testing Tools**:
- Google Search Console
- Google Rich Results Test
- Facebook Sharing Debugger
- Twitter Card Validator
- PageSpeed Insights

**Schema Validation**:
- Schema.org validator
- Google Rich Results Test
- JSON-LD Playground

**Monitoring**:
- Google Analytics 4
- Google Search Console
- Bing Webmaster Tools

### SEO Maintenance Schedule

**Weekly**:
- Review new robot additions
- Run `npm run seo-audit`
- Check for 404 errors

**Monthly**:
- Analyze Search Console data
- Update metadata based on performance
- Review and update FAQ content
- Check structured data errors

**Quarterly**:
- Comprehensive SEO audit
- Competitor analysis
- Content gap analysis
- Technical SEO review

---

**SEO Documentation Version**: 1.0
**Last Updated**: 2026-01-29
**Maintainer**: See CLAUDE.md for contact
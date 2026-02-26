# SEO Implementation and Best Practices

Awesome Robots has comprehensive SEO implementation including structured data, dynamic OG images, and optimized metadata across all pages. This document covers SEO patterns and best practices for maintaining and improving search visibility.

---

## Image and Asset Management

### Image Optimization
Next.js Image component with:
- WebP/AVIF format support
- Responsive sizing: `[16, 32, 48, 64, 96, 128, 256, 384]`
- Device sizes: `[640, 750, 828, 1080, 1200, 1920, 2048, 3840]`
- 1-year cache TTL for optimal performance

### Remote Image Sources
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

### Image SEO

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

---

## SEO and Performance

### SEO Implementation Overview
- Dynamic sitemap generation from all data sources
- Robots.txt with AI training bot protection
- Google Analytics 4 with custom event tracking
- Meta tags and Open Graph optimization
- Performance optimization with font preloading

### Critical Performance Features
- Turbopack for faster development builds
- Console removal in production builds
- Optimized bundle splitting
- Critical CSS inlining for above-the-fold content

---

## Content Strategy and SEO

### Content Types and Purpose
1. **Product Listings**: Comprehensive robot catalog with filtering
2. **Educational Content**: Daily posts, buying guides, comparisons, case studies
3. **Weekly Digests**: Auto-generated `awesome-robots-digest-issue-N.md` summaries
4. **Quotation Integration**: FormBold integration for lead generation
5. **SEO Content**: 381+ auto-generated URLs for maximum search visibility

### SEO Optimization Features
- Dynamic metadata generation for all pages
- Structured URL patterns for search engine crawling
- Content-driven sitemap updates
- Google Analytics event tracking for user behavior analysis
- Robot.txt configuration prevents AI training bot scraping while allowing search indexing

---

## Performance and Monitoring

Google Analytics 4 integration with custom event tracking for:
- Robot quote requests with product details
- Category page views with result counts
- Search query tracking and conversion monitoring
- User engagement metrics across all page types

---

## Structured Data (JSON-LD)

**Location**: `src/lib/structured-data.ts`

All structured data follows schema.org standards and is implemented using JSON-LD format. The following schemas are implemented:

### 1. WebSite Schema (Root Layout)
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

### 2. Product Schema (Robot Detail Pages)
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

### 3. CollectionPage Schema (Category/Brand Pages)
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

### 4. Article Schema (Blog Posts)
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

### 5. Breadcrumb Schema (All Detail Pages)
**Purpose**: Breadcrumb navigation in search results
**Implementation**: All product, category, and content pages
**Function**: `generateBreadcrumbSchema(breadcrumbs, baseUrl)`

### 6. FAQ Schema (Category Pages)
**Purpose**: FAQ rich snippets in search results
**Implementation**: Category-specific FAQ content
**Functions**: `generateRobotFAQSchema()`, `generateCategoryFAQSchema()`

---

## Dynamic Open Graph Images

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

---

## Metadata Best Practices

### Page Title Format
```typescript
// Robot Detail Pages
`${robot.brand} ${robot.name} - ${category} Robot ${priceText} | Specs & Review`
// Max 60 characters for Google display

// Category Pages
`${category} Robots - ${count} Models ${priceRange} | Compare & Buy`

// Brand Pages
`${brand} Robots - ${count} Models ${priceRange} | ${categories}`
```

### Description Format
```typescript
// 150-160 characters optimal for Google snippets
`${robot.description} ${keyFeature}. Compare specs, pricing, and request a quote. Perfect for research, education, and industrial applications.`
```

### Keywords Strategy
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

---

## Canonical URLs

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

---

## Sitemap Generation

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

---

## Robots.txt Configuration

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

---

## Internal Linking Strategy

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

---

## SEO Audit Script

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

---

## Adding New Robots (SEO Checklist)

When adding new robots, ensure:

1. **Required Fields**:
   - `name`, `brand`, `category`
   - `description` (minimum 50 characters)
   - `images` (at least 1 local image)
   - `price` (number or "Request Quote")
   - `features` (minimum 3 items)

2. **SEO Optimization**:
   - SEO-friendly `id` (lowercase, hyphens only)
   - Unique `brand + name` combination
   - All images downloaded locally
   - `officialUrl` to manufacturer site

3. **Structured Data**:
   - Product schema will auto-generate
   - Breadcrumb schema will auto-generate
   - OG image will auto-generate

4. **Verification**:
   ```bash
   npm run seo-audit          # Check data completeness
   npm run build              # Verify no errors
   ```

---

## SEO Performance Targets

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

---

## Common SEO Issues and Fixes

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
Example: "Walker" -> "Walker S1" vs "Walker X"
```

---

## Tools and Resources

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

---

## SEO Maintenance Schedule

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

**Last Updated**: 2026-02-26

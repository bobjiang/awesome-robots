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
1. Add robot data to `src/data/robots.json` following the `Robot` interface
2. Download and add high-resolution images to `public/images/robots/`
3. Update `src/data/brands.json` if introducing a new brand
4. Robot automatically appears in sitemap and relevant category pages

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
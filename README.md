# Awesome Robots

> A comprehensive catalog of AI-powered robots including humanoids, quadrupeds, and accessories. Discover, compare, and find the perfect robot for your needs.

[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

🌐 **Live Site:** [https://www.awesomerobots.xyz](https://www.awesomerobots.xyz)

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Data Management](#data-management)
- [Content Management](#content-management)
- [Available Scripts](#available-scripts)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

Awesome Robots is a production-grade Next.js application that serves as a comprehensive catalog for robotics enthusiasts, researchers, and businesses. The platform features:

- **76+ Robots** from 40 manufacturers across multiple categories
- **Educational Blog** powered by Velite markdown processor
- **Quotation System** using FormBold integration for lead generation
- **SEO-Optimized** with dynamic sitemaps and structured data
- **Multi-Platform Publishing** with automated Dev.to integration

## ✨ Features

### 🤖 Robot Catalog
- **Advanced Filtering**: Search by category, brand, price range, and specifications
- **Detailed Specifications**: Comprehensive technical data following RobotDetailTemplate schema
- **Image Optimization**: Next.js Image component with WebP/AVIF support
- **Comparison Tools**: Side-by-side robot comparison capabilities

### 📝 Content Management
- **Markdown-Based Blog**: Write posts in Markdown with frontmatter metadata
- **Type-Safe Content**: Velite provides full TypeScript type safety for content
- **Auto-Publishing**: Integrated Dev.to publishing with canonical URLs
- **Weekly Digests**: Automated digest generation and publishing

### 🎯 SEO & Analytics
- **Dynamic Sitemaps**: Auto-generated sitemap with 381+ URLs
- **Structured Data**: Product schema, breadcrumbs, and rich snippets
- **Google Analytics 4**: Custom event tracking for quotes and views
- **AI Bot Protection**: robots.txt configuration prevents training data scraping

### 💼 Business Features
- **Quote Requests**: FormBold integration for lead capture
- **Manufacturer Links**: Direct links to official product pages
- **Price Transparency**: Public pricing where available
- **ROS Support**: Clearly documented for research platforms

## 🛠 Tech Stack

### Core Framework
- **Next.js 15.4.6** - App Router with React 19
- **TypeScript** - Full type safety across the application
- **Tailwind CSS v4** - Utility-first styling with custom postcss

### Content & Data
- **Velite** - Markdown content processor with Zod validation
- **JSON Data Store** - 264KB robot catalog with comprehensive specs
- **Gray Matter** - Frontmatter parsing for blog posts

### Integrations
- **FormBold React** - Quote form integration
- **Google Analytics 4** - Analytics and event tracking
- **Dev.to API** - Automated blog cross-posting

### Development Tools
- **ESLint** - Code quality and consistency
- **TypeScript Strict Mode** - Enhanced type checking
- **Turbopack** - Fast development builds

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/bobjiang/awesome-robots.git
cd awesome-robots

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Required
NEXT_PUBLIC_BASE_URL=https://www.awesomerobots.xyz

# Optional - for Dev.to publishing
DEV_TO_API_KEY=your_devto_api_key_here

# Optional - for FormBold quote forms
NEXT_PUBLIC_FORMBOLD_FORM_ID=your_formbold_form_id
```

### Running Locally

```bash
# Development server with Turbopack
npm run dev

# Open http://localhost:3000
```

The development server features:
- Hot reload with Turbopack
- Fast refresh for React components
- Automatic Velite content compilation

## 📁 Project Structure

```
awesome-robots/
├── .devto/                    # Dev.to article metadata
├── content/                   # Markdown content
│   ├── blog/                 # Blog posts (20+ articles)
│   ├── authors/              # Author profiles
│   └── templates/            # Content templates
├── docs/                     # Project documentation
│   ├── market-analysis/     # Market research
│   └── *.md                 # Integration guides, bug fixes
├── public/                   # Static assets
│   ├── images/
│   │   ├── brands/          # Brand logos (40 brands)
│   │   ├── categories/      # Category images
│   │   └── robots/          # Robot images (local)
│   └── static/              # Velite-generated assets
├── scripts/                  # Automation scripts
│   ├── generate-digest.ts   # Weekly digest generator
│   ├── publish-blog.ts      # Blog publishing automation
│   └── validate-robot-data.cjs # Data validation
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── blog/           # Blog pages
│   │   ├── brands/         # Brand pages
│   │   ├── categories/     # Category pages
│   │   ├── robots/         # Robot detail pages
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Homepage
│   │   ├── sitemap.ts      # Dynamic sitemap
│   │   └── robots.ts       # robots.txt
│   ├── components/          # React components
│   │   ├── blog/           # Blog-specific components
│   │   ├── ProductCard.tsx # Robot listing card
│   │   ├── FilterSidebar.tsx # Advanced filtering
│   │   └── RobotDetailTemplate.tsx # Detail page layout
│   ├── data/               # JSON data store
│   │   ├── robots.json     # 76 robots (264KB)
│   │   ├── brands.json     # 40 brands (16KB)
│   │   └── categories.json # 4 categories
│   ├── lib/                # Utility libraries
│   │   ├── gtag.ts         # Google Analytics
│   │   └── structured-data.ts # SEO schemas
│   ├── types/              # TypeScript definitions
│   │   └── robot.ts        # Robot interfaces
│   └── utils/              # Utility functions
│       ├── devto-client.ts # Dev.to API client
│       └── blog-converter.ts # Markdown converter
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── velite.config.ts        # Velite configuration
└── package.json            # Dependencies and scripts
```

## 📊 Data Management

### Robot Data Structure

Robots follow the `RobotDetailTemplate` schema with comprehensive specifications:

```typescript
interface Robot {
  id: string;                    // Unique identifier
  name: string;                  // Robot name
  brand: string;                 // Manufacturer
  category: 'humanoid' | 'quadruped' | 'accessory' | 'other';
  price: {
    starting: number | null;     // Starting price in USD
    currency: string;
    models: Array<{
      name: string;
      price: number | 'request';
    }>;
  };
  images: string[];              // Image URLs (local or remote)
  description: string;
  officialUrl: string;

  // Extended specifications
  generalInfo?: { /* ... */ };
  keyFeatures?: string[];
  hardwareBuildQuality?: { /* ... */ };
  softwareEcosystem?: { /* ... */ };
  supplierReliability?: { /* ... */ };
  highResPhotos?: string[];
}
```

### Adding New Robots

1. **Update `src/data/robots.json`**:
   ```json
   {
     "id": "manufacturer-model-name",
     "name": "Model Name",
     "brand": "Manufacturer",
     "category": "humanoid",
     // ... complete specification
   }
   ```

2. **Add images** to `public/images/robots/`

3. **Update `src/data/brands.json`** if new manufacturer

4. **Configure remote images** in `next.config.js` if using CDN:
   ```javascript
   remotePatterns: [
     {
       protocol: 'https',
       hostname: 'manufacturer-cdn.com',
       pathname: '/images/**',
     }
   ]
   ```

5. **Validate data**:
   ```bash
   npm run validate-data
   ```

6. **Test locally**:
   ```bash
   npm run dev
   # Visit http://localhost:3000/browse
   ```

### Data Validation

The project includes automated data validation:

```bash
npm run validate-data  # Validates robots.json and brands.json
npm run pre-build      # Runs validation + config updates before build
```

## 📝 Content Management

### Creating Blog Posts

1. **Create markdown file** in `content/blog/`:
   ```bash
   content/blog/my-new-post.md
   ```

2. **Add frontmatter**:
   ```yaml
   ---
   title: "Your Post Title"
   slug: "your-post-title"
   author: "bob-jiang"
   date: "2025-10-22"
   category: "reviews"  # reviews | tutorials | news | buying-guides | case-studies | digest
   tags: ["robotics", "ai", "humanoid"]
   excerpt: "Brief description for SEO"
   featured: true
   published: true
   seo:
     title: "SEO Title"
     description: "SEO description"
     keywords: ["keyword1", "keyword2"]
   ---

   Your content here...
   ```

3. **Build and preview**:
   ```bash
   npm run build
   npm run dev
   # Visit http://localhost:3000/blog
   ```

### Publishing to Dev.to

```bash
# Publish existing blog post to Dev.to
npm run publish-blog file content/blog/your-post.md

# List recent posts
npm run publish-blog list

# Create draft
npm run publish-blog file content/blog/your-post.md --draft
```

### Weekly Digest Automation

```bash
# Generate digest for current week
npm run generate-digest

# Generate and publish to Dev.to as draft
npm run digest-and-publish
```

## 🔧 Available Scripts

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Data Management
- `npm run validate-data` - Validate robot and brand data
- `npm run update-configs` - Update image patterns in next.config.js
- `npm run organize-brands` - Organize robots by brand
- `npm run pre-build` - Run validation + config updates

### Content Publishing
- `npm run publish-blog` - Publish blog to Dev.to
- `npm run generate-digest` - Generate weekly digest
- `npm run digest-and-publish` - Generate and publish digest

## 🏗️ Development

### Code Quality

The project enforces code quality through:

- **TypeScript Strict Mode**: Full type safety
- **ESLint**: Configured with Next.js recommended rules
- **Component Structure**: Separation of concerns with presentational/container pattern
- **Data Validation**: Zod schemas for content and JSON validation

### Best Practices

1. **Type Safety**: Always define interfaces for components and data
2. **Image Optimization**: Use Next.js Image component with appropriate sizes
3. **SEO**: Include structured data and meta tags for all pages
4. **Performance**: Use lazy loading for large components
5. **Accessibility**: Follow ARIA guidelines for interactive elements

### Adding New Features

1. **Create feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Develop and test locally**:
   ```bash
   npm run dev
   npm run lint
   npm run build
   ```

3. **Commit with descriptive message**:
   ```bash
   git add .
   git commit -m "Add feature: description"
   ```

4. **Push and create pull request**:
   ```bash
   git push origin feature/your-feature-name
   ```

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new):

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables in Production

Set these in your deployment platform:

```bash
NEXT_PUBLIC_BASE_URL=https://your-domain.com
DEV_TO_API_KEY=your_devto_api_key_here
```

### Build Output

- **Static Pages**: 38 static pages generated
- **Dynamic Routes**: Robot detail pages, blog posts, categories
- **Build Time**: ~5 seconds with optimizations
- **Bundle Size**: Optimized with code splitting

### CI/CD

The project is configured for continuous deployment:

1. Push to `main` branch
2. Vercel automatically builds and deploys
3. Preview deployments for pull requests
4. Production deployment on merge

## 📚 Additional Documentation

- **Integration Guides**: See `docs/INTEGRATION-COMPLETE-SUMMARY.md`
- **Bug Fixes**: See `docs/BUGFIX-PRICE-NULL-HANDLING.md`
- **Market Analysis**: See `docs/market-analysis/`
- **Image Management**: See `docs/IMAGE_DOWNLOAD_INSTRUCTIONS.md`
- **Digest Automation**: See `docs/DIGEST_AUTOMATION.md`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow TypeScript best practices
- Add tests for new features
- Update documentation as needed
- Ensure ESLint passes before committing
- Keep commits focused and descriptive

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Robot Data**: Sourced from official manufacturer websites
- **OpenLoong RoboHub**: Chinese robotics integration
- **Next.js Team**: Amazing framework and tools
- **Velite**: Excellent content management solution
- **Community**: All contributors and supporters

## 📞 Support

- **Website**: [https://www.awesomerobots.xyz](https://www.awesomerobots.xyz)
- **Issues**: [GitHub Issues](https://github.com/bobjiang/awesome-robots/issues)
- **Email**: Contact via website quote form

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS

**Current Stats**: 76 Robots | 40 Brands | 20+ Blog Posts | 381+ Indexed Pages

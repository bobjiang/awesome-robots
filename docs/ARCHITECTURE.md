# Architecture

## Technical Stack

- **Framework**: Next.js 15.4.6 with App Router
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS v4 with custom postcss integration
- **Content**: Velite for markdown processing with Zod schema validation
- **Forms**: FormBold React integration for quote requests
- **Analytics**: Google Analytics 4 with custom tracking
- **Testing**: Vitest with Playwright MCP for E2E tests
- **Newsletter**: Beehiiv subscription + Discord webhook distribution
- **Publishing**: Dev.to cross-posting via API

## Data Architecture

**Core Data Sources** — Robot data is centralized in JSON files with TypeScript interfaces:
- `src/data/robots.json` - Complete robot specifications and metadata
- `src/data/brands.json` - Brand information and official websites
- `src/data/categories.json` - Product categories with descriptions
- `src/types/robot.ts` - Comprehensive TypeScript interfaces

**Discovery Data** (weekly automation):
- `data/collected-articles/YYYY-MM-DD.json` - Weekly collected articles from RSS/arXiv
- `data/discovered-robots/YYYY-MM-DD.json` - Extracted robot data awaiting review

**Content Structure**:
```
content/
├── blog/               # Markdown blog posts with frontmatter
│   ├── comparisons/    # Robot comparison guides
│   └── guides/         # Buying guides and comprehensive guides
├── authors/            # Author profiles and bios
└── templates/          # Content templates for consistency
```

## Page Types and Routing

- `/robots/[id]` - Robot detail pages | `/browse` - Product browsing with filters
- `/categories/[category]` - Category listings | `/brands/[brand]` - Brand collections
- `/blog/[slug]` - Blog posts | `/blog/category/[category]` - Blog category listings
- `/compare` - Robot comparison tool | `/sitemap.xml` - Dynamic sitemap (381+ URLs)

## Testing Infrastructure

- **Vitest** for unit and E2E tests with `vitest.config.ts`
- Tests live in `tests/` directory with `@tests` path alias
- Default environment: `node` (unit tests use `@vitest-environment jsdom` directive)
- 60s test timeout, 1 retry for flakiness, sequential execution (`pool: 'forks'`)

```
tests/
├── setup.ts              # Global test setup
├── e2e/                  # End-to-end tests (critical-paths/, share-buttons, etc.)
├── unit/components/      # Component unit tests
├── helpers/              # Browser helpers, selectors, assertions
└── fixtures/             # Test data
```

## Data Management

For detailed procedures on adding robots, brands, and content, see **[ADDING-ROBOTS.md](ADDING-ROBOTS.md)**.

Key rules:
- **Always download images locally** to `public/images/robots/[brand]-[model]/` — never use remote URLs in `robots.json`
- **Complete specifications required** — all fields from `RobotDetailTemplate.tsx` schema
- **Research official sources** before adding any robot
- Robot IDs must be SEO-friendly: lowercase, hyphens only (e.g., `unitree-g1`)
- Community submissions via GitHub Issue template at `.github/ISSUE_TEMPLATE/new-robot.yml`

## Environment and Configuration

### Required Environment Variables
```bash
NEXT_PUBLIC_BASE_URL=https://www.awesomerobots.xyz
# Google Analytics tracking ID already configured in layout.tsx
```

### Optional Environment Variables (for automation & publishing)
```bash
ANTHROPIC_API_KEY=             # Required for extract-robots and generate-digest scripts
DEV_TO_API_KEY=                # Required for publish-blog cross-posting to dev.to
DISCORD_NEWSLETTER_WEBHOOK_URL= # Required for Discord newsletter distribution
CLAUDE_CODE_OAUTH_TOKEN=       # Required for Claude Code PR review workflow (GitHub secret)
```

### Build Configuration
- **Velite Integration**: Custom webpack plugin processes content during build
- **Image Domains**: Configure robot manufacturer domains for image optimization in `next.config.js`
- **SEO Optimization**: Automatic sitemap generation includes all content types
- **Production Optimizations**: Console removal, compression, and caching headers

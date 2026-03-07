# Code Review Report -- Awesome Robots

**Date:** 2026-03-06
**Repository:** awesome-robots (Next.js 15 / TypeScript / Tailwind v4)
**Reviewers:** 3 specialized agents (UX+A11y, Performance+SEO, Data+State)
**Total findings:** 53 unique issues (12 P0, 22 P1, 19 P2)

---

## Executive Summary

Awesome Robots is a well-structured Next.js catalog site for AI-powered robots with 115+ models, a Velite-powered blog, and weekly automation scripts. The codebase is functional and ships real value, but this review uncovered **12 critical issues** that should be addressed urgently:

1. **Fabricated review ratings** in structured data risk a Google manual penalty (SEO existential risk)
2. **All 114 product pages are server-rendered on every request** (`force-dynamic`) when they should be static
3. **407 KB of robot data shipped to the client** on the browse page
4. **Multiple WCAG accessibility violations**: missing ARIA labels, no focus trapping in modals, no skip navigation
5. **TypeScript type lies**: `price.starting` typed as `number` but can be `"request"` string at runtime

The good news: most P0 fixes are quick-wins (< 30 minutes each). The architecture is sound -- these are accumulated tactical issues, not fundamental design flaws.

---

## System Map

```
                           +------------------+
                           |   robots.json    |  407 KB, 114 robots
                           |   brands.json    |  28 KB, 20+ brands
                           |  categories.json |  4 categories
                           +--------+---------+
                                    |
                    +---------------+---------------+
                    |               |               |
             Server Pages    Client Pages    Build Scripts
             (SSR/SSG)       ('use client')   (Node.js)
                    |               |               |
        +-----------+--+    +------+------+    +----+----+
        | /robots/[id] |    | /browse     |    | validate|
        | /blog/[slug] |    | /compare    |    | extract |
        | /categories  |    | /brands*    |    | digest  |
        | /brands/[b]  |    | /categories*|    | publish |
        | /humanoid    |    |             |    +---------+
        | /quadruped   |    |             |
        +--------------+    +-------------+
                |                   |
        +-------+-------+   +------+------+
        | structured-   |   | Layout.tsx  |  <-- 'use client' boundary
        | data.ts       |   | (nav+footer)|      cascades to all pages
        | (JSON-LD)     |   +-------------+
        +---------------+
                                    |
                           +--------+--------+
                           |  Velite Pipeline |
                           |  blog/**/*.md   |
                           |  authors/*.md   |
                           +-----------------+
                                    |
                           +--------+--------+
                           |  .velite/ output |
                           +-----------------+

* /brands and /categories listing pages are 'use client' unnecessarily
```

**Key integration points:** FormBold (quotes), Beehiiv (newsletter), Discord (webhooks), Dev.to (cross-posting), Google Analytics 4, Anthropic API (content extraction)

---

## P0 -- Must Fix (12 issues)

### SEO-001: Fabricated AggregateRating in Product Structured Data
- **Severity:** P0
- **Reviewers:** Performance+SEO, Data+State
- **File:** `src/lib/structured-data.ts:170-191`
- **What:** The `generateRating()` function fabricates star ratings (4.2-4.9) and review counts (23 or 47) for Product schema.org markup. No actual reviews exist on the site.
- **Why it matters:** Google explicitly penalizes fabricated review markup. This could trigger a manual action that removes rich snippets from ALL pages or worse, suppresses the entire domain in search results. This is the single highest-risk issue in the codebase.
- **Fix:** Delete `generateRating()` and remove `aggregateRating` from `generateProductSchema()` output (~20 lines).
- **Effort:** Quick-win (5 min)
- **Test:** Unit test: `expect(generateProductSchema(robot)).not.toHaveProperty('aggregateRating')`

### PERF-001: `force-dynamic` on All 114 Product Pages
- **Severity:** P0
- **Reviewers:** Performance+SEO, Data+State
- **File:** `src/app/robots/[id]/page.tsx:33`
- **What:** `export const dynamic = 'force-dynamic'` disables static generation for all robot detail pages. The comment references a Next.js 16 bug, but `package.json` shows Next.js 16.1.1 (confirmed via `"next": "^16.1.1"`). No `generateStaticParams` export exists.
- **Why it matters:** Every product page request hits the server. TTFB is 200-500ms slower than static. These are the money pages for SEO -- they rank for "[brand] [model] robot" queries.
- **Fix:** Test if the bug persists on current version. If fixed: remove `force-dynamic`, add `generateStaticParams`. If not: use `export const revalidate = 3600` for ISR.
- **Effort:** Quick-win (15 min to test)
- **Test:** Build and verify pages are in `.next/server/app/robots/` as static HTML.

### PERF-002: 407 KB robots.json Shipped to Client Bundle on /browse
- **Severity:** P0
- **Reviewers:** Performance+SEO
- **File:** `src/app/browse/page.tsx:1,10`
- **What:** The entire page is `'use client'` and imports `robots.json` (407 KB). This entire JSON gets bundled into client JavaScript (~80-120 KB gzipped).
- **Why it matters:** Every visitor to /browse downloads this payload. Hurts FCP, LCP, and TTI. The page also has zero server-rendered HTML for SEO -- search engines see only the Suspense spinner.
- **Fix:** Create a slimmed-down `robots-index.json` at build time with only ProductCard fields (id, name, brand, category, price.starting, images[0], features). Or: make the page a server component that pre-renders the list and passes minimal data to a client filter component.
- **Effort:** Medium (1-2 hours)
- **Test:** Check /browse chunk size in `next build` output. Target: < 100 KB transferred for robot data.

### PERF-003: /brands and /categories Are Needless Client Components with No Metadata
- **Severity:** P0
- **Reviewers:** Performance+SEO
- **Files:** `src/app/brands/page.tsx:1`, `src/app/categories/page.tsx:1`
- **What:** Both pages are `'use client'` despite having zero interactive state (no useState, no useEffect, no event handlers). They also have **no `metadata` export** -- no title, description, or OG tags.
- **Why it matters:** No server-rendered HTML for SEO. Google sees empty shells. These are important landing pages (sitemap priority 0.8, linked from footer).
- **Fix:** Remove `'use client'`. Add `export const metadata: Metadata` with proper titles and descriptions.
- **Effort:** Quick-win (15 min each)
- **Test:** `curl -s URL | grep '<title>'` should return proper titles.

### A11Y-001: QuoteForm Modal Has No Focus Trap, No Dialog Semantics, No Escape Key
- **Severity:** P0
- **Reviewers:** UX+A11y
- **File:** `src/components/QuoteForm.tsx:113-274`
- **What:** The modal overlay (`fixed inset-0 z-50`) lacks `role="dialog"`, `aria-modal="true"`, focus trapping, and Escape key handling. Focus is not moved into the modal on open. Users can Tab behind the overlay.
- **Why it matters:** WCAG 2.1 SC 2.1.2 (No Keyboard Trap) and SC 1.3.1 violations. Keyboard/screen reader users cannot use the quote form.
- **Fix:** Add dialog role, aria-modal, aria-labelledby, focus trap, Escape handler, focus restoration on close.
- **Effort:** Quick-win (1-2 hours)
- **Test:** E2E: open modal, verify Tab cycles within, Escape closes, focus returns to trigger button.

### A11Y-002: Mobile Hamburger Menu Has No Accessible Name
- **Severity:** P0
- **Reviewers:** UX+A11y
- **File:** `src/components/Layout.tsx:50-58`
- **What:** The hamburger button contains only an SVG icon with no `aria-label`, no `aria-expanded`, no screen-reader text. Announced as just "button".
- **Why it matters:** WCAG SC 4.1.2 (Name, Role, Value) violation. Screen reader users cannot identify or operate the main navigation toggle.
- **Fix:** Add `aria-label="Open main menu"`, `aria-expanded={isMenuOpen}`, `aria-controls="mobile-navigation"`.
- **Effort:** Quick-win (15 min)
- **Test:** Unit test: button has aria-label. E2E: aria-expanded toggles.

### A11Y-003: SearchBar Input Has No Accessible Label
- **Severity:** P0
- **Reviewers:** UX+A11y
- **File:** `src/components/SearchBar.tsx:28-34`
- **What:** Input has placeholder but no `<label>`, `aria-label`, or `aria-labelledby`. Decorative SVG icon lacks `aria-hidden="true"`.
- **Why it matters:** WCAG SC 1.3.1, SC 4.1.2. Screen readers cannot identify the input's purpose.
- **Fix:** Add `aria-label="Search robots"` to input, `aria-hidden="true"` to SVG, `role="search"` to form.
- **Effort:** Quick-win (15 min)
- **Test:** Axe audit on /browse page passes.

### A11Y-004: Sort Dropdowns Have No Programmatic Label
- **Severity:** P0
- **Reviewers:** UX+A11y
- **Files:** `src/app/browse/page.tsx:119-131`, `src/components/CategoryBrowser.tsx:97-108`, `src/components/BrandBrowser.tsx:83-94`
- **What:** Sort `<select>` has visible "Sort by:" text nearby but no `htmlFor`/`id` association.
- **Why it matters:** WCAG SC 1.3.1. Screen readers won't announce the label when the select is focused.
- **Fix:** Add `id="sort-select"` to select and `htmlFor="sort-select"` to label (in all 3 locations).
- **Effort:** Quick-win (10 min)
- **Test:** Axe audit on /browse.

### A11Y-005: SpecificationTable Uses Div Grid Instead of Semantic Table
- **Severity:** P0
- **Reviewers:** UX+A11y
- **File:** `src/components/SpecificationTable.tsx` (939 lines)
- **What:** All spec data rendered as nested `<div>` with CSS grid. No `<table>`, `<th>`, `<td>`, `<thead>`, `<tbody>`. Column headers have no semantic association with data cells.
- **Why it matters:** WCAG SC 1.3.1. Screen readers cannot navigate this as a table or understand header-to-data relationships -- critical for comparing robot variants.
- **Fix:** Refactor to use `<table>` with `<th scope="col/row">`, `<thead>`, `<tbody>`, `<tr>`, `<td>`. Apply Tailwind to table elements.
- **Effort:** Longer refactor (4-6 hours)
- **Test:** Axe audit. Manual screen reader test navigating the table.

### A11Y-006: QuoteForm Close Button Has No Accessible Name
- **Severity:** P0
- **Reviewers:** UX+A11y
- **File:** `src/components/QuoteForm.tsx:118-125`
- **What:** Close button has only an SVG "X" icon, no `aria-label`.
- **Why it matters:** WCAG SC 4.1.2. Screen readers announce "button" with no context.
- **Fix:** Add `aria-label="Close quote form"`.
- **Effort:** Quick-win (5 min)

### A11Y-007: Newsletter iframe Has No title Attribute
- **Severity:** P0
- **Reviewers:** UX+A11y
- **File:** `src/components/NewsletterSignup.tsx:12-25`
- **What:** Beehiiv `<iframe>` has no `title` attribute.
- **Why it matters:** WCAG SC 4.1.2, SC 2.4.1. Screen readers cannot describe the iframe's purpose.
- **Fix:** Add `title="Newsletter signup form"`.
- **Effort:** Quick-win (5 min)

### DATA-001: TypeScript Type Lie -- `price.starting` Typed as `number` but Can Be `"request"`
- **Severity:** P0
- **Reviewers:** Data+State
- **File:** `src/types/robot.ts:8` vs `src/data/robots.json`
- **What:** `BaseRobot` declares `price.starting: number`, but 54 robots have `"starting": "request"` (string). Code uses `typeof robot.price.starting === 'number'` guards everywhere, but the type definition is wrong. `robot-utils.ts:296-299` uses `a.price.starting ?? Infinity` which won't catch `"request"` -- it treats it as truthy and does arithmetic on a string.
- **Why it matters:** TypeScript provides false safety. Any code trusting the type without a runtime guard will crash or produce NaN.
- **Fix:** Change to `starting: number | 'request'`. Audit all consumers.
- **Effort:** Medium (type change + audit)
- **Test:** `sortRobots(robotsWithRequestPrice, 'price', 'asc')` should not produce NaN.

---

## P1 -- Should Fix (22 issues)

### PERF-004: Layout.tsx is Client Component, Creating App-Wide Client Boundary
- **File:** `src/components/Layout.tsx:1`
- **What:** `'use client'` on Layout wraps every page. Only the mobile menu toggle needs client-side JS.
- **Fix:** Extract `<MobileMenuButton>` as a tiny client component. Make Layout a server component.
- **Effort:** Medium (30-60 min)

### PERF-005: Full robots.json Passed to Recommendation Components Per-Request
- **File:** `src/app/robots/[id]/page.tsx:326`
- **What:** `ContentRelationships` and `InternalLinkingRecommendations` receive the entire 407 KB robots array. With `force-dynamic`, this is parsed and iterated on every request.
- **Fix:** Pre-compute related robots at build time.
- **Effort:** Medium (1-2 hours)

### PERF-006: Stale "2025" Year in Multiple Page Titles
- **Files:** `src/app/page.tsx:10`, `src/app/compare/page.tsx:6`, `src/app/humanoid-robots/page.tsx:13`, `src/app/quadruped-robots/page.tsx:13`
- **What:** Titles reference "2025" -- it's 2026. Signals outdated content.
- **Fix:** Update to 2026 or use `new Date().getFullYear()`.
- **Effort:** Quick-win (10 min)

### PERF-007: Sitemap Missing Key Pages
- **File:** `src/app/sitemap.ts`
- **What:** `/humanoid-robots`, `/quadruped-robots`, `/compare`, `/faq` are missing from the sitemap.
- **Fix:** Add the four routes with appropriate priorities.
- **Effort:** Quick-win (10 min)

### PERF-008: Blog Posts Missing Canonical URLs and robots Directives
- **File:** `src/app/blog/[slug]/page.tsx:32-51`
- **Fix:** Add `alternates.canonical` and `robots` to blog metadata.
- **Effort:** Quick-win (5 min)

### PERF-009: JSON-LD Schema Uses `beforeInteractive` Strategy
- **File:** `src/app/layout.tsx:98-104`
- **What:** Structured data script is render-blocking. Google processes JSON-LD from the final DOM -- it doesn't need to be loaded before page render.
- **Fix:** Change to `strategy="afterInteractive"` or remove the strategy prop.
- **Effort:** Quick-win (1 min)

### PERF-010: Three Priority Images Competing on Homepage
- **File:** `src/app/page.tsx:46,75,104`
- **What:** All three featured images have `priority={true}`. Only the first (LCP candidate) should.
- **Fix:** Remove `priority` from the 2nd and 3rd images.
- **Effort:** Quick-win (2 min)

### PERF-011: Hardcoded Canonical URLs in /humanoid-robots and /quadruped-robots
- **Files:** `src/app/humanoid-robots/page.tsx:17-18`, `src/app/quadruped-robots/page.tsx:17-18`
- **Fix:** Use `env.NEXT_PUBLIC_BASE_URL` instead of hardcoded domain.
- **Effort:** Quick-win (2 min)

### PERF-012: ProductCard Alt Text Too Sparse
- **File:** `src/components/ProductCard.tsx:44`
- **What:** Alt text is just `robot.name` (e.g., "Go2") with no brand/category context.
- **Fix:** Change to `` `${robot.brand} ${robot.name} - ${robot.category} robot` ``
- **Effort:** Quick-win (2 min)

### DATA-002: Hardcoded GA4 Measurement ID
- **File:** `src/lib/gtag.ts:31`
- **What:** `G-88F0E7K5RF` hardcoded. Development pollutes production analytics.
- **Fix:** Use `process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID` via `env.mjs`.
- **Effort:** Quick-win (15 min)

### DATA-003: QuoteForm Error Display Bug -- Errors Hidden
- **File:** `src/components/QuoteForm.tsx:263`
- **What:** Condition requires both `state.error.status` AND `state.error.message`. Validation and network errors set `.message` without `.status`, so errors are never shown to users.
- **Fix:** Change to `state.error?.message && !state.succeeded`. Add `role="alert"`.
- **Effort:** Quick-win (15 min)

### DATA-004: Duplicate Brand Entries in brands.json
- **File:** `src/data/brands.json`
- **What:** Multiple `openloong-*` prefixed brands duplicate existing brands (e.g., `openloong-engineai` duplicates `engineai`).
- **Fix:** Merge duplicates, keep the more complete entry, update robot records.
- **Effort:** Medium (manual data merge)
- **Test:** Assert no two brands share the same `name` (case-insensitive).

### DATA-005: Browse Page URL State Sync is One-Way Only
- **File:** `src/app/browse/page.tsx:24-35`
- **What:** URL params are read on mount to set filters, but filter changes don't update the URL. Users can't share filtered views or use back/forward.
- **Fix:** Use `useRouter().replace()` in filter handlers to sync state back to URL.
- **Effort:** Medium refactor

### DATA-006: Validation Script Misses Nested `price` Structure
- **File:** `scripts/validate-robot-data.cjs:29`
- **What:** `!robot[field]` only validates top-level presence. `price: {}` passes validation even though `starting`, `currency`, `models` are missing.
- **Fix:** Add nested validation for `price` sub-fields.
- **Effort:** Quick-win
- **Test:** Pass `{ price: {} }`, expect validation errors.

### DATA-007: `organize-by-brands.cjs` Produces Infinity for Empty Brands
- **File:** `scripts/organize-by-brands.cjs:98-100`
- **What:** `Math.min(...[])` returns `Infinity`, `Math.max(...[])` returns `-Infinity`.
- **Fix:** Guard against empty arrays.
- **Effort:** Quick-win

### DATA-008: `update-image-patterns.cjs` Fragile String Parsing of next.config.js
- **File:** `scripts/update-image-patterns.cjs:43-82`
- **What:** Uses `indexOf` to find `remotePatterns: [` and its closing `],`. Format changes could corrupt the config.
- **Fix:** Use a separate JSON file for patterns, imported by next.config.js.
- **Effort:** Longer refactor

### DATA-009: `extract-robots.ts` No Schema Validation on LLM Output
- **File:** `scripts/extract-robots.ts:108-114`
- **What:** LLM JSON response parsed and cast to `any[]` with no validation.
- **Fix:** Add Zod schema validation. Reject malformed entries.
- **Effort:** Medium

### A11Y-008: No Skip Navigation Link
- **File:** `src/components/Layout.tsx`
- **What:** No "Skip to main content" link. Keyboard users must Tab through 6+ nav links on every page.
- **Fix:** Add visually-hidden skip link as first focusable element.
- **Effort:** Quick-win (15 min)

### A11Y-009: Nav Element Has No aria-label
- **File:** `src/components/Layout.tsx:12`
- **Fix:** Add `aria-label="Main navigation"`.
- **Effort:** Quick-win (5 min)

### A11Y-010: Mobile Menu Has No Focus Management
- **File:** `src/components/Layout.tsx:62-111`
- **What:** No focus movement on open, no Escape handler, no close button.
- **Fix:** Move focus to first link on open. Add Escape key handler.
- **Effort:** Medium (1-2 hours)

### A11Y-011: Filter Result Count Not Announced to Screen Readers
- **Files:** `src/app/browse/page.tsx:151`, `src/components/CategoryBrowser.tsx:127`
- **Fix:** Wrap "Showing N robots" in `aria-live="polite"` region.
- **Effort:** Quick-win (10 min)

### A11Y-012: SVG Icons Across Codebase Lack `aria-hidden="true"`
- **Files:** Layout.tsx, FilterSidebar.tsx, SearchBar.tsx, QuoteForm.tsx, compare/page.tsx, ShareButtons.tsx
- **Fix:** Add `aria-hidden="true"` to all decorative SVGs. Systematic pass.
- **Effort:** Quick-win (30 min)

---

## P2 -- Nice to Have (19 issues)

| # | Issue | File | Effort |
|---|-------|------|--------|
| P2-01 | Footer copyright hardcoded to 2024 | Layout.tsx:174 | 5 min |
| P2-02 | Homepage missing `<h1>` element | app/page.tsx | 15 min |
| P2-03 | `env.mjs` only validates 1 env var; server schema empty | src/env.mjs | 15 min |
| P2-04 | FormBold endpoint hardcoded, no rate limiting | QuoteForm.tsx:63 | 15 min |
| P2-05 | Velite readingTime counts HTML tags as words | velite.config.ts:29 | 10 min |
| P2-06 | `publish-blog.ts` only reads flat blog directory | scripts/publish-blog.ts:132 | 10 min |
| P2-07 | ContentRelationships has hardcoded blog URLs | ContentRelationships.tsx:53-78 | Medium |
| P2-08 | AnthropicClient retries unknown errors by default | anthropic-client.ts:50 | 5 min |
| P2-09 | Compare page metadata says "2025" | compare/page.tsx:6-8 | 5 min |
| P2-10 | dns-prefetch for unused domains (Unsplash, jsDelivr) | layout.tsx:88-89 | 2 min |
| P2-11 | Duplicate manifest link in layout | layout.tsx:66,92 | 1 min |
| P2-12 | Missing `sizes` on fill Images | categories, brands pages | 5 min |
| P2-13 | Breadcrumb uses `>` instead of chevron icon | Breadcrumb.tsx:29 | 5 min |
| P2-14 | BlogPost breadcrumb nav missing aria-label | blog/BlogPost.tsx:39 | 5 min |
| P2-15 | Footer heading level inconsistency | Layout.tsx | 5 min |
| P2-16 | ShareButtons lack "(opens in new tab)" indication | blog/ShareButtons.tsx | 10 min |
| P2-17 | ProductCard image alt could be more descriptive | ProductCard.tsx:43 | 5 min |
| P2-18 | "Submit Robot" link lacks external link indicator | Layout.tsx:38-45 | 10 min |
| P2-19 | CategoryRobotGridWithFilters empty state lacks "clear filters" CTA | CategoryRobotGridWithFilters.tsx:91-95 | 20 min |

---

## Summary Statistics

| Category | P0 | P1 | P2 | Total |
|----------|----|----|-----|-------|
| Performance + SEO | 3 | 9 | 3 | 15 |
| Accessibility + UX | 7 | 5 | 7 | 19 |
| Data + State | 2 | 8 | 9 | 19 |
| **Total** | **12** | **22** | **19** | **53** |

| Effort | P0 | P1 | P2 |
|--------|----|----|-----|
| Quick-win (< 30 min) | 9 | 14 | 17 |
| Medium (1-6 hours) | 3 | 8 | 2 |
| Longer refactor | 0 | 0 | 0 |

---

## Recommended Fix Order (Priority Queue)

### Sprint 1: Immediate (this week, all quick-wins)
1. **SEO-001** -- Remove fabricated aggregateRating (5 min, prevents Google penalty)
2. **PERF-001** -- Test removing force-dynamic on robot pages (15 min, massive TTFB win)
3. **PERF-003** -- Remove 'use client' from /brands and /categories, add metadata (30 min)
4. **A11Y-002** -- Aria-label on hamburger menu (15 min)
5. **A11Y-003** -- Aria-label on search input (15 min)
6. **A11Y-006** -- Aria-label on close button (5 min)
7. **A11Y-007** -- Title on newsletter iframe (5 min)
8. **A11Y-004** -- Label association on sort dropdowns (10 min)
9. **DATA-003** -- Fix QuoteForm error display (15 min)
10. **PERF-006** -- Update 2025 -> 2026 in titles (10 min)
11. **PERF-007** -- Add missing pages to sitemap (10 min)
12. **PERF-008** -- Add canonical URLs to blog posts (5 min)
13. **PERF-009** -- Change JSON-LD to afterInteractive (1 min)

### Sprint 2: Short-term (next 2 weeks)
14. **DATA-001** -- Fix price.starting type to `number | 'request'` + audit
15. **PERF-002** -- Slim down /browse data payload
16. **A11Y-001** -- QuoteForm modal focus trap + dialog semantics
17. **PERF-004** -- Extract Layout.tsx client boundary
18. **A11Y-008** -- Skip navigation link
19. **A11Y-010** -- Mobile menu focus management
20. **DATA-005** -- Browse page URL state sync

### Sprint 3: Medium-term (next month)
21. **A11Y-005** -- SpecificationTable semantic table refactor
22. **PERF-005** -- Pre-compute related robots
23. **DATA-004** -- Merge duplicate brands
24. **DATA-009** -- LLM output schema validation
25. **A11Y-012** -- Systematic SVG aria-hidden pass

---

*Report generated by 3-agent code review team on 2026-03-06*
*Reviewers: UX+Accessibility, Performance+SEO, Data Correctness+State Management*

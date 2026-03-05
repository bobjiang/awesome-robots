# P0 Fixes Implementation Plan

**Date:** 2026-03-06
**Branch:** `fix/p0-code-review-issues`
**Source:** `2026-03-06-code-review-report.md`

---

## Batch A -- Quick A11Y Attribute Fixes (5 issues)

### A11Y-002: Hamburger Button Missing Accessible Name

**File:** `src/components/Layout.tsx`
**Lines:** 50-58

**Current code (line 50-57):**
```tsx
<button
  onClick={() => setIsMenuOpen(!isMenuOpen)}
  className="text-gray-700 hover:text-blue-600 focus:outline-none"
>
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</button>
```

**New code:**
```tsx
<button
  onClick={() => setIsMenuOpen(!isMenuOpen)}
  className="text-gray-700 hover:text-blue-600 focus:outline-none"
  aria-label={isMenuOpen ? "Close main menu" : "Open main menu"}
  aria-expanded={isMenuOpen}
  aria-controls="mobile-navigation"
>
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</button>
```

**Also required:** Add `id="mobile-navigation"` to the mobile nav container (line 63):
```tsx
{isMenuOpen && (
  <div className="md:hidden" id="mobile-navigation">
```

**Edge cases:** None. `isMenuOpen` state already exists.

**Unit test approach:**
- Render Layout, find the button by role
- Assert `aria-label` is present and contains "menu"
- Assert `aria-expanded` is "false" initially
- Simulate click, assert `aria-expanded` changes to "true"
- Assert `aria-controls="mobile-navigation"` is present
- Assert the SVG has `aria-hidden="true"`

---

### A11Y-003: SearchBar Input Missing Accessible Label

**File:** `src/components/SearchBar.tsx`
**Lines:** 26-48

**Change 1 -- form element (line 26):**
```tsx
// OLD
<form onSubmit={handleSubmit} className={`relative ${className}`}>

// NEW
<form onSubmit={handleSubmit} className={`relative ${className}`} role="search">
```

**Change 2 -- input element (line 28-34):**
```tsx
// OLD
<input
  type="text"
  value={query}
  onChange={handleChange}
  placeholder={placeholder}
  className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
/>

// NEW
<input
  type="text"
  value={query}
  onChange={handleChange}
  placeholder={placeholder}
  aria-label="Search robots"
  className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
/>
```

**Change 3 -- SVG icon (line 36-46):**
```tsx
// OLD
<svg
  className="w-5 h-5 text-gray-400"
  fill="none"

// NEW
<svg
  className="w-5 h-5 text-gray-400"
  fill="none"
  aria-hidden="true"
```

**Unit test approach:**
- Render SearchBar, find input by role "textbox"
- Assert `aria-label="Search robots"` on the input
- Assert the form has `role="search"`
- Assert the SVG has `aria-hidden="true"`

---

### A11Y-004: Sort Dropdowns Missing Label Association

**Files (3 locations):**
1. `src/app/browse/page.tsx` lines 118-131
2. `src/components/CategoryBrowser.tsx` lines 96-108
3. `src/components/BrandBrowser.tsx` lines 82-94

All three follow the same pattern. The fix is identical for each:

**Current pattern:**
```tsx
<label className="text-sm font-medium text-gray-700">Sort by:</label>
<select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
>
```

**New pattern:**
```tsx
<label htmlFor="sort-select" className="text-sm font-medium text-gray-700">Sort by:</label>
<select
  id="sort-select"
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
>
```

**Important note for CategoryBrowser and BrandBrowser:** These components may appear on the same page as the browse page sort. To avoid duplicate IDs on the same DOM, use unique IDs per component:
- `browse/page.tsx`: `id="browse-sort-select"` / `htmlFor="browse-sort-select"`
- `CategoryBrowser.tsx`: `id="category-sort-select"` / `htmlFor="category-sort-select"`
- `BrandBrowser.tsx`: `id="brand-sort-select"` / `htmlFor="brand-sort-select"`

**However:** These components are used on different pages (browse, categories/[category], brands/[brand]), so they never coexist in the same DOM. Using `id="sort-select"` / `htmlFor="sort-select"` in all three is safe. Use the simpler approach unless a reviewer objects.

**Unit test approach:**
- Render each component (need to mock data)
- Assert `select` element has an `id`
- Assert a `label` element with matching `htmlFor` exists

---

### A11Y-006: QuoteForm Close Button Missing Accessible Name

**File:** `src/components/QuoteForm.tsx`
**Lines:** 118-125

**Current code:**
```tsx
<button
  onClick={onClose}
  className="text-gray-400 hover:text-gray-600"
>
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
</button>
```

**New code:**
```tsx
<button
  onClick={onClose}
  className="text-gray-400 hover:text-gray-600"
  aria-label="Close quote form"
>
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
</button>
```

**Unit test approach:**
- Render QuoteForm with required props (robotName, robotBrand, onClose)
- Find button with `aria-label="Close quote form"`
- Assert it exists

---

### A11Y-007: Newsletter iframe Missing title Attribute

**File:** `src/components/NewsletterSignup.tsx`
**Lines:** 12-25

**Current code (line 12):**
```tsx
<iframe
  src="https://subscribe-forms.beehiiv.com/2ee91aa5-2585-40f5-b43c-d5c2600ea21c"
  data-test-id="beehiiv-embed"
  width="100%"
  height="320"
  frameBorder="0"
  scrolling="no"
```

**New code:**
```tsx
<iframe
  src="https://subscribe-forms.beehiiv.com/2ee91aa5-2585-40f5-b43c-d5c2600ea21c"
  data-test-id="beehiiv-embed"
  title="Newsletter signup form"
  width="100%"
  height="320"
  frameBorder="0"
  scrolling="no"
```

**Unit test approach:**
- Render NewsletterSignup
- Find iframe by `data-test-id="beehiiv-embed"`
- Assert `title="Newsletter signup form"` attribute exists

---

## Batch B -- SEO + Performance (3 issues)

### SEO-001: Remove Fabricated AggregateRating

**File:** `src/lib/structured-data.ts`
**Lines:** 170-223

**What to delete:**
1. Delete the entire `generateRating` function (lines 171-191).
2. Delete the call to `generateRating` (line 193): `const { rating, reviewCount } = generateRating(robot);`
3. Delete the `aggregateRating` property from the return object (lines 218-222):
   ```tsx
   aggregateRating: {
     "@type": "AggregateRating",
     ratingValue: rating,
     reviewCount: reviewCount
   },
   ```

**Also clean up the ProductSchema interface (lines 44-48):**
Remove the `aggregateRating?` property from the interface. Also remove `review?` (lines 49-60) since there are no reviews and it's unused.

**Resulting `generateProductSchema` function (simplified):**
```tsx
export function generateProductSchema(robot: Robot, baseUrl: string): ProductSchema {
  const productUrl = `${baseUrl}/robots/${robot.id}`;
  const imageUrls = robot.images?.map(img =>
    img.startsWith('http') ? img : `${baseUrl}${img}`
  ) || [`${baseUrl}/images/robots/${robot.id}.webp`];

  const hasPrice = robot.price && typeof robot.price.starting === 'number';
  const price = hasPrice ? robot.price.starting.toString() : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${robot.brand} ${robot.name}`,
    description: robot.description || `Advanced ${robot.category} robot by ${robot.brand}`,
    brand: {
      "@type": "Brand",
      name: robot.brand
    },
    category: robot.category,
    url: productUrl,
    image: imageUrls,
    offers: {
      "@type": "Offer",
      ...(price && { price }),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: productUrl,
      seller: {
        "@type": "Organization",
        name: robot.brand
      }
    },
    ...(robot.specifications && {
      additionalProperty: Object.entries(robot.specifications).map(([key, value]) => ({
        "@type": "PropertyValue",
        name: key.replace(/([A-Z])/g, ' $1').trim(),
        value: value?.toString() || 'Not specified'
      }))
    })
  };
}
```

**Unit test approach:**
```typescript
import { generateProductSchema } from '@/lib/structured-data';

it('should NOT include aggregateRating in product schema', () => {
  const robot = { /* minimal mock robot */ };
  const result = generateProductSchema(robot, 'https://example.com');
  expect(result).not.toHaveProperty('aggregateRating');
});

it('should NOT include review in product schema', () => {
  const robot = { /* minimal mock robot */ };
  const result = generateProductSchema(robot, 'https://example.com');
  expect(result).not.toHaveProperty('review');
});
```

---

### PERF-001: Remove force-dynamic, Add generateStaticParams

**File:** `src/app/robots/[id]/page.tsx`
**Lines:** 26-33

**Current code:**
```tsx
// KNOWN ISSUE: Next.js 16 Static Generation Bug
// Error: "Cannot destructure property 'auth' of 'a' as it is undefined"
// ...
// Workaround: Use dynamic rendering until Next.js 17 or bug is fixed upstream
// TODO: Retry with Next.js 17 when released
export const dynamic = 'force-dynamic';
```

**Step 1 -- Replace with `generateStaticParams`:**

Delete the entire comment block (lines 26-32) and the `export const dynamic = 'force-dynamic';` line (line 33).

Add `generateStaticParams` after the imports (before `generateMetadata`):

```tsx
export async function generateStaticParams() {
  return (robots as Robot[]).map((robot) => ({
    id: robot.id,
  }));
}
```

**Step 2 -- Verify the Next.js 16 bug is resolved:**

The comment says "Tested with Next.js 16.0.10 and 16.1.1 - bug persists in both versions." The project currently uses `"next": "^16.1.1"`. We need to test:

1. Run `npm run build` after the change.
2. If the build succeeds, the bug is fixed and we keep `generateStaticParams`.
3. If the build fails with "Cannot destructure property 'auth'", use ISR as fallback:
   ```tsx
   export const revalidate = 3600; // ISR: revalidate every hour
   ```

**Fallback approach (if static generation still fails):**
```tsx
// ISR fallback: revalidate every hour until Next.js fixes static gen bug
export const revalidate = 3600;

export async function generateStaticParams() {
  return (robots as Robot[]).map((robot) => ({
    id: robot.id,
  }));
}
```

**Unit test approach:**
- This is best tested via the build process itself. After `npm run build`, check that `.next/server/app/robots/` contains static HTML files.
- Unit test: assert that `generateStaticParams` returns an array of objects with `id` strings for all robots.

```typescript
it('generateStaticParams returns all robot IDs', async () => {
  // Import the module and test the function
  // Each entry should have an `id` property
  const params = await generateStaticParams();
  expect(params.length).toBeGreaterThan(100);
  expect(params[0]).toHaveProperty('id');
});
```

Since `generateStaticParams` is a page-level export, testing it requires importing the page module. A simpler approach: write a test that verifies the built output.

---

### PERF-003: Remove 'use client' from /brands and /categories, Add Metadata

**Files:**
1. `src/app/brands/page.tsx`
2. `src/app/categories/page.tsx`

#### brands/page.tsx

**Change 1 -- Remove 'use client' (line 1):**
Delete `'use client';` from line 1.

**Change 2 -- Add metadata export (add before the component):**
```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Robot Brands - Leading Robotics Companies | Awesome Robots',
  description: 'Explore leading robotics companies and their innovative AI-powered robots. From Boston Dynamics to Unitree, discover the brands shaping the future of robotics.',
  openGraph: {
    title: 'Robot Brands - Leading Robotics Companies | Awesome Robots',
    description: 'Explore leading robotics companies and their innovative AI-powered robots.',
    type: 'website',
  },
};
```

**Edge case:** Verify that `brands/page.tsx` has zero React hooks (useState, useEffect, etc.) and zero event handlers. Confirmed: the file only uses `Link`, `Image`, and maps over static JSON data. It has no interactivity. Safe to make server component.

#### categories/page.tsx

**Change 1 -- Remove 'use client' (line 1):**
Delete `'use client';` from line 1.

**Change 2 -- Add metadata export:**
```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Robot Categories - Humanoid, Quadruped & More | Awesome Robots',
  description: 'Explore our comprehensive collection of AI-powered robots organized by category. From humanoid companions to quadruped explorers, find the perfect robot for your needs.',
  openGraph: {
    title: 'Robot Categories - Humanoid, Quadruped & More | Awesome Robots',
    description: 'Explore AI-powered robots organized by category.',
    type: 'website',
  },
};
```

**Edge case:** Same verification -- categories/page.tsx has no hooks or event handlers. Safe to convert.

**Unit test approach:**
- Assert that the metadata export exists and has the expected title/description.
- Since these are server components, rendering tests are more complex. A simpler approach:

```typescript
import { metadata } from '@/app/brands/page';

it('brands page exports metadata with title', () => {
  expect(metadata).toBeDefined();
  expect(metadata.title).toContain('Robot Brands');
  expect(metadata.description).toBeTruthy();
});
```

- Build test: `npm run build` should produce static HTML for /brands and /categories.

---

## Batch C -- Data Integrity (1 issue)

### DATA-001: Fix price.starting Type Lie

**File:** `src/types/robot.ts`
**Line:** 8

**Current code:**
```tsx
price: {
  starting: number;
  currency: string;
  models: Array<{
    name: string;
    price: number | 'request';
  }>;
};
```

**New code:**
```tsx
price: {
  starting: number | 'request';
  currency: string;
  models: Array<{
    name: string;
    price: number | 'request';
  }>;
};
```

**Consumer audit -- all files using `price.starting`:**

| File | Line(s) | Current guard | Status |
|------|---------|--------------|--------|
| `browse/page.tsx` | 46, 70-76 | `typeof robot.price.starting === 'number'` | OK -- already guarded |
| `CategoryBrowser.tsx` | 40, 63-69 | `typeof robot.price.starting === 'number'` | OK -- already guarded |
| `BrandBrowser.tsx` | 42-48 | `typeof a.price.starting === 'number'` | OK -- already guarded |
| `robots/[id]/page.tsx` | 53 | `typeof robot.price.starting === 'number'` | OK -- already guarded |
| `ProductCard.tsx` | 95 | `formatPrice(robot.price.starting)` | OK -- `formatPrice` uses Zod runtime check |
| `price-utils.ts` | 44-53 | Zod `PriceSchema.safeParse(price)` | OK -- handles unknown |
| `structured-data.ts` | 167, 698 | `typeof robot.price.starting === 'number'` | OK -- already guarded |
| `InternalLinkingRecommendations.tsx` | uses price | Check needed | Read below |
| `categories/[category]/page.tsx` | uses price | Check needed | Read below |
| `brands/[brand]/page.tsx` | uses price | Check needed | Read below |
| `guides/BudgetTierRecommendations.tsx` | uses price | Check needed | Read below |
| `AISpecificationSummary.tsx` | uses price | Check needed | Read below |
| **`robot-utils.ts`** | **296-299** | **`a.price.starting ?? Infinity`** | **BUG -- needs fix** |

**Critical fix in `robot-utils.ts` (line 295-299):**

```tsx
// OLD (line 295-299)
case 'price': {
  const aPrice = a.price.starting ?? Infinity;
  const bPrice = b.price.starting ?? Infinity;
  comparison = (typeof aPrice === 'number' ? aPrice : Infinity) -
               (typeof bPrice === 'number' ? bPrice : Infinity);
  break;
}
```

The `??` (nullish coalescing) only converts `null`/`undefined` to `Infinity`. The string `"request"` is truthy, so `"request" ?? Infinity` evaluates to `"request"`. The subsequent `typeof` check on lines 298-299 does catch this case correctly, but lines 296-297 assign a misleading value. Simplify:

```tsx
// NEW
case 'price': {
  const aPrice = typeof a.price.starting === 'number' ? a.price.starting : Infinity;
  const bPrice = typeof b.price.starting === 'number' ? b.price.starting : Infinity;
  comparison = aPrice - bPrice;
  break;
}
```

**Also fix the shipping case tie-breaker (lines 309-310):** Already uses `typeof` guard. OK as-is.

**Remaining consumers to audit (implementer must read these files):**
- `src/components/InternalLinkingRecommendations.tsx` -- check how it uses price
- `src/app/categories/[category]/page.tsx` -- check price usage
- `src/app/brands/[brand]/page.tsx` -- check price usage
- `src/components/guides/BudgetTierRecommendations.tsx` -- check price usage
- `src/components/AISpecificationSummary.tsx` -- check price usage

For each: if it uses `typeof robot.price.starting === 'number'`, it's safe. If it does arithmetic directly on `price.starting`, add a guard.

**Unit test approach:**
```typescript
import { sortRobots } from '@/utils/robot-utils';

it('sortRobots by price does not produce NaN for "request" prices', () => {
  const robots = [
    { id: 'a', name: 'A', brand: 'X', price: { starting: 'request', currency: 'USD', models: [] } },
    { id: 'b', name: 'B', brand: 'Y', price: { starting: 5000, currency: 'USD', models: [] } },
    { id: 'c', name: 'C', brand: 'Z', price: { starting: 1000, currency: 'USD', models: [] } },
  ] as Robot[];

  const sorted = sortRobots(robots, 'price', 'asc');
  // "request" price robots should sort to the end
  expect(sorted[0].id).toBe('c');  // 1000
  expect(sorted[1].id).toBe('b');  // 5000
  expect(sorted[2].id).toBe('a');  // "request" -> Infinity
});

it('price.starting type accepts "request" string', () => {
  const robot: Robot = { ... price: { starting: 'request', ... } };
  // Should compile without error -- this is a compile-time check
});
```

---

## Batch D -- Complex Fixes (3 issues)

### A11Y-001: QuoteForm Modal -- Focus Trap, Dialog Semantics, Escape Key

**File:** `src/components/QuoteForm.tsx`
**Lines:** 113-274

This is the most complex fix. The modal currently:
- Uses `fixed inset-0 z-50` for overlay -- correct visually
- Has no `role="dialog"` or `aria-modal="true"`
- Has no focus trapping (Tab can escape to background)
- Has no Escape key handler
- Does not move focus into the modal on open
- Does not restore focus to the trigger button on close

**Implementation plan:**

**Step 1 -- Add dialog semantics to the outer wrapper (line 114):**
```tsx
// OLD
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">

// NEW
<div
  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  role="dialog"
  aria-modal="true"
  aria-labelledby="quote-form-title"
>
```

**Step 2 -- Add id to the title (line 117):**
```tsx
// OLD
<h3 className="text-xl font-semibold text-gray-900">Request Quote</h3>

// NEW
<h3 id="quote-form-title" className="text-xl font-semibold text-gray-900">Request Quote</h3>
```

**Step 3 -- Add focus trap with useEffect and useRef:**

Add refs and effect at the top of the component (after useState declarations):

```tsx
const dialogRef = useRef<HTMLDivElement>(null);
const previousActiveElement = useRef<HTMLElement | null>(null);

// Focus trap + Escape key handler
useEffect(() => {
  // Save the previously focused element
  previousActiveElement.current = document.activeElement as HTMLElement;

  // Focus the dialog
  const dialog = dialogRef.current;
  if (dialog) {
    dialog.focus();
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (e.key === 'Tab' && dialog) {
      const focusableElements = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    // Restore focus to trigger element
    previousActiveElement.current?.focus();
  };
}, [onClose]);
```

**Step 4 -- Add ref and tabIndex to the dialog container (line 115):**
```tsx
// OLD
<div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">

// NEW
<div
  ref={dialogRef}
  tabIndex={-1}
  className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden outline-none"
>
```

**Step 5 -- Add click-outside-to-close on the overlay:**
```tsx
// On the outer div, add onClick handler:
onClick={(e) => {
  if (e.target === e.currentTarget) onClose();
}}
```

**Step 6 -- Also fix the success state modal (lines 93-110):**
Apply the same `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` to the success state wrapper.

**Required import additions:**
```tsx
import { useState, useEffect, useRef } from 'react';
```

**Edge cases:**
- The `onClose` dependency in useEffect: stable if parent passes a memoized callback. If `onClose` is an inline arrow, it will re-run the effect on every render. The implementer should verify the parent component. Looking at the consumer `RobotQuoteButton.tsx`, the `onClose` is likely `() => setShowForm(false)` -- an inline arrow. Wrap with `useCallback` in the parent, or use a ref-based approach for `onClose` in the effect to avoid stale closures:
  ```tsx
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  // In effect, use onCloseRef.current instead of onClose
  ```

**Unit test approach:**
- Render QuoteForm
- Assert `role="dialog"` and `aria-modal="true"` on the wrapper
- Assert `aria-labelledby` matches the title id
- Simulate Escape keydown, assert `onClose` was called
- Verify focus is within the dialog after mount
- Simulate Tab from the last focusable element, verify focus wraps to first

---

### A11Y-005: SpecificationTable Semantic Table Refactor

**File:** `src/components/SpecificationTable.tsx` (939 lines)

This is the largest refactor. The file has 6 robot-specific table layouts plus a default fallback, all using `<div>` with CSS grid. Each must be converted to semantic `<table>`.

**Strategy:**

The current pattern uses:
```tsx
<div className="grid grid-cols-N">
  <div className="p-4 font-medium ...">Header Text</div>
  <div className="p-4 text-sm ...">Value</div>
</div>
```

Replace with:
```tsx
<tr>
  <th scope="row" className="p-4 font-medium text-left ...">Header Text</th>
  <td className="p-4 text-sm ...">Value</td>
</tr>
```

**Conversion template for each table variant:**

```tsx
// OLD wrapper
<div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
  <div className="grid grid-cols-N bg-blue-600 text-white">
    <div className="p-4 font-semibold border-r border-blue-500">Model</div>
    <div className="p-4 font-semibold text-center ...">Variant 1</div>
  </div>
  <div className="divide-y divide-gray-200">
    <div className="grid grid-cols-N">
      <div className="p-4 font-medium ... bg-gray-50 text-gray-900">Spec Name</div>
      <div className="p-4 text-sm ... text-gray-700">Value</div>
    </div>
  </div>
</div>

// NEW wrapper
<div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
  <table className="w-full">
    <thead className="bg-blue-600 text-white">
      <tr>
        <th scope="col" className="p-4 font-semibold text-left border-r border-blue-500">Model</th>
        <th scope="col" className="p-4 font-semibold text-center ...">Variant 1</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      <tr>
        <th scope="row" className="p-4 font-medium text-left bg-gray-50 text-gray-900 border-r border-gray-200">Spec Name</th>
        <td className="p-4 text-sm text-gray-700">Value</td>
      </tr>
    </tbody>
  </table>
</div>
```

**Key mapping rules:**
- Header row `div.grid` -> `thead > tr`
- Header cell `div` -> `th scope="col"`
- Data row `div.grid` -> `tr`
- Row header cell (spec name) `div` -> `th scope="row"` with `text-left`
- Data cell `div` -> `td`
- `col-span-N` -> `colSpan={N}`
- Remove `grid grid-cols-N` from all row elements
- Outer `divide-y` wrapping div -> `tbody` with same class

**Variants to convert (6 + 1 default):**
1. **Go2** (lines 38-143): 4-column table (Model, AIR, PRO, EDU)
2. **Go2-W** (lines 146-245): 2-column table (Specification, Go2-W)
3. **A2** (lines 248-387): 3-column table (Specification, A2, A2-PRO)
4. **B2** (lines 390-510): 2-column table (Specification, B2)
5. **H1** (lines 513-628): 3-column table (blank, H1, H1-2)
6. **X30** (lines 631-712): 3-column table (Specification, X30, X30 Pro)
7. **G1** (lines 715-860): 3-column table (Model, G1, G1 EDU)
8. **Default** (lines 863-938): 2-column key-value pairs

**Implementation approach:**
Apply the conversion mechanically to each variant. The implementer should:
1. Start with the default fallback (simplest, lines 863-938)
2. Then convert each robot-specific variant
3. Use find-and-replace within each block for the mechanical parts

**Edge cases:**
- Some rows span multiple columns (e.g., `col-span-3`). Convert to `colSpan={3}` on `<td>`.
- The Sensors row in Go2 (line 136) uses `col-span-3`. This becomes `<td colSpan={3}>`.
- Some cells contain `<ul>` lists (e.g., line 235). These work inside `<td>` elements.
- The `<br/>` elements in some cells (lines 464, 574) are valid inside `<td>`.

**Unit test approach:**
- Render SpecificationTable with mock robots matching each variant
- Assert the presence of `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>` elements
- Assert `scope="col"` on header cells
- Assert `scope="row"` on row header cells
- A simple test for the default fallback is sufficient for CI; manual screen reader testing for variants

---

### PERF-002: Split browse/page.tsx into Server + Client Components

**File:** `src/app/browse/page.tsx`
**Problem:** The entire page is `'use client'` and imports 407 KB of `robots.json`.

**Strategy:** Split into a server component that pre-renders with slimmed data, and a client component that handles filtering/sorting.

**Step 1 -- Define a slim robot type:**

Create a type for the minimal data needed by the browse page:

```typescript
// In the same file or a shared types file
interface BrowseRobot {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: {
    starting: number | 'request';
  };
  features: string[];
  images: string[];
  availability?: {
    status?: string;
  };
}
```

**Step 2 -- Create `src/app/browse/BrowseClient.tsx` (client component):**

Move all the current `BrowseContent` component logic into this new file. Change the data source from importing `robots.json` to receiving `robots` as a prop:

```tsx
'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
// ... other imports

interface BrowseClientProps {
  robots: BrowseRobot[];
  categories: Array<{ id: string; name: string; description: string; image: string }>;
}

function BrowseContent({ robots, categories }: BrowseClientProps) {
  // ... existing filter/sort logic, but using props instead of imported JSON
}
```

**Step 3 -- Convert `src/app/browse/page.tsx` to a server component:**

```tsx
import { Metadata } from 'next';
import Layout from '@/components/Layout';
import { Robot } from '@/types/robot';
import robots from '@/data/robots.json';
import categories from '@/data/categories.json';
import BrowseClient from './BrowseClient';

export const metadata: Metadata = {
  title: 'Browse All Robots - AI Robot Catalog | Awesome Robots',
  description: 'Discover our complete collection of AI-powered robots. Filter by category, brand, and price to find the perfect robot for your needs.',
};

// Slim the data server-side
function slimRobot(robot: Robot): BrowseRobot {
  return {
    id: robot.id,
    name: robot.name,
    brand: robot.brand,
    category: robot.category,
    description: robot.description,
    price: { starting: robot.price.starting },
    features: (robot.features || robot.keyFeatures || []).slice(0, 5),
    images: robot.images?.slice(0, 1) || [],
    availability: robot.availability ? { status: robot.availability.status } : undefined,
  };
}

export default function BrowseAllPage() {
  const slimRobots = (robots as Robot[]).map(slimRobot);

  return (
    <Layout>
      <BrowseClient robots={slimRobots} categories={categories} />
    </Layout>
  );
}
```

**Data size estimate:**
- Full robot: ~3.5 KB average (407 KB / 114 robots)
- Slim robot: ~300 bytes (id, name, brand, category, description[first 200 chars], price.starting, 1 image URL, 5 features)
- Total slim: ~34 KB (114 * 300 bytes) -- about 8% of original
- Gzipped: ~8-12 KB

**Edge cases:**
- `ProductCard` component needs to work with the slimmed data. It currently uses `robot.price.starting`, `robot.features`, `robot.keyFeatures`, `robot.images`, `robot.availability`. All are included in the slim type.
- `ProductCard` also uses `formatRobotWeight()` and `formatRobotBattery()` which access `robot.generalInfo`, `robot.specifications`, and `robot.hardwareBuildQuality`. These are NOT in the slim type. **Decision:** Either:
  - (A) Include weight/battery strings in the slim type (add ~50 bytes/robot), or
  - (B) Simplify ProductCard to skip weight/battery on the browse page, or
  - (C) Pre-compute formatted weight/battery server-side and include as strings

**Recommended:** Option (C). Add `weightDisplay` and `batteryDisplay` as pre-computed strings in `BrowseRobot`. This keeps the slim type simple and the ProductCard logic unchanged:

```typescript
interface BrowseRobot {
  // ... existing fields
  weightDisplay: string;
  batteryDisplay: string;
}
```

Then in `slimRobot`:
```tsx
weightDisplay: formatRobotWeight(robot),
batteryDisplay: formatRobotBattery(robot),
```

And update `ProductCard` to accept an optional `weightDisplay`/`batteryDisplay` prop that bypasses the utility function calls.

**Alternative simpler approach:** Just pass all the data as a server component prop. Next.js RSC serializes props to JSON for the client. The 407 KB will be in the RSC payload (HTML + JSON), not in the JS bundle. This is already a significant improvement over bundling it in client JS. The slimming adds further improvement but is optional for the P0 fix.

**Implementation decision:** Go with the full slim approach for maximum impact.

**Unit test approach:**
- Test the `slimRobot` function: input a full Robot, verify output has only expected fields
- Test that BrowseClient renders with slim data
- Build test: verify the browse page chunk size in `next build` output

---

## Summary: File Changes by Batch

### Batch A (5 files):
| File | Changes |
|------|---------|
| `src/components/Layout.tsx` | Add aria-label, aria-expanded, aria-controls to hamburger; add id to mobile nav |
| `src/components/SearchBar.tsx` | Add role="search" to form, aria-label to input, aria-hidden to SVG |
| `src/app/browse/page.tsx` | Add htmlFor/id to sort label/select |
| `src/components/CategoryBrowser.tsx` | Add htmlFor/id to sort label/select |
| `src/components/BrandBrowser.tsx` | Add htmlFor/id to sort label/select |
| `src/components/QuoteForm.tsx` | Add aria-label to close button, aria-hidden to close SVG |
| `src/components/NewsletterSignup.tsx` | Add title to iframe |

### Batch B (3 files):
| File | Changes |
|------|---------|
| `src/lib/structured-data.ts` | Delete generateRating(), remove aggregateRating from schema |
| `src/app/robots/[id]/page.tsx` | Remove force-dynamic, add generateStaticParams |
| `src/app/brands/page.tsx` | Remove 'use client', add metadata export |
| `src/app/categories/page.tsx` | Remove 'use client', add metadata export |

### Batch C (2 files):
| File | Changes |
|------|---------|
| `src/types/robot.ts` | Change `starting: number` to `starting: number \| 'request'` |
| `src/utils/robot-utils.ts` | Fix price sort to use typeof guard instead of ?? |

### Batch D (3 files):
| File | Changes |
|------|---------|
| `src/components/QuoteForm.tsx` | Add dialog role, focus trap, Escape handler, focus restoration |
| `src/components/SpecificationTable.tsx` | Convert all div grids to semantic table elements |
| `src/app/browse/page.tsx` | Split into server component + BrowseClient |
| `src/app/browse/BrowseClient.tsx` | NEW FILE: client-side filter/sort logic |

---

## Test File Locations

Following existing patterns (`tests/unit/` and `tests/e2e/`):

### Unit Tests:
- `tests/unit/components/Layout-a11y.test.tsx` -- A11Y-002 (hamburger aria)
- `tests/unit/components/SearchBar-a11y.test.tsx` -- A11Y-003 (search aria)
- `tests/unit/components/SortDropdown-a11y.test.tsx` -- A11Y-004 (label association for all 3 components)
- `tests/unit/components/QuoteForm-a11y.test.tsx` -- A11Y-006 (close button), A11Y-001 (dialog/focus trap)
- `tests/unit/components/NewsletterSignup-a11y.test.tsx` -- A11Y-007 (iframe title)
- `tests/unit/lib/structured-data.test.ts` -- SEO-001 (no aggregateRating)
- `tests/unit/utils/robot-utils-price.test.ts` -- DATA-001 (price sorting with 'request')
- `tests/unit/components/SpecificationTable-semantic.test.tsx` -- A11Y-005 (semantic table)
- `tests/unit/app/brands-metadata.test.ts` -- PERF-003 (metadata export)
- `tests/unit/app/categories-metadata.test.ts` -- PERF-003 (metadata export)

### Build/Integration Tests:
- PERF-001: Verified by `npm run build` succeeding and checking static output
- PERF-002: Verified by checking bundle size in build output

---

## Execution Order & Dependencies

```
Batch A (no dependencies, parallelize all 5)
  |
  v
Batch B (SEO-001 and PERF-003 are independent; PERF-001 depends on build test)
  |
  v
Batch C (DATA-001 type change -- do BEFORE Batch D since PERF-002 needs the type)
  |
  v
Batch D (A11Y-001, A11Y-005, PERF-002 are independent, parallelize)
  |
  v
Final: npm run lint && npm run type-check && npm run build
```

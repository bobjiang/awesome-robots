# CLAUDE.md

## Project Overview

**Awesome Robots** — a Next.js 15 catalog website for AI-powered robots (humanoids, quadrupeds, accessories). TypeScript, Tailwind CSS v4, Velite blog, static generation.

## Commands

```bash
npm run dev          # Dev server (turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run test         # All tests (Vitest)
npm run test:unit    # Unit tests only
npm run test:e2e     # E2E tests only
```

Verify before commit: `npm run lint && npm run type-check && npm run build`

## Consistency & Conflict Prevention

**Before coding:**
1. Read related files, imports, and types first. Match existing patterns.
2. Check for duplicate names, conflicting types, circular deps, inconsistent patterns.

**During coding:**
3. One pattern per concern — don't introduce alternatives without approval.
4. Check imports after every edit. Follow sibling file conventions.

**After coding:**
5. Run the full check suite (lint, type-check, build).
6. Log any conflicts in `CONFLICTS.md` with date, files, and resolution.

## Self-Learning

Treat every error/conflict/failure as a learning signal.

1. **Diagnose root cause** — ask "why?" before "how to fix?"
2. **Record in `LEARNINGS.md`** — error, root cause, fix, prevention.
3. **Update this file** if the error reveals a missing rule.
4. After multi-step tasks, self-review for inconsistencies and simplification opportunities.

## Don'ts

- No new deps without justification and checking `package.json` first.
- No shared type changes without checking all consumers.
- No `console.log` in committed code.
- No files outside established directory structure.
- No inline styles — use Tailwind.
- No `@ts-ignore` / `eslint-disable` without an explaining comment.

## Docs (read on demand)

- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — Tech stack, data architecture, routing, testing, env vars
- **[docs/ADDING-ROBOTS.md](docs/ADDING-ROBOTS.md)** — Adding robots, brands, content, data files
- **[docs/SEO.md](docs/SEO.md)** — Structured data, OG images, metadata, audit
- **[docs/WORKFLOWS.md](docs/WORKFLOWS.md)** — Weekly discovery, digest, analytics automation
- **[docs/SETUP.md](docs/SETUP.md)** — GitHub Actions and secrets config

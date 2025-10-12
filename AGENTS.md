# Repository Guidelines

## Project Structure & Module Organization
- Next.js routes and layouts live in `src/app/...`; keep route-specific UI, loaders, and metadata in the same folder for predictable navigation.
- Shared UI sits in `src/components`, while analytics and SEO helpers stay in `src/lib` and publishing clients in `src/utils`.
- Data and content inputs live in `src/data/*.json`, `content/` markdown, and `public/images/{robots|brands|categories}`; align shapes with `src/types/robot.ts` and refresh derived sets via `npm run organize-brands`.

## Build, Test, and Development Commands
- `npm run dev` runs the Turbopack dev server at `http://localhost:3000`.
- `npm run build` creates the production bundle; execute `npm run pre-build` whenever data or assets change so configs regenerate.
- `npm run start` serves the optimized build locally for release checks.
- `npm run lint` enforces the ESLint + Next.js rules; pair it with `npm run validate-data` / `npm run update-configs` before any branch push.

## Coding Style & Naming Conventions
- Work in strict TypeScript; favor the `@/...` path alias over deep relative imports and export only typed interfaces from `src/types`.
- Use two-space indentation, PascalCase for components, camelCase for variables and JSON keys, and prefix hooks with `use`.
- Prefer functional React components with Tailwind utility classes; keep repeated class clusters in shared components or constants.

## Testing Guidelines
- Minimum gate: `npm run lint` and `npm run validate-data`; record both in every PR.
- When adding automated tests, colocate specs under the feature directory (e.g., `src/app/robots/__tests__/`) and introduce an `npm test` script that the pipeline can call.
- For UI or content changes, describe manual QA steps and link preview URLs so reviewers can follow the flow.

## Commit & Pull Request Guidelines
- Mirror the existing short-prefix convention (`Fix:`, `Refactor:`, `Publish`) plus a focused summary, e.g., `Fix: Correct digest publish date`.
- Reference issue IDs or content tickets in the body, and keep commits narrow in scope to simplify rollbacks.
- PRs should cover purpose, testing summary (`lint`, `validate-data`, manual QA), and screenshots for visual changes; tag the maintainer responsible for `app`, `content`, or `automation`.

## Automation & Content Pipelines
- Publishing scripts live in `scripts/`; use `npm run publish-blog` for blog markdown and `npm run generate-digest` for weekly digests, committing any generated output.
- Schedule workflows with `scripts/weekly-digest-cron.sh`, always validating data first to prevent broken listings.

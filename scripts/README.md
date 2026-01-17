# Automation Scripts Documentation

This directory contains all automation scripts for the Awesome Robots project. These scripts power the weekly content discovery, robot extraction, digest generation, and analytics tracking.

## Overview

The automation pipeline consists of four main scripts that run sequentially:

```
fetch-articles.ts → extract-robots.ts → generate-digest.ts → update-analytics.ts
```

## Scripts

### 1. `fetch-articles.ts`

**Purpose:** Collect robotics articles from RSS feeds and arXiv without using any APIs.

**Command:**
```bash
npm run fetch-articles              # Collect from all sources
npm run fetch-articles -- --dry-run # Preview without saving
```

**What it does:**
- Fetches articles from last 7 days from:
  - IEEE TV RSS (https://ieeetv.ieee.org/channel_rss/channel_77/rss)
  - The Robot Report RSS (https://www.therobotreport.com/feed/)
  - arXiv cs.RO (https://arxiv.org/list/cs.RO/new)
- Parses HTML/XML using cheerio (no LLM calls)
- Saves to `data/collected-articles/YYYY-MM-DD.json`
- Includes metadata: title, link, date, source, description

**Input:** None (fetches from external sources)

**Output:**
```json
{
  "fetch_date": "2026-01-17T10:00:00.000Z",
  "week_range": "Jan 10-16",
  "summary": {
    "total_articles": 24,
    "ieee_count": 0,
    "robotreport_count": 15,
    "arxiv_count": 9
  },
  "articles": {
    "ieee": [...],
    "robotreport": [...],
    "arxiv": [...]
  }
}
```

**Cost:** Free (no API calls)

**Dependencies:**
- `axios` - HTTP requests
- `cheerio` - HTML/XML parsing
- `date-fns` - Date manipulation

---

### 2. `extract-robots.ts`

**Purpose:** Extract structured robot data from collected articles using Claude API.

**Command:**
```bash
export ANTHROPIC_API_KEY="your-key"
npm run extract-robots              # Process latest articles
npm run extract-robots -- --dry-run # Preview without saving
```

**What it does:**
- Reads latest collected articles from `data/collected-articles/`
- Uses Claude Sonnet 4.5 to extract robot information
- Deduplicates against existing robots in `src/data/robots.json`
- Assigns quality scores based on data completeness
- Saves to `data/discovered-robots/YYYY-MM-DD.json`

**Input:** `data/collected-articles/YYYY-MM-DD.json`

**Output:**
```json
{
  "fetch_date": "2026-01-17T10:00:00.000Z",
  "week_range": "Jan 10-16",
  "summary": {
    "total_discovered": 6,
    "duplicates_filtered": 1,
    "new_robots": 5,
    "quality_breakdown": {
      "high": 3,
      "medium": 2,
      "low": 0
    }
  },
  "robots": [
    {
      "company": "Boston Dynamics",
      "robot_name": "Atlas Next Gen",
      "type": "humanoid",
      "status": "prototype",
      "confidence_score": 95,
      "quality_score": {
        "overall": 92,
        "completeness": 100,
        "reliability": 85
      },
      "specs_link": "https://...",
      "source_link": "https://...",
      "description": "Next-generation humanoid robot..."
    }
  ]
}
```

**Cost:** ~$0.06 per run (Claude API)

**Environment variables:**
- `ANTHROPIC_API_KEY` (required) - Your Anthropic API key

**Dependencies:**
- `@anthropic-ai/sdk` - Anthropic API client
- Existing robots data for deduplication

---

### 3. `generate-digest.ts`

**Purpose:** Generate weekly Awesome Robots Digest blog post with industry insights.

**Command:**
```bash
export ANTHROPIC_API_KEY="your-key"
npm run generate-digest              # Generate digest
npm run generate-digest -- --dry-run # Preview without saving
```

**What it does:**
- Reads latest collected articles and discovered robots
- Uses Claude Sonnet 4.5 to create engaging blog content
- Generates markdown with proper frontmatter for Velite
- Determines next issue number automatically
- Saves to `content/blog/YYYY-MM-DD-digest-issue-N.md`

**Input:**
- `data/collected-articles/YYYY-MM-DD.json`
- `data/discovered-robots/YYYY-MM-DD.json`
- Previous digest posts for issue numbering

**Output:**
```markdown
---
title: "Awesome Robots Digest - Issue 17"
date: 2026-01-17
author: claude
category: news
tags: [weekly-digest, industry-news, humanoid-robots]
excerpt: "Weekly robotics highlights from Jan 10-16, 2026..."
image: /images/blog/digest-placeholder.jpg
---

## This Week's Highlights

[Generated content with insights, discoveries, and analysis]
```

**Cost:** ~$0.015 per run (Claude API)

**Environment variables:**
- `ANTHROPIC_API_KEY` (required) - Your Anthropic API key

**Dependencies:**
- `@anthropic-ai/sdk` - Anthropic API client
- `gray-matter` - Frontmatter parsing
- Previous digest posts for context

---

### 4. `update-analytics.ts`

**Purpose:** Update analytics dashboard with latest catalog and discovery metrics.

**Command:**
```bash
npm run update-analytics  # Update all analytics files
```

**What it does:**
- Aggregates robot catalog statistics from `src/data/robots.json`
- Tracks discovery trends from `data/discovered-robots/`
- Calculates brand and category distributions
- Updates time-series data for trend analysis
- Saves to `src/data/analytics-*.json`

**Input:**
- `src/data/robots.json` - Current robot catalog
- `data/discovered-robots/*.json` - Historical discoveries

**Output:**
Multiple analytics files:
- `src/data/analytics-overview.json` - Overall statistics
- `src/data/analytics-trends.json` - Time-series data
- `src/data/analytics-brands.json` - Brand distributions
- `src/data/analytics-categories.json` - Category breakdowns

**Cost:** Free (no API calls)

**Dependencies:**
- Node.js file system operations
- JSON parsing/stringification

## Development Guide

### Adding a New Script

1. Create TypeScript file in `scripts/` directory
2. Add to `package.json` scripts section:
   ```json
   "scripts": {
     "your-script": "tsx scripts/your-script.ts"
   }
   ```
3. Follow existing patterns for error handling and logging
4. Support `--dry-run` flag for testing
5. Document in this README

### Testing Scripts Locally

**Test without API costs:**
```bash
# Dry-run mode shows what would be generated
npm run extract-robots -- --dry-run
npm run generate-digest -- --dry-run
```

**Test full pipeline:**
```bash
# Set API key
export ANTHROPIC_API_KEY="your-key"

# Run full automation
npm run fetch-articles
npm run extract-robots
npm run generate-digest
npm run update-analytics
```

**Verify output:**
```bash
# Check generated files
ls -la data/collected-articles/
ls -la data/discovered-robots/
ls -la content/blog/*digest*
ls -la src/data/analytics-*.json
```

### Error Handling

All scripts include:
- **Try-catch blocks** for graceful error handling
- **Validation** of input data structure
- **Logging** of progress and errors to console
- **Exit codes** for CI/CD integration (0 = success, 1 = error)

**Common error patterns:**
```typescript
try {
  // Script logic
} catch (error) {
  console.error('Script failed:', error);
  process.exit(1);
}
```

### Best Practices

1. **Idempotency**: Scripts can be run multiple times safely
2. **Dry-run support**: Always support `--dry-run` for testing
3. **Error recovery**: Gracefully handle missing or malformed data
4. **Logging**: Provide clear progress and error messages
5. **Validation**: Verify data structure before processing
6. **Documentation**: Update this README when adding scripts

## GitHub Actions Integration

These scripts are executed automatically by `.github/workflows/weekly-robot-fetch.yml`:

```yaml
steps:
  - run: npm run fetch-articles
  - run: npm run extract-robots
    env:
      ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  - run: npm run generate-digest
    env:
      ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  - run: npm run update-analytics
```

**Environment setup:**
- See `docs/SETUP.md` for GitHub secrets configuration
- Workflow runs every Friday at 10 AM UTC
- Results are committed to feature branch and PR is created

## Troubleshooting

### Script Fails with API Error

```
Error: API key not found or invalid
```

**Solution:**
```bash
# Verify API key is set
echo $ANTHROPIC_API_KEY

# Set if missing
export ANTHROPIC_API_KEY="your-key-here"
```

### Missing Input Files

```
Error: Cannot find data/collected-articles/YYYY-MM-DD.json
```

**Solution:**
```bash
# Run prerequisite scripts first
npm run fetch-articles
```

### Permission Errors

```
Error: EACCES: permission denied
```

**Solution:**
```bash
# Ensure write permissions for data directories
chmod -R u+w data/ content/blog/ src/data/
```

### JSON Parse Errors

```
SyntaxError: Unexpected token in JSON
```

**Solution:**
- Validate JSON files with `jq` or JSON linter
- Check for trailing commas or syntax errors
- Delete corrupted files and regenerate

## Support

- **Documentation:** See `CLAUDE.md` for project architecture
- **Setup Guide:** See `docs/SETUP.md` for configuration
- **Issues:** Create GitHub issue with `automation` label
- **API Docs:** https://docs.anthropic.com

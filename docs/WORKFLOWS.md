# GitHub Actions Workflows

This document explains the automated workflows configured for the Awesome Robots project.

---

## Workflow Schedule Overview

| Workflow | Schedule | Purpose | Output |
|----------|----------|---------|--------|
| **Daily Robot Discovery** | Daily 01:07 UTC | Discover new robots from 12 RSS sources | PR with discovery data |
| **Weekly Digest & Analytics** | Friday 10:00 AM UTC | Generate digest & analytics | PR with blog post + analytics |

---

## Daily Robot Discovery

**File**: `.github/workflows/daily-robot-discovery.yml`
**Schedule**: Every day at 01:07 UTC
**Duration**: ~1-2 minutes
**Cost**: ~$0.04/day (~$1.20/month)

### What It Does

1. **Fetches RSS Feeds** (12 sources in parallel)
   - The Robot Report, IEEE Spectrum Robotics, TechCrunch Robotics
   - New Atlas Robotics, Robohub, NVIDIA Robotics Blog
   - Google DeepMind Blog, MIT News Robotics, Stanford AI Lab
   - BAIR Blog, Robotics & Automation News, arXiv cs.RO
   - No API costs - pure RSS parsing

2. **Deduplicates & Filters**
   - Removes duplicate URLs across feeds
   - Cross-day dedup against the last 7 days of discoveries
   - Pre-filters to cap at 60 items (3+ guaranteed per source)
   - Robot keyword filter (humanoid, quadruped, robotics, company names, etc.)

3. **Extracts Robots** (`npm run daily-discover`)
   - Uses Claude Sonnet API to extract robot information from filtered articles
   - Deduplicates against existing catalog (`src/data/robots.json`)
   - Assigns quality scores and confidence ratings
   - Saves to `data/daily-discoveries/YYYY-MM-DD.json`

4. **Creates Pull Request** (only when robots found)
   - Branch: `discovery/daily-YYYY-MM-DD`
   - Includes the daily discovery JSON file
   - Ready for manual review

### RSS Sources (12)

| Source | URL |
|--------|-----|
| The Robot Report | `therobotreport.com/feed/` |
| IEEE Spectrum Robotics | `spectrum.ieee.org/feeds/topic/robotics.rss` |
| TechCrunch Robotics | `techcrunch.com/category/robotics/feed/` |
| New Atlas Robotics | `newatlas.com/robotics/index.rss` |
| Robohub | `robohub.org/feed` |
| NVIDIA Robotics Blog | `blogs.nvidia.com/blog/category/robotics/feed` |
| Google DeepMind Blog | `deepmind.google/blog/feed/basic/` |
| MIT News Robotics | `news.mit.edu/topic/mitrobotics-rss.xml` |
| Stanford AI Lab | `ai.stanford.edu/blog/feed.xml` |
| BAIR Blog | `bair.berkeley.edu/blog/feed.xml` |
| Robotics & Automation News | `roboticsandautomationnews.com/feed` |
| arXiv cs.RO | `rss.arxiv.org/rss/cs.RO` |

### Pipeline Flow

```
12 RSS feeds (parallel) -> URL dedup -> cross-day dedup (7 days)
  -> pre-filter (60 max) -> robot keyword filter -> Claude extraction
  -> save JSON -> create PR if robots found
```

### Manual Trigger

1. Go to GitHub Actions -> Daily Robot Discovery
2. Click "Run workflow"
3. Select branch and click "Run workflow"

Or run locally:
```bash
export ANTHROPIC_API_KEY="your-api-key"
npm run daily-discover
```

---

## Weekly Digest & Analytics

**File**: `.github/workflows/weekly-robot-fetch.yml`
**Schedule**: Every Friday at 10:00 AM UTC
**Duration**: ~5-8 minutes

### What It Does

1. **Collects Articles** (`npm run fetch-articles`)
   - Fetches from IEEE TV, Robot Report, arXiv
   - No API costs

2. **Extracts Robots** (`npm run extract-robots`)
   - Uses Claude API for extraction
   - **Cost**: ~$0.06 per run

3. **Generates Digest** (`npm run generate-digest`)
   - Aggregates from daily discovery files (`data/daily-discoveries/`) for the last 7 days
   - Falls back to `data/discovered-robots/` if no daily files exist
   - Uses Claude API for content generation
   - Saves to `content/blog/YYYY-MM-DD-digest-issue-N.md`
   - **Cost**: ~$0.015 per run

4. **Updates Analytics** (`npm run update-analytics`)
   - Aggregates robot catalog statistics
   - No API costs

5. **Creates Pull Request**
   - Branch: `automation/weekly-digest-YYYY-MM-DD`
   - Ready for editorial review

### Manual Trigger

1. Go to GitHub Actions -> Weekly Robot Discovery & Digest Automation
2. Click "Run workflow"

---

## Cost Analysis

| Workflow | Schedule | Cost per Run | Monthly Cost |
|----------|----------|--------------|--------------|
| **Daily Discovery** | Daily | ~$0.04 | ~$1.20 |
| **Weekly Digest** | Weekly | ~$0.075 | ~$0.30 |
| **Total** | - | - | ~$1.50/month |

---

## Configuration

### Required Secrets

- `ANTHROPIC_API_KEY` - Set in GitHub Settings -> Secrets -> Actions

### Environment Variables

- `GITHUB_TOKEN` - Automatically provided by GitHub Actions
- `GH_TOKEN` - Alias for GITHUB_TOKEN (for gh CLI)

---

## Error Handling

Both workflows will:
1. **Automatic Retry**: Claude API calls retry with exponential backoff
2. **Graceful degradation**: RSS feed failures don't block other sources
3. **No PR on empty results**: If no robots found, no PR is created

### Manual Recovery

If automation fails, run locally:

```bash
export ANTHROPIC_API_KEY="your-api-key"

# Daily discovery
npm run daily-discover

# Weekly digest
npm run fetch-articles
npm run extract-robots
npm run generate-digest
npm run update-analytics

# Check outputs
ls -l data/daily-discoveries/
ls -l data/discovered-robots/
ls -l content/blog/
```

---

## Workflow Outputs

### Daily Discovery Output

```
data/
└── daily-discoveries/
    ├── 2026-04-01.json
    ├── 2026-04-02.json
    └── 2026-04-03.json
```

### Weekly Digest Output

```
data/
├── collected-articles/
│   └── 2026-04-04.json
├── discovered-robots/
│   └── 2026-04-04.json
└── analytics/
    └── *.json

content/
└── blog/
    └── awesome-robots-digest-issue-N.md
```

---

## Newsletter & Distribution

### Beehiiv Newsletter
- **Component**: `src/components/NewsletterSignup.tsx`
- Embeds beehiiv subscription form via iframe

### Discord Newsletter
- **Script**: `scripts/send-weekly-digest-newsletter.ts`
- **Workflow**: `.github/workflows/weekly-digest-newsletter.yml`
- **Required secret**: `DISCORD_NEWSLETTER_WEBHOOK_URL`
- Sends when a new digest post is pushed to main

### Claude Code PR Review
- **Workflow**: `.github/workflows/claude-code-review.yml`
- **Required secret**: `CLAUDE_CODE_OAUTH_TOKEN`
- Runs automated code review on every PR

---

## Additional Resources

- **Setup Guide**: `docs/SETUP.md`
- **Adding Robots**: `docs/ADDING-ROBOTS.md`
- **SEO Guide**: `docs/SEO.md`

---

**Last Updated**: April 3, 2026

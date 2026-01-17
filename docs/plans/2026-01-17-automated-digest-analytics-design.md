# Automated Digest & Analytics System Design

**Date:** 2026-01-17
**Status:** Approved for Implementation

## Overview

An integrated system that automates the weekly robot discovery workflow, generates digest drafts, and provides analytics insights - all through GitHub Actions creating a single PR for review every Friday.

## System Architecture

### Three Main Components

1. **Enhanced Discovery Pipeline**
   - Extends existing Friday GitHub Actions workflow
   - Automatically extracts robot data from collected articles
   - Tracks quality metrics and source effectiveness
   - Stores analytics in `data/analytics/` directory

2. **Digest Generation Engine**
   - Reads from collected articles and discovered robots
   - Uses Claude API for intelligent content analysis
   - Generates draft markdown following established digest template
   - Identifies themes, trends, and connections
   - Prioritizes content based on quality scores

3. **Automated GitHub Actions Workflow**
   - Friday 10:00 AM UTC: Collect articles (existing)
   - Friday 10:05 AM UTC: Extract robots using LLM (new)
   - Friday 10:15 AM UTC: Generate digest draft + analytics
   - Friday 10:20 AM UTC: Create single PR with all changes
   - User reviews/edits and merges PR

## Data Flow & File Structure

### New Directory Structure

```
data/
├── collected-articles/       # Existing
├── discovered-robots/        # Existing
├── analytics/                # NEW
│   ├── weekly/
│   │   └── YYYY-MM-DD.json  # Weekly metrics snapshot
│   ├── discovery-stats.json  # Cumulative source performance
│   └── trend-analysis.json   # Industry trends over time
└── digest-drafts/            # NEW
    └── YYYY-MM-DD-draft.md   # Generated digest drafts

content/blog/
└── awesome-robots-digest-issue-XX.md  # Final published digest
```

### Weekly Data Flow

1. **10:00 AM** - Fetch articles → `collected-articles/YYYY-MM-DD.json`
2. **10:05 AM** - Extract robots → `discovered-robots/YYYY-MM-DD.json`
3. **10:15 AM** - Generate digest draft → `data/digest-drafts/YYYY-MM-DD-draft.md`
4. **10:20 AM** - Create PR with draft, robots, analytics

## Digest Generation Logic

### Input Processing

Analyzes three data sources:
- Collected articles (IEEE/RobotReport/arXiv)
- Discovered robots with quality scores
- Existing catalog to identify new robots

### Content Analysis Pipeline

1. **Categorization** - Groups into company news, product launches, research, industry developments
2. **Theme Detection** - Identifies patterns (price democratization, medical milestones, etc.)
3. **Prioritization** - Ranks by quality score, newsworthiness, uniqueness, source reliability
4. **Narrative Generation** - Creates structured sections matching digest template

### Output Format

Generates markdown with:
- Proper frontmatter and SEO metadata
- TL;DR with 5-7 bullet points
- Organized sections (Top News, Research Spotlight, etc.)
- Editor comments for guidance

## Analytics & Tracking System

### Discovery Quality Metrics

Tracks source performance:
- Total articles vs robots discovered (conversion rate)
- Average quality scores by source
- Catalog addition rate
- Duplicate detection effectiveness

### Trend Analysis

Industry patterns over time:
- Price trends (humanoid/quadruped averages)
- Emerging companies and first mentions
- Technology keyword frequency
- Robot status distribution (research/prototype/commercial)

### Weekly Snapshot

Complete picture for historical analysis:
- Discovered robots with scores
- Source breakdown
- Top themes identified
- Robots added to catalog

## Implementation Architecture

### Technology Stack

- **Digest Generation**: Node.js + Anthropic SDK (Claude 3.5 Sonnet)
- **Analytics**: TypeScript with type-safe JSON operations
- **GitHub Actions**: Extended workflow with new steps
- **Secrets**: ANTHROPIC_API_KEY for LLM access

### Script Structure

```
scripts/
├── fetch-articles.js          # Existing
├── extract-robots.js          # NEW - LLM extraction
├── generate-digest.js         # NEW - Digest creation
├── update-analytics.js        # NEW - Analytics computation
└── lib/
    ├── anthropic-client.js    # Shared Claude API wrapper
    ├── digest-templates.js    # Prompt templates
    ├── analytics-engine.js    # Trend calculation
    └── github-utils.js        # PR creation helpers
```

## Error Handling & Resilience

### Failure Scenarios

1. Article fetch fails → Continue with partial data
2. Robot extraction fails → Create digest from articles only
3. Digest generation fails → Basic template with raw data
4. Analytics update fails → Non-blocking, log warning
5. API rate limits → Exponential backoff

### Data Validation

- JSON schema validation
- TypeScript interface enforcement
- Quality score bounds checking (0-100)
- Date format consistency (ISO 8601)
- Duplicate detection

## Cost Analysis

**Current Manual Process:**
- 2-3 hours/week review and writing
- $0 API costs (Claude Code Pro)

**Automated Process:**
- 5-10 minutes/week review
- ~$0.20/month API costs ($2.40/year)
- **Time Savings:** ~10 hours/month

## Migration & Rollout Plan

**Phase 1:** Robot extraction automation
**Phase 2:** Analytics foundation + backfill historical data
**Phase 3:** Digest generation with prompt engineering
**Phase 4:** PR automation end-to-end
**Phase 5:** Iteration based on feedback

## Success Criteria

✅ Draft digest quality matches manual versions (90%+ similarity)
✅ Robot extraction accuracy >85% (vs manual)
✅ Analytics provide actionable insights
✅ Time saved: 2+ hours/week
✅ Cost: <$5/month
✅ User maintains quality control through PR review

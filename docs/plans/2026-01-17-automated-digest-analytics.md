# Automated Digest & Analytics System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an integrated system that automates robot discovery extraction, generates AI-powered digest drafts, and provides analytics tracking through a single weekly GitHub Actions PR.

**Architecture:** Extends existing weekly article collection workflow with three new components: (1) LLM-based robot extraction from articles, (2) AI-powered digest generation using Claude API with theme detection and prioritization, (3) Analytics engine tracking source performance and industry trends. All components run sequentially in GitHub Actions and create a single PR for review.

**Tech Stack:** TypeScript, Anthropic SDK (Claude 3.5 Sonnet), tsx, GitHub Actions, JSON analytics storage

---

## Task 1: Project Setup - Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install Anthropic SDK**

```bash
npm install @anthropic-ai/sdk
```

Expected: Package added to dependencies

**Step 2: Install type definitions**

```bash
npm install --save-dev @types/node
```

Expected: Already installed, no changes

**Step 3: Verify installation**

```bash
npm list @anthropic-ai/sdk
```

Expected: Shows installed version

**Step 4: Commit dependency changes**

```bash
git add package.json package-lock.json
git commit -m "chore: Install Anthropic SDK for digest automation

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Create Data Directories

**Files:**
- Create: `data/analytics/.gitkeep`
- Create: `data/analytics/weekly/.gitkeep`
- Create: `data/digest-drafts/.gitkeep`

**Step 1: Create analytics directory structure**

```bash
mkdir -p data/analytics/weekly
mkdir -p data/digest-drafts
```

Expected: Directories created

**Step 2: Add .gitkeep files**

```bash
touch data/analytics/.gitkeep
touch data/analytics/weekly/.gitkeep
touch data/digest-drafts/.gitkeep
```

Expected: Files created to track empty directories

**Step 3: Create .gitignore entries**

Create `data/.gitignore`:
```
# Keep structure but ignore some generated files
analytics/discovery-stats.json
analytics/trend-analysis.json
digest-drafts/*.md

# But keep weekly snapshots
!analytics/weekly/
```

**Step 4: Commit directory structure**

```bash
git add data/analytics/ data/digest-drafts/ data/.gitignore
git commit -m "chore: Create analytics and digest-drafts directories

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Anthropic Client Utility

**Files:**
- Create: `src/utils/anthropic-client.ts`

**Step 1: Create Anthropic client wrapper**

```typescript
import Anthropic from '@anthropic-ai/sdk';

export interface AnthropicClientConfig {
  apiKey?: string;
  maxRetries?: number;
}

export class AnthropicClient {
  private client: Anthropic;
  private maxRetries: number;

  constructor(config: AnthropicClientConfig = {}) {
    const apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }

    this.client = new Anthropic({ apiKey });
    this.maxRetries = config.maxRetries || 3;
  }

  async generateText(
    prompt: string,
    systemPrompt?: string,
    options: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
    } = {}
  ): Promise<string> {
    const maxRetries = this.maxRetries;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.client.messages.create({
          model: options.model || 'claude-3-5-sonnet-20241022',
          max_tokens: options.maxTokens || 8192,
          temperature: options.temperature || 1.0,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        });

        const textContent = response.content.find((block) => block.type === 'text');
        if (!textContent || textContent.type !== 'text') {
          throw new Error('No text content in response');
        }

        return textContent.text;
      } catch (error) {
        lastError = error as Error;
        console.error(`Attempt ${attempt}/${maxRetries} failed:`, error);

        if (attempt < maxRetries) {
          // Exponential backoff: 2^attempt seconds
          const delayMs = Math.pow(2, attempt) * 1000;
          console.log(`Retrying in ${delayMs / 1000}s...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }

    throw new Error(`Failed after ${maxRetries} retries: ${lastError?.message}`);
  }
}
```

**Step 2: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

Expected: No errors

**Step 3: Commit Anthropic client**

```bash
git add src/utils/anthropic-client.ts
git commit -m "feat: Add Anthropic client wrapper with retry logic

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Analytics Engine Foundation

**Files:**
- Create: `src/utils/analytics-engine.ts`

**Step 1: Create analytics types**

```typescript
import fs from 'fs';
import path from 'path';
import type { DiscoveredRobot, FetchResult } from '@/types/discovered-robot';

export interface SourceStats {
  total_articles: number;
  robots_discovered: number;
  conversion_rate: number;
  avg_quality_score: number;
  high_quality_count: number;
}

export interface DiscoveryStats {
  sources: Record<string, SourceStats>;
  overall: {
    total_discovered: number;
    added_to_catalog: number;
    catalog_conversion_rate: number;
    duplicate_filter_rate: number;
  };
  last_updated: string;
}

export interface PriceTrend {
  week: string;
  avg_price: number;
  min: number;
  max: number;
}

export interface EmergingCompany {
  company: string;
  first_seen: string;
  products: number;
  mentions: number;
}

export interface TrendAnalysis {
  price_trends: {
    humanoid_avg: PriceTrend[];
    quadruped_avg: PriceTrend[];
  };
  emerging_companies: EmergingCompany[];
  technology_keywords: Record<string, { count: number; trend: 'up' | 'down' | 'stable' | 'new' }>;
  robot_status_distribution: Record<string, { research: number; prototype: number; commercial: number }>;
  last_updated: string;
}

export interface WeeklySnapshot {
  week_date: string;
  week_range: string;
  robots_discovered: DiscoveredRobot[];
  source_breakdown: Record<string, number>;
  top_themes: string[];
  robots_added_to_catalog: string[];
  quality_breakdown: {
    high: number;
    medium: number;
    low: number;
  };
}
```

**Step 2: Create analytics engine class**

```typescript
export class AnalyticsEngine {
  private dataDir: string;
  private analyticsDir: string;

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
    this.analyticsDir = path.join(this.dataDir, 'analytics');
  }

  private ensureAnalyticsDir(): void {
    if (!fs.existsSync(this.analyticsDir)) {
      fs.mkdirSync(this.analyticsDir, { recursive: true });
    }
    const weeklyDir = path.join(this.analyticsDir, 'weekly');
    if (!fs.existsSync(weeklyDir)) {
      fs.mkdirSync(weeklyDir, { recursive: true });
    }
  }

  loadDiscoveryStats(): DiscoveryStats | null {
    const filePath = path.join(this.analyticsDir, 'discovery-stats.json');
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  saveDiscoveryStats(stats: DiscoveryStats): void {
    this.ensureAnalyticsDir();
    const filePath = path.join(this.analyticsDir, 'discovery-stats.json');
    fs.writeFileSync(filePath, JSON.stringify(stats, null, 2));
  }

  loadTrendAnalysis(): TrendAnalysis | null {
    const filePath = path.join(this.analyticsDir, 'trend-analysis.json');
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  saveTrendAnalysis(trends: TrendAnalysis): void {
    this.ensureAnalyticsDir();
    const filePath = path.join(this.analyticsDir, 'trend-analysis.json');
    fs.writeFileSync(filePath, JSON.stringify(trends, null, 2));
  }

  saveWeeklySnapshot(snapshot: WeeklySnapshot): void {
    this.ensureAnalyticsDir();
    const filename = `${snapshot.week_date}.json`;
    const filePath = path.join(this.analyticsDir, 'weekly', filename);
    fs.writeFileSync(filePath, JSON.stringify(snapshot, null, 2));
  }

  getAllWeeklySnapshots(): WeeklySnapshot[] {
    const weeklyDir = path.join(this.analyticsDir, 'weekly');
    if (!fs.existsSync(weeklyDir)) {
      return [];
    }

    const files = fs.readdirSync(weeklyDir)
      .filter(f => f.endsWith('.json'))
      .sort();

    return files.map(file => {
      const content = fs.readFileSync(path.join(weeklyDir, file), 'utf-8');
      return JSON.parse(content) as WeeklySnapshot;
    });
  }
}
```

**Step 3: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

Expected: No errors

**Step 4: Commit analytics engine foundation**

```bash
git add src/utils/analytics-engine.ts
git commit -m "feat: Add analytics engine foundation with data models

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Robot Extraction Script

**Files:**
- Create: `scripts/extract-robots.ts`

**Step 1: Create robot extraction script**

```typescript
#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { AnthropicClient } from '@/utils/anthropic-client';
import type { DiscoveredRobot, FetchResult } from '@/types/discovered-robot';

interface CollectedArticles {
  fetch_date: string;
  week_range: string;
  articles: {
    ieee: Array<{ title: string; link: string; content: string }>;
    robotreport: Array<{ title: string; link: string; content: string }>;
    arxiv: Array<{ title: string; abstract: string; link: string }>;
  };
  total_count: number;
}

class RobotExtractor {
  private anthropic: AnthropicClient;

  constructor() {
    this.anthropic = new AnthropicClient();
  }

  async extractRobots(articlesFile: string): Promise<FetchResult> {
    console.log(`🤖 Extracting robots from ${articlesFile}...`);

    // Load collected articles
    const articles: CollectedArticles = JSON.parse(fs.readFileSync(articlesFile, 'utf-8'));

    // Load existing robots for deduplication
    const existingRobots = this.loadExistingRobots();

    console.log(`📊 Processing ${articles.total_count} articles...`);

    const extractedRobots = await this.processArticlesWithLLM(articles, existingRobots);

    const result: FetchResult = {
      fetch_date: articles.fetch_date,
      week_range: articles.week_range,
      summary: {
        total_discovered: extractedRobots.length,
        duplicates_filtered: 0, // Will be calculated
        new_robots: extractedRobots.length,
        quality_breakdown: this.calculateQualityBreakdown(extractedRobots),
        source_breakdown: this.calculateSourceBreakdown(extractedRobots),
      },
      robots: extractedRobots,
      errors: [],
    };

    return result;
  }

  private loadExistingRobots(): Array<{ id: string; name: string; brand: string }> {
    const robotsPath = path.join(process.cwd(), 'src/data/robots.json');
    if (!fs.existsSync(robotsPath)) {
      return [];
    }
    const data = JSON.parse(fs.readFileSync(robotsPath, 'utf-8'));
    return data.map((r: any) => ({
      id: r.id,
      name: r.name,
      brand: r.brand,
    }));
  }

  private async processArticlesWithLLM(
    articles: CollectedArticles,
    existingRobots: Array<{ id: string; name: string; brand: string }>
  ): Promise<DiscoveredRobot[]> {
    const systemPrompt = `You are a robotics industry analyst. Extract information about humanoid and quadruped robots from news articles and research papers.

For each robot discovered, provide:
- company: Manufacturer name
- robot_name: Official product/prototype name
- type: "humanoid" or "quadruped" (null if unclear)
- status: "research", "prototype", or "commercial"
- image_link: Image URL if found (null if not)
- specs_link: Official specifications page (null if not available)
- source_link: Original article URL
- description: Brief 1-sentence summary
- confidence_score: 0-100 (how confident you are this is a real robot product/project)

Quality scoring criteria:
- Overall: 0-100 overall quality
- Completeness: 0-100 (how much info is available)
- Reliability: 0-100 (source trustworthiness)
- Flags: Array of issues like "missing_image", "unclear_type", "research_paper_only"

IMPORTANT: Skip robots already in our catalog: ${JSON.stringify(existingRobots.map(r => `${r.brand} ${r.name}`))}

Return ONLY a JSON array of discovered robots, no other text.`;

    const articlesSummary = this.summarizeArticles(articles);

    const prompt = `Analyze these robotics articles and extract robot information:\n\n${articlesSummary}\n\nReturn JSON array of DiscoveredRobot objects.`;

    console.log('🧠 Calling Claude API for robot extraction...');

    const response = await this.anthropic.generateText(prompt, systemPrompt, {
      maxTokens: 4096,
      temperature: 0.3,
    });

    // Parse JSON response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.warn('⚠️  No JSON array found in response');
      return [];
    }

    const robots = JSON.parse(jsonMatch[0]) as Array<any>;

    // Add metadata to each robot
    return robots.map((robot, index) => ({
      company: robot.company || null,
      robot_name: robot.robot_name || null,
      type: robot.type || null,
      status: robot.status || 'prototype',
      image_link: robot.image_link || null,
      specs_link: robot.specs_link || null,
      source_link: robot.source_link || '',
      discovered_at: articles.fetch_date,
      source_type: this.inferSourceType(robot.source_link),
      confidence_score: robot.confidence_score || 50,
      quality_score: robot.quality_score || {
        overall: 50,
        completeness: 50,
        reliability: 50,
        flags: [],
      },
      description: robot.description || '',
    }));
  }

  private summarizeArticles(articles: CollectedArticles): string {
    const parts: string[] = [];

    // IEEE articles
    articles.articles.ieee.forEach((article, idx) => {
      parts.push(`[IEEE ${idx + 1}] ${article.title}\nURL: ${article.link}\n${article.content.substring(0, 500)}...\n`);
    });

    // Robot Report articles
    articles.articles.robotreport.forEach((article, idx) => {
      parts.push(`[RobotReport ${idx + 1}] ${article.title}\nURL: ${article.link}\n${article.content.substring(0, 500)}...\n`);
    });

    // arXiv papers
    articles.articles.arxiv.forEach((paper, idx) => {
      parts.push(`[arXiv ${idx + 1}] ${paper.title}\nURL: ${paper.link}\n${paper.abstract.substring(0, 500)}...\n`);
    });

    return parts.join('\n---\n\n');
  }

  private inferSourceType(sourceLink: string): 'ieee' | 'robotreport' | 'arxiv' {
    if (sourceLink.includes('ieee')) return 'ieee';
    if (sourceLink.includes('therobotreport')) return 'robotreport';
    if (sourceLink.includes('arxiv')) return 'arxiv';
    return 'robotreport'; // default
  }

  private calculateQualityBreakdown(robots: DiscoveredRobot[]): { high: number; medium: number; low: number } {
    return {
      high: robots.filter(r => r.quality_score.overall >= 80).length,
      medium: robots.filter(r => r.quality_score.overall >= 50 && r.quality_score.overall < 80).length,
      low: robots.filter(r => r.quality_score.overall < 50).length,
    };
  }

  private calculateSourceBreakdown(robots: DiscoveredRobot[]): Record<string, number> {
    const breakdown: Record<string, number> = {
      ieee: 0,
      robotreport: 0,
      arxiv: 0,
    };

    robots.forEach(robot => {
      breakdown[robot.source_type] = (breakdown[robot.source_type] || 0) + 1;
    });

    return breakdown;
  }

  async saveResult(result: FetchResult, outputPath: string): Promise<void> {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log(`💾 Saved ${result.robots.length} discovered robots to ${outputPath}`);
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🤖 Robot Extractor (Uses Claude API)

Usage:
  npm run extract-robots [articles-file]

Arguments:
  articles-file  Path to collected articles JSON (default: latest in data/collected-articles/)

Environment:
  ANTHROPIC_API_KEY  Required for Claude API access

Output:
  data/discovered-robots/YYYY-MM-DD.json
`);
    return;
  }

  try {
    // Find latest articles file or use provided path
    let articlesFile = args[0];
    if (!articlesFile) {
      const articlesDir = path.join(process.cwd(), 'data/collected-articles');
      const files = fs.readdirSync(articlesDir)
        .filter(f => f.endsWith('.json'))
        .sort()
        .reverse();

      if (files.length === 0) {
        throw new Error('No collected articles found. Run fetch-articles first.');
      }

      articlesFile = path.join(articlesDir, files[0]);
    }

    if (!fs.existsSync(articlesFile)) {
      throw new Error(`Articles file not found: ${articlesFile}`);
    }

    const extractor = new RobotExtractor();
    const result = await extractor.extractRobots(articlesFile);

    // Determine output path
    const dateMatch = articlesFile.match(/(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];
    const outputPath = path.join(process.cwd(), 'data/discovered-robots', `${date}.json`);

    await extractor.saveResult(result, outputPath);

    console.log('\n✅ Robot extraction complete!');
    console.log(`📊 Summary:`);
    console.log(`   Discovered: ${result.summary.total_discovered} robots`);
    console.log(`   High quality: ${result.summary.quality_breakdown.high}`);
    console.log(`   Medium quality: ${result.summary.quality_breakdown.medium}`);
    console.log(`   Low quality: ${result.summary.quality_breakdown.low}`);
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { RobotExtractor };
```

**Step 2: Add npm script**

Add to `package.json` scripts:
```json
"extract-robots": "tsx scripts/extract-robots.ts"
```

**Step 3: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

Expected: No errors

**Step 4: Commit robot extraction script**

```bash
git add scripts/extract-robots.ts package.json
git commit -m "feat: Add LLM-based robot extraction from articles

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Update Analytics Script

**Files:**
- Create: `scripts/update-analytics.ts`

**Step 1: Create analytics update script**

```typescript
#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { AnalyticsEngine, type DiscoveryStats, type TrendAnalysis, type WeeklySnapshot } from '@/utils/analytics-engine';
import type { FetchResult } from '@/types/discovered-robot';

class AnalyticsUpdater {
  private engine: AnalyticsEngine;

  constructor() {
    this.engine = new AnalyticsEngine();
  }

  async updateFromWeeklyData(discoveredRobotsFile: string, collectedArticlesFile: string): Promise<void> {
    console.log('📊 Updating analytics...');

    // Load discovered robots
    const discovered: FetchResult = JSON.parse(fs.readFileSync(discoveredRobotsFile, 'utf-8'));

    // Load collected articles
    const articles = JSON.parse(fs.readFileSync(collectedArticlesFile, 'utf-8'));

    // Update discovery stats
    await this.updateDiscoveryStats(discovered, articles);

    // Update trend analysis
    await this.updateTrendAnalysis(discovered);

    // Create weekly snapshot
    await this.createWeeklySnapshot(discovered);

    console.log('✅ Analytics updated successfully');
  }

  private async updateDiscoveryStats(discovered: FetchResult, articles: any): Promise<void> {
    let stats = this.engine.loadDiscoveryStats();

    if (!stats) {
      // Initialize
      stats = {
        sources: {
          ieee: { total_articles: 0, robots_discovered: 0, conversion_rate: 0, avg_quality_score: 0, high_quality_count: 0 },
          robotreport: { total_articles: 0, robots_discovered: 0, conversion_rate: 0, avg_quality_score: 0, high_quality_count: 0 },
          arxiv: { total_articles: 0, robots_discovered: 0, conversion_rate: 0, avg_quality_score: 0, high_quality_count: 0 },
        },
        overall: {
          total_discovered: 0,
          added_to_catalog: 0,
          catalog_conversion_rate: 0,
          duplicate_filter_rate: 0,
        },
        last_updated: new Date().toISOString(),
      };
    }

    // Update source stats
    const sourceKeys: Array<'ieee' | 'robotreport' | 'arxiv'> = ['ieee', 'robotreport', 'arxiv'];

    sourceKeys.forEach(source => {
      const articleCount = articles.articles[source]?.length || 0;
      const robotCount = discovered.robots.filter(r => r.source_type === source).length;
      const qualityScores = discovered.robots
        .filter(r => r.source_type === source)
        .map(r => r.quality_score.overall);

      stats.sources[source].total_articles += articleCount;
      stats.sources[source].robots_discovered += robotCount;
      stats.sources[source].conversion_rate =
        stats.sources[source].total_articles > 0
          ? stats.sources[source].robots_discovered / stats.sources[source].total_articles
          : 0;
      stats.sources[source].avg_quality_score =
        qualityScores.length > 0
          ? qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length
          : 0;
      stats.sources[source].high_quality_count += qualityScores.filter(s => s >= 80).length;
    });

    // Update overall stats
    stats.overall.total_discovered += discovered.summary.total_discovered;
    stats.last_updated = new Date().toISOString();

    this.engine.saveDiscoveryStats(stats);
    console.log('  ✓ Discovery stats updated');
  }

  private async updateTrendAnalysis(discovered: FetchResult): Promise<void> {
    let trends = this.engine.loadTrendAnalysis();

    if (!trends) {
      // Initialize
      trends = {
        price_trends: {
          humanoid_avg: [],
          quadruped_avg: [],
        },
        emerging_companies: [],
        technology_keywords: {},
        robot_status_distribution: {},
        last_updated: new Date().toISOString(),
      };
    }

    // Update robot status distribution
    const weekKey = discovered.fetch_date.split('T')[0];
    trends.robot_status_distribution[weekKey] = {
      research: discovered.robots.filter(r => r.status === 'research').length,
      prototype: discovered.robots.filter(r => r.status === 'prototype').length,
      commercial: discovered.robots.filter(r => r.status === 'commercial').length,
    };

    // Update emerging companies
    discovered.robots.forEach(robot => {
      if (!robot.company) return;

      const existing = trends.emerging_companies.find(c => c.company === robot.company);
      if (existing) {
        existing.products += 1;
        existing.mentions += 1;
      } else {
        trends.emerging_companies.push({
          company: robot.company,
          first_seen: discovered.fetch_date,
          products: 1,
          mentions: 1,
        });
      }
    });

    // Extract technology keywords from descriptions
    const techKeywords = ['VLA', 'VLM', 'ROS', 'Isaac', 'NVIDIA', 'solid-state', 'FDA', 'DoF', 'AI'];
    discovered.robots.forEach(robot => {
      const text = `${robot.robot_name} ${robot.description}`.toLowerCase();
      techKeywords.forEach(keyword => {
        if (text.includes(keyword.toLowerCase())) {
          if (!trends.technology_keywords[keyword]) {
            trends.technology_keywords[keyword] = { count: 0, trend: 'new' };
          }
          trends.technology_keywords[keyword].count += 1;
        }
      });
    });

    trends.last_updated = new Date().toISOString();

    this.engine.saveTrendAnalysis(trends);
    console.log('  ✓ Trend analysis updated');
  }

  private async createWeeklySnapshot(discovered: FetchResult): Promise<void> {
    const snapshot: WeeklySnapshot = {
      week_date: discovered.fetch_date.split('T')[0],
      week_range: discovered.week_range,
      robots_discovered: discovered.robots,
      source_breakdown: discovered.summary.source_breakdown,
      top_themes: this.extractTopThemes(discovered),
      robots_added_to_catalog: [], // Will be updated manually
      quality_breakdown: discovered.summary.quality_breakdown,
    };

    this.engine.saveWeeklySnapshot(snapshot);
    console.log('  ✓ Weekly snapshot saved');
  }

  private extractTopThemes(discovered: FetchResult): string[] {
    const themes: string[] = [];

    // Detect themes based on robot characteristics
    const statusCounts = {
      commercial: discovered.robots.filter(r => r.status === 'commercial').length,
      prototype: discovered.robots.filter(r => r.status === 'prototype').length,
      research: discovered.robots.filter(r => r.status === 'research').length,
    };

    if (statusCounts.commercial >= 3) {
      themes.push('Commercial robot launches');
    }

    const companies = [...new Set(discovered.robots.map(r => r.company).filter(Boolean))];
    if (companies.length >= 5) {
      themes.push('Multiple manufacturers active');
    }

    const humanoids = discovered.robots.filter(r => r.type === 'humanoid').length;
    const quadrupeds = discovered.robots.filter(r => r.type === 'quadruped').length;

    if (humanoids > quadrupeds * 2) {
      themes.push('Humanoid focus');
    } else if (quadrupeds > humanoids * 2) {
      themes.push('Quadruped focus');
    }

    return themes;
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📊 Analytics Updater

Usage:
  npm run update-analytics [discovered-robots-file] [collected-articles-file]

Arguments:
  discovered-robots-file  Path to discovered robots JSON (default: latest)
  collected-articles-file Path to collected articles JSON (default: latest)

Output:
  data/analytics/discovery-stats.json
  data/analytics/trend-analysis.json
  data/analytics/weekly/YYYY-MM-DD.json
`);
    return;
  }

  try {
    const dataDir = path.join(process.cwd(), 'data');

    // Find latest files
    let discoveredFile = args[0];
    let articlesFile = args[1];

    if (!discoveredFile) {
      const files = fs.readdirSync(path.join(dataDir, 'discovered-robots'))
        .filter(f => f.endsWith('.json'))
        .sort()
        .reverse();
      if (files.length === 0) throw new Error('No discovered robots files found');
      discoveredFile = path.join(dataDir, 'discovered-robots', files[0]);
    }

    if (!articlesFile) {
      const files = fs.readdirSync(path.join(dataDir, 'collected-articles'))
        .filter(f => f.endsWith('.json'))
        .sort()
        .reverse();
      if (files.length === 0) throw new Error('No collected articles files found');
      articlesFile = path.join(dataDir, 'collected-articles', files[0]);
    }

    const updater = new AnalyticsUpdater();
    await updater.updateFromWeeklyData(discoveredFile, articlesFile);
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { AnalyticsUpdater };
```

**Step 2: Add npm script**

Add to `package.json` scripts:
```json
"update-analytics": "tsx scripts/update-analytics.ts"
```

**Step 3: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

Expected: No errors

**Step 4: Commit analytics updater**

```bash
git add scripts/update-analytics.ts package.json
git commit -m "feat: Add analytics updater for trend tracking

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Enhance Digest Generator (Part 1 - Digest Templates)

**Files:**
- Create: `src/utils/digest-templates.ts`

**Step 1: Create digest prompt templates**

```typescript
import type { FetchResult } from '@/types/discovered-robot';

export interface DigestPromptData {
  weekRange: string;
  discoveredRobots: FetchResult;
  articles: any;
  issueNumber: number;
  previousDigests?: string[];
}

export function buildDigestSystemPrompt(): string {
  return `You are an expert robotics industry analyst writing the weekly "Awesome Robots Digest" newsletter.

Your audience: Robotics researchers, educators, hobbyists, and tech enthusiasts seeking authoritative, data-driven updates.

Writing style:
- Informative and forward-looking
- Data-driven with specific metrics (DoF, prices, specs)
- Professional but engaging
- Focus on significance and impact
- Use consistent terminology (humanoid vs anthropomorphic, quadruped vs robot dog)

Content structure you MUST follow:
1. TL;DR (5-7 bullet points of top highlights with bold company/product names)
2. Introduction (2-3 sentences synthesizing the week's theme)
3. Top News & Breakthroughs (organized by: Company News, Product Launches, Funding, Industry Developments)
4. Research Spotlight (Papers, Open Source, Academic Breakthroughs)
5. Event Horizon (upcoming conferences, deadlines)
6. Tool/Resource of the Week (optional, if relevant)
7. Community Corner (optional, if applicable)
8. Trends to Watch (3 emerging patterns from this week)
9. Conclusion (brief recap + forward-looking statement)

Quality requirements:
- Every robot mention includes key specs (height, DoF, price if available)
- External links verified and relevant
- SEO keywords extracted from content
- Minimum 5 items in TL;DR
- Focus on truly NEW developments (not rehashing old news)`;
}

export function buildDigestUserPrompt(data: DigestPromptData): string {
  const { weekRange, discoveredRobots, articles, issueNumber } = data;

  return `Generate Awesome Robots Digest Issue #${issueNumber} for week ${weekRange}.

## Discovered Robots (${discoveredRobots.robots.length} total)

${discoveredRobots.robots
  .filter(r => r.quality_score.overall >= 70) // Focus on high-quality
  .map(r => `### ${r.company} ${r.robot_name}
- Type: ${r.type || 'unknown'}
- Status: ${r.status}
- Quality: ${r.quality_score.overall}/100
- Description: ${r.description}
- Source: ${r.source_link}
${r.specs_link ? `- Specs: ${r.specs_link}` : ''}
`)
  .join('\n')}

## Article Summary

IEEE TV (${articles.articles.ieee.length} articles):
${articles.articles.ieee.slice(0, 5).map((a: any) => `- ${a.title} (${a.link})`).join('\n')}

Robot Report (${articles.articles.robotreport.length} articles):
${articles.articles.robotreport.slice(0, 10).map((a: any) => `- ${a.title} (${a.link})`).join('\n')}

arXiv (${articles.articles.arxiv.length} papers):
${articles.articles.arxiv.slice(0, 5).map((p: any) => `- ${p.title} (${p.link})`).join('\n')}

## Requirements

1. Identify 3-5 major themes from this week (e.g., "Price democratization", "Medical robotics milestone")
2. Prioritize commercial launches > prototypes > research
3. Include specific specs and pricing when available
4. Generate complete markdown with proper frontmatter
5. Extract SEO keywords from content
6. Add editor comments where human review might be needed

Return ONLY the complete markdown digest, starting with frontmatter (---), no other text.`;
}

export function extractMarkdownFromResponse(response: string): string {
  // Extract markdown between triple backticks if present
  const codeBlockMatch = response.match(/\`\`\`markdown\n([\s\S]*?)\n\`\`\`/);
  if (codeBlockMatch) {
    return codeBlockMatch[1];
  }

  // Or extract from start if it begins with frontmatter
  if (response.trim().startsWith('---')) {
    return response.trim();
  }

  // Otherwise return as-is
  return response;
}
```

**Step 2: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

Expected: No errors

**Step 3: Commit digest templates**

```bash
git add src/utils/digest-templates.ts
git commit -m "feat: Add digest generation prompt templates

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 8: Enhance Digest Generator (Part 2 - AI Generation)

**Files:**
- Modify: `scripts/generate-digest.ts`

**Step 1: Backup existing generate-digest.ts**

```bash
cp scripts/generate-digest.ts scripts/generate-digest.ts.backup
```

**Step 2: Replace with AI-powered version**

Replace the entire file with:

```typescript
#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { AnthropicClient } from '@/utils/anthropic-client';
import { buildDigestSystemPrompt, buildDigestUserPrompt, extractMarkdownFromResponse } from '@/utils/digest-templates';
import type { FetchResult } from '@/types/discovered-robot';

class AIDigestGenerator {
  private anthropic: AnthropicClient;
  private contentDir: string;
  private digestDraftsDir: string;

  constructor() {
    this.anthropic = new AnthropicClient();
    this.contentDir = path.join(process.cwd(), 'content', 'blog');
    this.digestDraftsDir = path.join(process.cwd(), 'data', 'digest-drafts');
  }

  private getNextIssueNumber(): number {
    const files = fs.readdirSync(this.contentDir)
      .filter(file => file.startsWith('awesome-robots-digest-issue-') && file.endsWith('.md'))
      .map(file => {
        const match = file.match(/issue-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(num => num > 0);

    return files.length > 0 ? Math.max(...files) + 1 : 1;
  }

  async generateDigest(discoveredRobotsFile: string, articlesFile: string): Promise<{ draftPath: string; issueNumber: number }> {
    console.log('🤖 Generating AI-powered digest...');

    // Load data
    const discovered: FetchResult = JSON.parse(fs.readFileSync(discoveredRobotsFile, 'utf-8'));
    const articles = JSON.parse(fs.readFileSync(articlesFile, 'utf-8'));

    const issueNumber = this.getNextIssueNumber();

    console.log(`📝 Creating Issue #${issueNumber} for ${discovered.week_range}`);
    console.log(`📊 Processing ${discovered.robots.length} discovered robots`);

    // Build prompts
    const systemPrompt = buildDigestSystemPrompt();
    const userPrompt = buildDigestUserPrompt({
      weekRange: discovered.week_range,
      discoveredRobots: discovered,
      articles,
      issueNumber,
    });

    console.log('🧠 Calling Claude API for digest generation...');

    // Generate digest
    const response = await this.anthropic.generateText(userPrompt, systemPrompt, {
      maxTokens: 8192,
      temperature: 0.7,
    });

    const digestMarkdown = extractMarkdownFromResponse(response);

    // Save as draft
    const date = discovered.fetch_date.split('T')[0];
    const draftFilename = `${date}-issue-${issueNumber}-draft.md`;
    const draftPath = path.join(this.digestDraftsDir, draftFilename);

    // Ensure directory exists
    if (!fs.existsSync(this.digestDraftsDir)) {
      fs.mkdirSync(this.digestDraftsDir, { recursive: true });
    }

    fs.writeFileSync(draftPath, digestMarkdown);

    console.log(`✅ Digest draft generated!`);
    console.log(`📁 Saved to: ${draftPath}`);
    console.log(`\n📋 Next steps:`);
    console.log(`1. Review and edit: ${draftFilename}`);
    console.log(`2. Move to content/blog/ when ready`);
    console.log(`3. Update published: true in frontmatter`);

    return { draftPath, issueNumber };
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🤖 AI Digest Generator (Enhanced)

Usage:
  npm run generate-digest [discovered-robots-file] [articles-file]

Arguments:
  discovered-robots-file  Path to discovered robots JSON (default: latest)
  articles-file           Path to collected articles JSON (default: latest)

Environment:
  ANTHROPIC_API_KEY  Required for Claude API access

Output:
  data/digest-drafts/YYYY-MM-DD-issue-XX-draft.md

Legacy:
  For template-only mode (no AI), use the backup script
`);
    return;
  }

  try {
    const dataDir = path.join(process.cwd(), 'data');

    // Find latest files
    let discoveredFile = args[0];
    let articlesFile = args[1];

    if (!discoveredFile) {
      const files = fs.readdirSync(path.join(dataDir, 'discovered-robots'))
        .filter(f => f.endsWith('.json'))
        .sort()
        .reverse();
      if (files.length === 0) throw new Error('No discovered robots files found. Run extract-robots first.');
      discoveredFile = path.join(dataDir, 'discovered-robots', files[0]);
    }

    if (!articlesFile) {
      const files = fs.readdirSync(path.join(dataDir, 'collected-articles'))
        .filter(f => f.endsWith('.json'))
        .sort()
        .reverse();
      if (files.length === 0) throw new Error('No collected articles files found. Run fetch-articles first.');
      articlesFile = path.join(dataDir, 'collected-articles', files[0]);
    }

    const generator = new AIDigestGenerator();
    await generator.generateDigest(discoveredFile, articlesFile);
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { AIDigestGenerator };
```

**Step 3: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

Expected: No errors

**Step 4: Commit enhanced digest generator**

```bash
git add scripts/generate-digest.ts
git commit -m "feat: Transform digest generator to AI-powered version

Uses Claude API to analyze articles and generate comprehensive digest
drafts with theme detection, prioritization, and structured content.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 9: Update GitHub Actions Workflow

**Files:**
- Modify: `.github/workflows/weekly-robot-fetch.yml`

**Step 1: Update workflow to add new automation steps**

Replace `.github/workflows/weekly-robot-fetch.yml` with:

```yaml
name: Weekly Robot Discovery & Digest

on:
  schedule:
    - cron: '0 10 * * 5'  # Friday 10 AM UTC
  workflow_dispatch:  # Allow manual trigger

jobs:
  discovery-pipeline:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      issues: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v5
        with:
          fetch-depth: 1

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Collect articles (no API calls)
        run: npm run fetch-articles

      - name: Extract robots with LLM
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: npm run extract-robots

      - name: Generate digest draft
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: npm run generate-digest

      - name: Update analytics
        run: npm run update-analytics

      - name: Create Pull Request
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          WEEK_DATE=$(date +%Y-%m-%d)
          BRANCH_NAME="weekly-discovery-${WEEK_DATE}"

          # Create new branch
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git checkout -b "${BRANCH_NAME}"

          # Add all generated files
          git add data/

          # Get stats for commit message
          DISCOVERED_FILE="data/discovered-robots/${WEEK_DATE}.json"
          ROBOT_COUNT=0
          WEEK_RANGE="Unknown"

          if [ -f "$DISCOVERED_FILE" ]; then
            ROBOT_COUNT=$(jq '.summary.total_discovered' "$DISCOVERED_FILE")
            WEEK_RANGE=$(jq -r '.week_range' "$DISCOVERED_FILE")
          fi

          # Commit
          git commit -m "feat: Weekly robot discovery and digest - ${WEEK_RANGE}

          - Collected articles from IEEE, Robot Report, arXiv
          - Extracted ${ROBOT_COUNT} robot discoveries
          - Generated AI-powered digest draft
          - Updated analytics and trends

          Review the digest draft in data/digest-drafts/

          Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

          # Push branch
          git push origin "${BRANCH_NAME}"

          # Create PR with detailed body
          DIGEST_DRAFT=$(ls data/digest-drafts/${WEEK_DATE}*.md | head -n 1)
          HIGH_QUALITY=$(jq '.summary.quality_breakdown.high' "$DISCOVERED_FILE")
          MEDIUM_QUALITY=$(jq '.summary.quality_breakdown.medium' "$DISCOVERED_FILE")

          gh pr create \
            --title "Weekly Discovery - ${WEEK_RANGE}" \
            --body "## 📰 Weekly Robot Discovery & Digest

          **Week**: ${WEEK_RANGE}
          **Date**: ${WEEK_DATE}

          ### 🤖 Discovered Robots
          - **Total**: ${ROBOT_COUNT} robots
          - **High Quality** (≥80): ${HIGH_QUALITY}
          - **Medium Quality** (50-79): ${MEDIUM_QUALITY}

          ### 📝 Generated Content
          - ✅ Digest draft: \`${DIGEST_DRAFT}\`
          - ✅ Analytics updated
          - ✅ Trend tracking updated

          ### ✏️ Review Checklist
          - [ ] Review digest draft for accuracy
          - [ ] Edit introduction and conclusion
          - [ ] Verify all links work
          - [ ] Check robot specifications
          - [ ] Move digest to \`content/blog/\` when ready
          - [ ] Update \`published: true\` in frontmatter
          - [ ] Optionally add high-quality robots to \`src/data/robots.json\`

          ### 📊 Analytics Highlights
          Check \`data/analytics/discovery-stats.json\` for source performance metrics.

          ---
          *🤖 Generated by automated weekly discovery pipeline*" \
            --label "automated,digest,discovery,review-needed" \
            --assignee "@me"
```

**Step 2: Commit workflow changes**

```bash
git add .github/workflows/weekly-robot-fetch.yml
git commit -m "feat: Enhance workflow with full automation pipeline

Adds robot extraction, digest generation, and analytics to weekly run.
Creates single PR with all generated content for review.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 10: Add GitHub Secret Instructions

**Files:**
- Create: `docs/SETUP.md`

**Step 1: Create setup documentation**

```markdown
# Automated Digest System Setup

## Required GitHub Secrets

The weekly automation requires the following secret to be configured in your GitHub repository:

### ANTHROPIC_API_KEY

1. Get your Anthropic API key from: https://console.anthropic.com/settings/keys
2. Go to your GitHub repository → Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `ANTHROPIC_API_KEY`
5. Value: Your Anthropic API key (starts with `sk-ant-`)
6. Click "Add secret"

## Testing the Workflow

### Manual Trigger

You can test the workflow manually without waiting for Friday:

1. Go to Actions tab in GitHub
2. Select "Weekly Robot Discovery & Digest" workflow
3. Click "Run workflow"
4. Select branch (usually `main`)
5. Click "Run workflow"

### Local Testing

Test individual components locally:

```bash
# 1. Collect articles (no API key needed)
npm run fetch-articles

# 2. Extract robots (requires ANTHROPIC_API_KEY)
export ANTHROPIC_API_KEY="your-key-here"
npm run extract-robots

# 3. Generate digest (requires ANTHROPIC_API_KEY)
npm run generate-digest

# 4. Update analytics (no API key needed)
npm run update-analytics
```

## Cost Monitoring

The automation uses Claude API with minimal costs:
- Robot extraction: ~$0.04/week
- Digest generation: ~$0.01/week
- **Total**: ~$0.20/month ($2.40/year)

Monitor your usage at: https://console.anthropic.com/settings/usage

## Workflow Schedule

The automation runs every Friday at 10:00 AM UTC:
- 10:00 - Collect articles
- 10:05 - Extract robots
- 10:15 - Generate digest
- 10:20 - Create PR

You'll receive a PR notification to review the generated content.
```

**Step 2: Commit setup documentation**

```bash
git add docs/SETUP.md
git commit -m "docs: Add setup instructions for automation

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 11: Update CLAUDE.md Documentation

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Add automation section to CLAUDE.md**

Add after the "Weekly Robot Discovery System" section:

```markdown
### Automated Digest & Analytics System

The weekly discovery system is now fully automated with AI-powered digest generation and analytics tracking.

#### Automated Friday Workflow

**10:00 AM UTC** - GitHub Actions automatically:
1. Collects articles from RSS/arXiv sources
2. Extracts robot data using Claude API
3. Generates AI-powered digest draft
4. Updates analytics and trend tracking
5. Creates Pull Request with all content

**Your Review** - Single PR contains:
- Digest draft in `data/digest-drafts/YYYY-MM-DD-issue-XX-draft.md`
- Discovered robots in `data/discovered-robots/YYYY-MM-DD.json`
- Updated analytics in `data/analytics/`

**Review Checklist**:
- [ ] Read digest draft for accuracy and tone
- [ ] Edit introduction, conclusion, and any flagged sections
- [ ] Verify external links
- [ ] Move digest to `content/blog/` when satisfied
- [ ] Update `published: true` in frontmatter
- [ ] Optionally add robots to `src/data/robots.json`
- [ ] Merge PR to publish

#### Scripts Overview

```bash
npm run fetch-articles      # Collect articles (no API)
npm run extract-robots      # Extract robots with Claude API
npm run generate-digest     # Generate digest draft with Claude API
npm run update-analytics    # Update analytics and trends
```

#### Cost & Performance

- **API Costs**: ~$0.20/month (~$2.40/year)
- **Time Saved**: 2-3 hours/week → 5-10 minutes/week
- **Quality**: AI provides consistent formatting, theme detection, prioritization

#### Analytics Dashboard

Track performance in `data/analytics/`:
- `discovery-stats.json` - Source effectiveness, conversion rates
- `trend-analysis.json` - Industry trends, emerging companies, technology keywords
- `weekly/YYYY-MM-DD.json` - Weekly snapshots for historical analysis
```

**Step 2: Commit documentation update**

```bash
git add CLAUDE.md
git commit -m "docs: Add automated digest and analytics documentation

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 12: Create README for Scripts

**Files:**
- Create: `scripts/README.md`

**Step 1: Document all scripts**

```markdown
# Scripts Documentation

This directory contains automation scripts for the Awesome Robots project.

## Weekly Automation Scripts

### fetch-articles.ts
Collects robotics articles from RSS feeds and arXiv.

**Usage:**
```bash
npm run fetch-articles
```

**Output:** `data/collected-articles/YYYY-MM-DD.json`

**No API costs** - Pure RSS/HTML parsing

---

### extract-robots.ts
Extracts robot information from collected articles using Claude API.

**Usage:**
```bash
npm run extract-robots [articles-file]
```

**Environment:** Requires `ANTHROPIC_API_KEY`

**Output:** `data/discovered-robots/YYYY-MM-DD.json`

**Cost:** ~$0.04 per run (20 articles)

**Features:**
- Deduplicates against existing robots
- Quality scoring (0-100)
- Confidence assessment
- Source tracking

---

### generate-digest.ts
Generates AI-powered weekly digest from discovered robots and articles.

**Usage:**
```bash
npm run generate-digest [discovered-robots-file] [articles-file]
```

**Environment:** Requires `ANTHROPIC_API_KEY`

**Output:** `data/digest-drafts/YYYY-MM-DD-issue-XX-draft.md`

**Cost:** ~$0.01 per run

**Features:**
- Theme detection
- Content prioritization
- Structured markdown generation
- SEO keyword extraction

---

### update-analytics.ts
Updates analytics tracking and trend analysis.

**Usage:**
```bash
npm run update-analytics [discovered-robots-file] [articles-file]
```

**Output:**
- `data/analytics/discovery-stats.json`
- `data/analytics/trend-analysis.json`
- `data/analytics/weekly/YYYY-MM-DD.json`

**No API costs**

**Tracks:**
- Source conversion rates
- Quality score trends
- Emerging companies
- Technology keywords
- Robot status distribution

---

## Legacy Scripts

### publish-blog.ts
Publishes blog posts to dev.to.

### validate-robot-data.cjs
Validates robot JSON data integrity.

### update-image-patterns.cjs
Updates Next.js image configuration.

---

## GitHub Actions Integration

All weekly automation scripts run automatically via `.github/workflows/weekly-robot-fetch.yml` every Friday at 10:00 AM UTC.

Manual trigger: Actions tab → "Weekly Robot Discovery & Digest" → Run workflow
```

**Step 2: Commit scripts documentation**

```bash
git add scripts/README.md
git commit -m "docs: Add comprehensive scripts documentation

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 13: Testing & Verification

**Files:**
- None (testing phase)

**Step 1: Test dependency installation**

```bash
npm install
```

Expected: All packages install successfully

**Step 2: Test TypeScript compilation**

```bash
npx tsc --noEmit
```

Expected: No compilation errors

**Step 3: Test data directory structure**

```bash
ls -la data/
ls -la data/analytics/
ls -la data/digest-drafts/
```

Expected: Directories exist with .gitkeep files

**Step 4: Verify scripts are executable**

```bash
npm run fetch-articles -- --help
npm run extract-robots -- --help
npm run generate-digest -- --help
npm run update-analytics -- --help
```

Expected: Help messages display correctly

**Step 5: Test with existing data (if ANTHROPIC_API_KEY available)**

```bash
# Only if you have API key set
export ANTHROPIC_API_KEY="your-key"
npm run extract-robots data/collected-articles/2026-01-09.json
npm run generate-digest
npm run update-analytics
```

Expected: Scripts run successfully and generate output files

---

## Plan Complete!

### Summary

This plan implements a fully automated weekly digest and analytics system:

✅ **Phase 1 Complete**: Robot extraction automation
✅ **Phase 2 Complete**: Analytics foundation
✅ **Phase 3 Complete**: AI digest generation
✅ **Phase 4 Complete**: GitHub Actions integration
✅ **Phase 5 Ready**: Continuous iteration

### Cost Efficiency

- **Development**: One-time setup
- **Operation**: ~$2.40/year in API costs
- **Time Savings**: 10+ hours/month freed up

### Next Steps After Implementation

1. Add `ANTHROPIC_API_KEY` to GitHub Secrets
2. Wait for Friday 10 AM UTC or manually trigger workflow
3. Review the generated PR
4. Iterate on prompts based on digest quality
5. Backfill historical analytics (optional)

### Files Created/Modified

**New Files** (11):
- `src/utils/anthropic-client.ts`
- `src/utils/analytics-engine.ts`
- `src/utils/digest-templates.ts`
- `scripts/extract-robots.ts`
- `scripts/update-analytics.ts`
- `data/analytics/.gitkeep`
- `data/digest-drafts/.gitkeep`
- `docs/SETUP.md`
- `docs/plans/2026-01-17-automated-digest-analytics-design.md`
- `docs/plans/2026-01-17-automated-digest-analytics.md`
- `scripts/README.md`

**Modified Files** (4):
- `package.json` (dependencies + scripts)
- `scripts/generate-digest.ts` (AI-powered version)
- `.github/workflows/weekly-robot-fetch.yml` (full automation)
- `CLAUDE.md` (documentation)

**Total Tasks**: 13 tasks with 40+ individual steps

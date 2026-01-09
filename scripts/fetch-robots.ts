#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import type { Robot } from '@/types/robot';
import type { FetchResult, DiscoveredRobot, FetchError } from '@/types/discovered-robot';
import { RSSParser } from '@/utils/robot-fetcher/rss-parser';
import { ArxivClient } from '@/utils/robot-fetcher/arxiv-client';
import { RobotDeduplicator } from '@/utils/robot-fetcher/deduplicator';
import { QualityScorer } from '@/utils/robot-fetcher/quality-scorer';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const DATA_SOURCES = {
  ieee: 'https://ieeetv.ieee.org/channel_rss/channel_77/rss',
  robotreport: 'https://www.therobotreport.com/feed/',
  arxiv: 'https://arxiv.org/list/cs.RO/new',
};

class RobotFetcher {
  private rssParser: RSSParser;
  private arxivClient: ArxivClient;
  private anthropicClient: AnthropicClient;
  private deduplicator: RobotDeduplicator;
  private qualityScorer: QualityScorer;

  constructor() {
    // Load existing robots
    const robotsPath = path.join(process.cwd(), 'src/data/robots.json');
    const existingRobots = JSON.parse(fs.readFileSync(robotsPath, 'utf-8')) as Robot[];

    console.log(`📊 Loaded ${existingRobots.length} existing robots for deduplication`);

    // Initialize clients
    this.rssParser = new RSSParser();
    this.arxivClient = new ArxivClient();
    this.anthropicClient = new AnthropicClient();
    this.deduplicator = new RobotDeduplicator(existingRobots);
    this.qualityScorer = new QualityScorer();
  }

  async fetchFromAllSources(singleSource?: string): Promise<FetchResult> {
    const allRobots: DiscoveredRobot[] = [];
    const errors: FetchError[] = [];

    // Determine which sources to fetch
    const sources: Array<() => Promise<DiscoveredRobot[]>> = [];

    if (!singleSource || singleSource === 'ieee') {
      sources.push(() => this.fetchIEEE());
    }
    if (!singleSource || singleSource === 'robotreport') {
      sources.push(() => this.fetchRobotReport());
    }
    if (!singleSource || singleSource === 'arxiv') {
      sources.push(() => this.fetchArxiv());
    }

    // Fetch from all sources in parallel
    const results = await Promise.allSettled(sources.map(fn => fn()));

    // Process results
    const sourceNames = ['ieee', 'robotreport', 'arxiv'].filter((name) => {
      return !singleSource || singleSource === name;
    });

    results.forEach((result, idx) => {
      const source = sourceNames[idx] || 'unknown';
      if (result.status === 'fulfilled') {
        console.log(`✅ ${source}: Found ${result.value.length} robots`);
        allRobots.push(...result.value);
      } else {
        console.error(`❌ ${source}: ${result.reason.message}`);
        errors.push({
          source,
          error: result.reason.message,
          timestamp: new Date().toISOString(),
        });
      }
    });

    console.log(`\n📦 Total robots fetched: ${allRobots.length}`);

    // Deduplicate
    const newRobots = allRobots.filter(r => !this.deduplicator.isDuplicate(r));
    console.log(`🔍 After deduplication: ${newRobots.length} new robots`);

    // Score quality
    newRobots.forEach(robot => {
      robot.quality_score = this.qualityScorer.scoreRobot(robot);
    });

    // Build result
    return this.buildResult(newRobots, allRobots.length, errors);
  }

  private async fetchIEEE(): Promise<DiscoveredRobot[]> {
    console.log('📡 Fetching from IEEE TV RSS...');
    const articles = await this.rssParser.fetchFeed(DATA_SOURCES.ieee);
    console.log(`   Found ${articles.length} recent articles`);

    const robots: DiscoveredRobot[] = [];

    for (const article of articles) {
      console.log(`   Analyzing: "${article.title.substring(0, 60)}..."`);
      const extracted = await this.anthropicClient.extractRobotData(
        article.content,
        article.link,
        'rss'
      );

      if (extracted.length > 0) {
        console.log(`   ✓ Extracted ${extracted.length} robot(s)`);
      }

      robots.push(...extracted.map(r => ({ ...r, source_type: 'ieee' as const })));
    }

    return robots;
  }

  private async fetchRobotReport(): Promise<DiscoveredRobot[]> {
    console.log('📡 Fetching from The Robot Report RSS...');
    const articles = await this.rssParser.fetchFeed(DATA_SOURCES.robotreport);
    console.log(`   Found ${articles.length} recent articles`);

    const robots: DiscoveredRobot[] = [];

    for (const article of articles) {
      console.log(`   Analyzing: "${article.title.substring(0, 60)}..."`);
      const extracted = await this.anthropicClient.extractRobotData(
        article.content,
        article.link,
        'rss'
      );

      if (extracted.length > 0) {
        console.log(`   ✓ Extracted ${extracted.length} robot(s)`);
      }

      robots.push(...extracted.map(r => ({ ...r, source_type: 'robotreport' as const })));
    }

    return robots;
  }

  private async fetchArxiv(): Promise<DiscoveredRobot[]> {
    console.log('📡 Fetching from arXiv cs.RO...');
    const papers = await this.arxivClient.fetchNewPapers();
    console.log(`   Found ${papers.length} recent papers`);

    const robots: DiscoveredRobot[] = [];

    for (const paper of papers) {
      console.log(`   Analyzing: "${paper.title.substring(0, 60)}..."`);
      const content = `${paper.title}\n\n${paper.abstract}`;
      const extracted = await this.anthropicClient.extractRobotData(
        content,
        paper.link,
        'arxiv'
      );

      if (extracted.length > 0) {
        console.log(`   ✓ Extracted ${extracted.length} robot(s)`);
      }

      robots.push(...extracted.map(r => ({ ...r, source_type: 'arxiv' as const })));
    }

    return robots;
  }

  async saveDiscoveries(result: FetchResult): Promise<string> {
    const outputDir = path.join(process.cwd(), 'data/discovered-robots');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filename = `${result.fetch_date.split('T')[0]}.json`;
    const filepath = path.join(outputDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(result, null, 2));
    console.log(`\n💾 Saved discoveries to: data/discovered-robots/${filename}`);

    return filepath;
  }

  async createGitHubIssue(result: FetchResult): Promise<void> {
    if (result.summary.new_robots === 0) {
      console.log('\n📝 Skipping GitHub issue creation (no new robots discovered)');
      return;
    }

    try {
      const issueBody = this.buildIssueBody(result);
      const issueTitle = `Weekly Robot Discoveries - ${result.week_range}`;

      // Use GitHub CLI to create issue
      const command = `gh issue create --title "${issueTitle}" --body "${issueBody.replace(/"/g, '\\"')}" --label "robot-data,automated,review-needed"`;

      const { stdout } = await execAsync(command);
      console.log(`\n📋 Created GitHub issue: ${stdout.trim()}`);
    } catch (error) {
      console.error('❌ Failed to create GitHub issue:', error);
      throw error;
    }
  }

  private buildIssueBody(result: FetchResult): string {
    const { summary, robots, errors } = result;

    let body = `## 🤖 Weekly Robot Discoveries Summary\n\n`;
    body += `**Week**: ${result.week_range}\n`;
    body += `**Fetch Date**: ${result.fetch_date}\n`;
    body += `**Total Discovered**: ${summary.total_discovered}\n`;
    body += `**New (After Deduplication)**: ${summary.new_robots}\n`;
    body += `**Duplicates Filtered**: ${summary.duplicates_filtered}\n\n`;

    body += `---\n\n## 📊 Quality Breakdown\n\n`;
    body += `- **High Quality** (≥80): ${summary.quality_breakdown.high} robots\n`;
    body += `- **Medium Quality** (50-79): ${summary.quality_breakdown.medium} robots\n`;
    body += `- **Low Quality** (<50): ${summary.quality_breakdown.low} robots\n\n`;

    body += `---\n\n## 📡 Source Breakdown\n\n`;
    Object.entries(summary.source_breakdown).forEach(([source, count]) => {
      body += `- **${source}**: ${count} robots\n`;
    });

    body += `\n---\n\n## 🆕 Discovered Robots\n\n`;

    robots.forEach((robot, idx) => {
      body += `### ${idx + 1}. ${robot.robot_name || 'Unknown'} by ${robot.company || 'Unknown'}\n\n`;
      body += `- **Type**: ${robot.type || 'Unknown'} (${robot.status})\n`;
      body += `- **Source**: [${robot.source_type}](${robot.source_link})\n`;
      body += `- **Quality Score**: ${robot.quality_score.overall}/100\n`;
      body += `- **Confidence**: ${robot.confidence_score}%\n`;
      body += `- **Image**: ${robot.image_link || '❌ Not found'}\n`;
      body += `- **Specs**: ${robot.specs_link || '❌ Not found'}\n`;

      if (robot.quality_score.flags.length > 0) {
        body += `- **Flags**: ${robot.quality_score.flags.join(', ')}\n`;
      }

      if (robot.description) {
        body += `\n> ${robot.description}\n`;
      }

      body += `\n---\n\n`;
    });

    if (errors.length > 0) {
      body += `## ⚠️ Errors Encountered\n\n`;
      errors.forEach(error => {
        body += `- **${error.source}**: ${error.error}\n`;
      });
      body += `\n---\n\n`;
    } else {
      body += `## ⚠️ Errors Encountered\n\n✅ No errors - all sources fetched successfully\n\n---\n\n`;
    }

    body += `## 📁 Data File\n\n`;
    body += `Full data saved to: \`data/discovered-robots/${result.fetch_date.split('T')[0]}.json\`\n\n`;

    body += `---\n\n## 🔄 Next Steps\n\n`;
    body += `1. **Review discoveries** in the JSON file\n`;
    body += `2. **Enrich data** for high-quality robots (add missing images, specs)\n`;
    body += `3. **Manually add** approved robots to \`src/data/robots.json\`\n`;
    body += `4. **Update brands** if new manufacturers discovered\n`;
    body += `5. **Close issue** when review complete\n\n`;

    body += `---\n\n*Generated by Weekly Robot Fetch automation*`;

    return body;
  }

  private buildResult(
    robots: DiscoveredRobot[],
    totalFetched: number,
    errors: FetchError[]
  ): FetchResult {
    const now = new Date();
    const weekRange = this.generateWeekDateRange(now);

    // Calculate quality breakdown
    const qualityBreakdown = {
      high: robots.filter(r => r.quality_score.overall >= 80).length,
      medium: robots.filter(r => r.quality_score.overall >= 50 && r.quality_score.overall < 80).length,
      low: robots.filter(r => r.quality_score.overall < 50).length,
    };

    // Calculate source breakdown
    const sourceBreakdown: Record<string, number> = {};
    robots.forEach(robot => {
      sourceBreakdown[robot.source_type] = (sourceBreakdown[robot.source_type] || 0) + 1;
    });

    return {
      fetch_date: now.toISOString(),
      week_range: weekRange,
      summary: {
        total_discovered: totalFetched,
        duplicates_filtered: totalFetched - robots.length,
        new_robots: robots.length,
        quality_breakdown: qualityBreakdown,
        source_breakdown: sourceBreakdown,
      },
      robots,
      errors,
    };
  }

  private generateWeekDateRange(date: Date): string {
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - 7);
    const endDate = new Date(date);
    endDate.setDate(date.getDate() - 1);

    const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });

    if (startMonth === endMonth) {
      return `${startMonth} ${startDate.getDate()}–${endDate.getDate()}`;
    } else {
      return `${startMonth} ${startDate.getDate()}–${endMonth} ${endDate.getDate()}`;
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🤖 Robot Data Fetcher

Usage:
  npm run fetch-robots [options]

Options:
  --dry-run         Preview without saving or creating issues
  --skip-issue      Don't create GitHub issue
  --source=X        Fetch from single source only (ieee|robotreport|arxiv)
  --help, -h        Show this help message

Examples:
  npm run fetch-robots                           # Full fetch
  npm run fetch-robots -- --dry-run              # Preview only
  npm run fetch-robots -- --source=robotreport   # Single source
  npm run fetch-robots -- --skip-issue           # No GitHub issue
`);
    return;
  }

  try {
    const fetcher = new RobotFetcher();
    console.log('🤖 Starting weekly robot fetch...\n');

    // Get source filter
    const sourceArg = args.find(arg => arg.startsWith('--source='));
    const singleSource = sourceArg ? sourceArg.split('=')[1] : undefined;

    if (singleSource) {
      console.log(`🎯 Fetching from single source: ${singleSource}\n`);
    }

    const result = await fetcher.fetchFromAllSources(singleSource);

    // Display summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 FETCH SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total discovered: ${result.summary.total_discovered}`);
    console.log(`Duplicates filtered: ${result.summary.duplicates_filtered}`);
    console.log(`New robots: ${result.summary.new_robots}`);
    console.log(`  - High quality (≥80): ${result.summary.quality_breakdown.high}`);
    console.log(`  - Medium quality (50-79): ${result.summary.quality_breakdown.medium}`);
    console.log(`  - Low quality (<50): ${result.summary.quality_breakdown.low}`);
    console.log('='.repeat(60));

    if (!args.includes('--dry-run')) {
      await fetcher.saveDiscoveries(result);

      if (!args.includes('--skip-issue')) {
        await fetcher.createGitHubIssue(result);
      }
    } else {
      console.log('\n🔍 DRY RUN - No files saved or issues created');
    }

    console.log(`\n✅ Fetch complete! Found ${result.summary.new_robots} new robots.`);
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Check if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { RobotFetcher };

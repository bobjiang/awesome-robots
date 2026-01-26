#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { AnthropicClient } from '../src/utils/anthropic-client';
import { AnalyticsEngine } from '../src/utils/analytics-engine';
import {
  buildDigestSystemPrompt,
  buildDigestUserPrompt,
  extractMarkdownFromResponse,
  DigestPromptData,
} from '../src/utils/digest-templates';
import { FetchResult } from '../src/types/discovered-robot';
import { BlogPublisher } from './publish-blog';

// ============================================================================
// AI Digest Generator Class
// ============================================================================

/**
 * AI-powered digest generator using Claude
 * Transforms weekly discovery data into engaging blog posts
 */
class AIDigestGenerator {
  private contentDir: string;
  private dataDir: string;
  private engine: AnalyticsEngine;
  private publisher: BlogPublisher;
  private aiClient: AnthropicClient;

  constructor() {
    this.contentDir = path.join(process.cwd(), 'content', 'blog');
    this.dataDir = path.join(process.cwd(), 'data');
    this.engine = new AnalyticsEngine(this.dataDir);
    this.publisher = new BlogPublisher();
    this.aiClient = new AnthropicClient();
  }

  /**
   * Get next issue number
   */
  private getNextIssueNumber(): number {
    const files = fs
      .readdirSync(this.contentDir)
      .filter(
        (file) =>
          file.startsWith('awesome-robots-digest-issue-') && file.endsWith('.md')
      )
      .map((file) => {
        const match = file.match(/issue-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter((num) => num > 0);

    return files.length > 0 ? Math.max(...files) + 1 : 1;
  }

  /**
   * Generate digest from weekly data using AI
   */
  async generateDigest(
    dateStr: string,
    options: { publish?: boolean; draft?: boolean } = {}
  ): Promise<{ filePath: string; issueNumber: number }> {
    console.log(`\n🤖 Generating AI-powered digest for ${dateStr}...`);

    // Load discovery data
    const discoveredPath = path.join(
      this.dataDir,
      'discovered-robots',
      `${dateStr}.json`
    );

    if (!fs.existsSync(discoveredPath)) {
      throw new Error(`Discovered robots file not found: ${discoveredPath}`);
    }

    const discoveredRobots: FetchResult = JSON.parse(
      fs.readFileSync(discoveredPath, 'utf-8')
    );

    // Load discovery stats
    const discoveryStats = this.engine.loadDiscoveryStats(dateStr);
    if (!discoveryStats) {
      throw new Error(
        `Discovery stats not found. Run: npm run update-analytics ${dateStr}`
      );
    }

    // Load trend analysis (optional)
    const trendAnalysis = this.engine.loadTrendAnalysis();

    // Load collected articles (optional)
    const collectedPath = path.join(
      this.dataDir,
      'collected-articles',
      `${dateStr}.json`
    );
    let collectedArticles;
    if (fs.existsSync(collectedPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(collectedPath, 'utf-8'));
        collectedArticles = data.sources;
      } catch (error) {
        console.warn('Could not load collected articles, continuing without them');
      }
    }

    // Prepare prompt data
    const issueNumber = this.getNextIssueNumber();
    const promptData: DigestPromptData = {
      weekRange: discoveredRobots.week_range,
      issueNumber,
      discoveryStats,
      discoveredRobots,
      trendAnalysis,
      collectedArticles,
    };

    // Generate digest using AI
    console.log(`📝 Generating digest with Claude...`);
    const systemPrompt = buildDigestSystemPrompt();
    const userPrompt = buildDigestUserPrompt(promptData);

    const response = await this.aiClient.generateText(userPrompt, systemPrompt, {
      model: 'claude-sonnet-4-5-20250929',
      maxTokens: 8192,
      temperature: 0.7,
    });

    // Extract markdown from response
    const digestContent = extractMarkdownFromResponse(response);

    // Save to file
    const fileName = `awesome-robots-digest-issue-${issueNumber}.md`;
    const filePath = path.join(this.contentDir, fileName);
    fs.writeFileSync(filePath, digestContent);

    console.log(`✅ Generated digest: ${fileName}`);
    console.log(`📁 Location: ${filePath}`);

    // Optionally publish
    if (options.publish) {
      console.log(`🚀 Publishing digest...`);
      try {
        await this.publisher.publishFromFile(filePath, {
          draft: options.draft ?? true,
        });
        console.log(`✅ Published to dev.to`);
      } catch (error) {
        console.error(`❌ Failed to publish: ${error}`);
        throw error;
      }
    }

    return { filePath, issueNumber };
  }

  /**
   * Generate digest from latest weekly data
   */
  async generateLatest(
    options: { publish?: boolean; draft?: boolean } = {}
  ): Promise<void> {
    // Find latest discovered robots file
    const discoveredDir = path.join(this.dataDir, 'discovered-robots');
    const files = fs
      .readdirSync(discoveredDir)
      .filter((f) => f.endsWith('.json') && f !== '.gitkeep')
      .sort()
      .reverse();

    if (files.length === 0) {
      throw new Error('No discovered robots files found');
    }

    const latestDate = files[0].replace('.json', '');
    console.log(`📅 Using latest discovery data: ${latestDate}`);

    await this.generateDigest(latestDate, options);

    if (!options.publish) {
      console.log(`\n💡 To publish the digest, run:`);
      console.log(`   npm run generate-digest --publish`);
    }
  }
}

// ============================================================================
// CLI Interface
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🤖 AI-Powered Awesome Robots Digest Generator

Generates weekly digest blog posts using Claude AI.

Usage:
  npm run generate-digest [options] [date]

Options:
  --publish          Publish to dev.to after generation
  --draft            Publish as draft (default: true)
  --help, -h         Show this help message

Arguments:
  date               Date in YYYY-MM-DD format (optional, uses latest if not specified)

Examples:
  npm run generate-digest                    # Generate from latest data
  npm run generate-digest 2026-01-09         # Generate from specific date
  npm run generate-digest --publish          # Generate and publish as draft
  npm run generate-digest --publish --no-draft # Generate and publish publicly

Note: Requires discovery stats. Run 'npm run update-analytics' first if needed.
`);
    return;
  }

  const generator = new AIDigestGenerator();

  const publish = args.includes('--publish');
  const draft = !args.includes('--no-draft');
  const dateArg = args.find((arg) => !arg.startsWith('--'));

  try {
    if (dateArg) {
      await generator.generateDigest(dateArg, { publish, draft });
    } else {
      await generator.generateLatest({ publish, draft });
    }

    console.log(`\n🎉 Digest generation complete!`);
  } catch (error) {
    console.error(
      '❌ Error:',
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}

// Check if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { AIDigestGenerator };

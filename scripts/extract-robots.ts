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

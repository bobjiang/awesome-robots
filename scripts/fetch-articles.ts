#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { RSSParser } from '@/utils/robot-fetcher/rss-parser';
import { ArxivClient } from '@/utils/robot-fetcher/arxiv-client';
import type { RSSArticle, ArxivPaper } from '@/types/discovered-robot';

const DATA_SOURCES = {
  ieee: 'https://ieeetv.ieee.org/channel_rss/channel_77/rss',
  robotreport: 'https://www.therobotreport.com/feed/',
  arxiv: 'https://arxiv.org/list/cs.RO/new',
};

interface CollectedArticles {
  fetch_date: string;
  week_range: string;
  articles: {
    ieee: RSSArticle[];
    robotreport: RSSArticle[];
    arxiv: ArxivPaper[];
  };
  total_count: number;
}

class ArticleCollector {
  private rssParser: RSSParser;
  private arxivClient: ArxivClient;

  constructor() {
    this.rssParser = new RSSParser();
    this.arxivClient = new ArxivClient();
  }

  async collectFromAllSources(): Promise<CollectedArticles> {
    console.log('📡 Collecting articles from all sources...\n');

    const [ieeeArticles, robotReportArticles, arxivPapers] = await Promise.all([
      this.fetchIEEE(),
      this.fetchRobotReport(),
      this.fetchArxiv(),
    ]);

    const now = new Date();
    const weekRange = this.generateWeekDateRange(now);

    const result: CollectedArticles = {
      fetch_date: now.toISOString(),
      week_range: weekRange,
      articles: {
        ieee: ieeeArticles,
        robotreport: robotReportArticles,
        arxiv: arxivPapers,
      },
      total_count: ieeeArticles.length + robotReportArticles.length + arxivPapers.length,
    };

    console.log('\n📊 Collection Summary:');
    console.log(`  IEEE TV: ${ieeeArticles.length} articles`);
    console.log(`  Robot Report: ${robotReportArticles.length} articles`);
    console.log(`  arXiv: ${arxivPapers.length} papers`);
    console.log(`  Total: ${result.total_count} items`);

    return result;
  }

  private async fetchIEEE(): Promise<RSSArticle[]> {
    try {
      console.log('📡 Fetching from IEEE TV RSS...');
      const articles = await this.rssParser.fetchFeed(DATA_SOURCES.ieee);
      console.log(`   ✓ Found ${articles.length} recent articles`);
      return articles;
    } catch (error) {
      console.error(`   ✗ Error: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  private async fetchRobotReport(): Promise<RSSArticle[]> {
    try {
      console.log('📡 Fetching from The Robot Report RSS...');
      const articles = await this.rssParser.fetchFeed(DATA_SOURCES.robotreport);
      console.log(`   ✓ Found ${articles.length} recent articles`);
      return articles;
    } catch (error) {
      console.error(`   ✗ Error: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  private async fetchArxiv(): Promise<ArxivPaper[]> {
    try {
      console.log('📡 Fetching from arXiv cs.RO...');
      const papers = await this.arxivClient.fetchNewPapers();
      console.log(`   ✓ Found ${papers.length} recent papers`);
      return papers;
    } catch (error) {
      console.error(`   ✗ Error: ${error instanceof Error ? error.message : String(error)}`);
      return [];
    }
  }

  async saveArticles(result: CollectedArticles): Promise<string> {
    const outputDir = path.join(process.cwd(), 'data/collected-articles');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filename = `${result.fetch_date.split('T')[0]}.json`;
    const filepath = path.join(outputDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(result, null, 2));
    console.log(`\n💾 Saved articles to: data/collected-articles/${filename}`);

    return filepath;
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

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
📰 Article Collector (No API Calls Required)

Usage:
  npm run fetch-articles

This script collects articles from RSS feeds and arXiv without any LLM processing.
Use Claude Code to process the collected articles and extract robot data.

Output: data/collected-articles/YYYY-MM-DD.json
`);
    return;
  }

  try {
    const collector = new ArticleCollector();
    console.log('📰 Starting article collection (no API calls)...\n');

    const result = await collector.collectFromAllSources();
    const filepath = await collector.saveArticles(result);

    console.log('\n✅ Collection complete!');
    console.log('\n🤖 Next step: Ask Claude Code to process these articles:');
    console.log(`   "Please extract robot data from ${filepath}"`);
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { ArticleCollector };

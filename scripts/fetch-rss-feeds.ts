#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import Parser from 'rss-parser';

export interface RSSSource {
  name: string;
  link: string;
  rssUrl: string;
  category: string;
}

export interface Article {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description?: string;
}

const ROBOT_KEYWORDS = [
  'humanoid',
  'quadruped',
  'robot dog',
  'bipedal',
  'legged robot',
  'robotics company',
  'robot launch',
  'walking robot',
  'robotic arm',
  'autonomous robot',
  'robot platform',
  'robot startup',
  'exoskeleton',
  'manipulation robot',
  'mobile robot',
  'collaborative robot',
  'cobot',
  'warehouse robot',
  'delivery robot',
  'surgical robot',
  'industrial robot',
];

/**
 * Parse the sources CSV and return only sources that have an RSS feed URL.
 */
export function parseSourcesCSV(csv: string): RSSSource[] {
  const lines = csv.trim().split('\n');
  // Skip header row
  const dataLines = lines.slice(1);
  const sources: RSSSource[] = [];

  for (const line of dataLines) {
    const fields = parseCSVLine(line);
    if (fields.length < 5) continue;

    const [name, link, , rssUrl, category] = fields;
    // Only include sources that have an RSS feed URL
    if (rssUrl && rssUrl.trim().length > 0) {
      sources.push({
        name: name.trim(),
        link: link.trim(),
        rssUrl: rssUrl.trim(),
        category: category.trim(),
      });
    }
  }

  return sources;
}

/**
 * Parse a single CSV line, handling quoted fields with commas.
 */
function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current);

  return fields;
}

/**
 * Filter articles to only those published within the last N days.
 */
export function filterRecentArticles(articles: Article[], days: number): Article[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  cutoff.setHours(0, 0, 0, 0);

  return articles.filter((article) => {
    const pubDate = new Date(article.pubDate);
    return !isNaN(pubDate.getTime()) && pubDate >= cutoff;
  });
}

/**
 * Check if an article is robot-related based on keywords in title and description.
 */
function isRobotRelated(article: Article): boolean {
  const text = `${article.title} ${article.description ?? ''}`.toLowerCase();
  return ROBOT_KEYWORDS.some((kw) => text.includes(kw));
}

/**
 * Deduplicate articles by link URL.
 */
function deduplicateArticles(articles: Article[]): Article[] {
  const seen = new Set<string>();
  return articles.filter((article) => {
    const normalized = article.link.replace(/\/$/, '').toLowerCase();
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

/**
 * Fetch and parse a single RSS feed.
 */
async function fetchFeed(source: RSSSource): Promise<Article[]> {
  const parser = new Parser({
    timeout: 10000,
    headers: {
      'User-Agent': 'AwesomeRobots/1.0 (+https://www.awesomerobots.xyz)',
    },
  });

  try {
    const feed = await parser.parseURL(source.rssUrl);
    const articles: Article[] = [];

    for (const item of feed.items) {
      if (!item.title || !item.link) continue;

      const description = (item.contentSnippet || item.content || item.summary || '')
        .slice(0, 500)
        .trim();

      articles.push({
        title: item.title.trim(),
        link: item.link.trim(),
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        source: source.name,
        description: description || undefined,
      });
    }

    return articles;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`  Failed to fetch ${source.name}: ${msg}`);
    return [];
  }
}

export async function main() {
  const csvPath = path.join(process.cwd(), 'content/sources/awesome-robotics-digest-sources.csv');
  const csv = fs.readFileSync(csvPath, 'utf-8');
  const sources = parseSourcesCSV(csv);

  console.log(`Found ${sources.length} sources with RSS feeds\n`);

  let allArticles: Article[] = [];

  for (const source of sources) {
    console.log(`Fetching: ${source.name} (${source.rssUrl})`);
    const articles = await fetchFeed(source);
    console.log(`  Got ${articles.length} articles`);
    allArticles.push(...articles);
  }

  console.log(`\nTotal articles fetched: ${allArticles.length}`);

  // Filter to last 7 days
  allArticles = filterRecentArticles(allArticles, 7);
  console.log(`After date filter (7 days): ${allArticles.length}`);

  // Filter to robot-related articles
  allArticles = allArticles.filter(isRobotRelated);
  console.log(`After keyword filter: ${allArticles.length}`);

  // Deduplicate
  allArticles = deduplicateArticles(allArticles);
  console.log(`After dedup: ${allArticles.length}`);

  // Save output
  const today = new Date().toISOString().split('T')[0];
  const outputDir = path.join(process.cwd(), 'data/collected-articles');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `${today}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(allArticles, null, 2));
  console.log(`\nSaved ${allArticles.length} articles to data/collected-articles/${today}.json`);
}

if (process.argv[1]?.includes('fetch-rss-feeds')) {
  main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}

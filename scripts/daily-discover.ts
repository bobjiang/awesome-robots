#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import Parser from 'rss-parser';
import Anthropic from '@anthropic-ai/sdk';
import type { DiscoveredRobot, FetchError } from '../src/types/discovered-robot';

// ============================================================================
// Types
// ============================================================================

export interface RSSItem {
  title: string;
  link: string;
  source: string;
  pubDate: string;
}

interface DailyDiscoveryResult {
  fetch_date: string;
  sources_fetched: number;
  sources_failed: number;
  articles_collected: number;
  articles_after_dedup: number;
  articles_after_filter: number;
  robots: DiscoveredRobot[];
  errors: FetchError[];
}

// ============================================================================
// Constants
// ============================================================================

const RSS_SOURCES: { name: string; url: string }[] = [
  { name: 'The Robot Report', url: 'https://www.therobotreport.com/feed/' },
  { name: 'IEEE Spectrum Robotics', url: 'https://spectrum.ieee.org/feeds/topic/robotics.rss' },
  { name: 'TechCrunch Robotics', url: 'https://techcrunch.com/category/robotics/feed/' },
  { name: 'New Atlas Robotics', url: 'https://newatlas.com/robotics/index.rss' },
  { name: 'Robohub', url: 'https://robohub.org/feed' },
  { name: 'NVIDIA Robotics Blog', url: 'https://blogs.nvidia.com/blog/category/robotics/feed' },
  { name: 'Google DeepMind Blog', url: 'https://deepmind.google/blog/feed/basic/' },
  { name: 'MIT News Robotics', url: 'https://news.mit.edu/topic/mitrobotics-rss.xml' },
  { name: 'Stanford AI Lab', url: 'https://ai.stanford.edu/blog/feed.xml' },
  { name: 'BAIR Blog', url: 'https://bair.berkeley.edu/blog/feed.xml' },
  { name: 'Robotics & Automation News', url: 'https://roboticsandautomationnews.com/feed' },
  { name: 'arXiv cs.RO', url: 'https://rss.arxiv.org/rss/cs.RO' },
  { name: 'Science Robotics', url: 'https://www.science.org/action/showFeed?type=etoc&feed=rss&jc=scirobotics' },
  { name: 'IJRR', url: 'https://journals.sagepub.com/action/showFeed?ui=0&mi=ehikzz&ai=2b4&jc=ijra&type=etoc&feed=rss' },
  { name: 'npj Robotics', url: 'https://www.nature.com/npjrobot.rss' },
];

const ROBOT_KEYWORDS = [
  'robot', 'robotics', 'humanoid', 'quadruped', 'bipedal', 'exoskeleton',
  'manipulation', 'locomotion', 'legged', 'actuator', 'end-effector',
  'gripper', 'autonomous mobile', 'cobots', 'cobot',
  // company names commonly associated with robots
  'boston dynamics', 'figure ai', 'unitree', 'agility robotics', 'apptronik',
  'sanctuary ai', 'tesla optimus', '1x technologies', 'fourier intelligence',
  'kepler robot', 'ubtech', 'xiaomi cyberone', 'pudu', 'anybotics',
];

const DAILY_DISCOVERIES_DIR = path.join(process.cwd(), 'data', 'daily-discoveries');

// ============================================================================
// Exported utility functions (tested)
// ============================================================================

export function deduplicateByUrl(items: RSSItem[]): RSSItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (!item.link || seen.has(item.link)) return false;
    seen.add(item.link);
    return true;
  });
}

export function isRobotRelated(item: RSSItem): boolean {
  const text = item.title.toLowerCase();
  return ROBOT_KEYWORDS.some((kw) => text.includes(kw));
}

export function preFilterItems(items: RSSItem[], maxItems = 60): RSSItem[] {
  if (items.length <= maxItems) return items;

  const bySource = new Map<string, RSSItem[]>();
  for (const item of items) {
    if (!bySource.has(item.source)) bySource.set(item.source, []);
    bySource.get(item.source)!.push(item);
  }

  // Guarantee at least 3 items per source, fill rest round-robin
  const guaranteed: RSSItem[] = [];
  const rest: RSSItem[] = [];
  for (const [, sourceItems] of bySource) {
    guaranteed.push(...sourceItems.slice(0, 3));
    rest.push(...sourceItems.slice(3));
  }

  return [...guaranteed, ...rest.slice(0, maxItems - guaranteed.length)];
}

// ============================================================================
// Cross-day dedup
// ============================================================================

export function loadPreviousDaysUrls(today: string, days = 7): Set<string> {
  const urls = new Set<string>();
  if (!fs.existsSync(DAILY_DISCOVERIES_DIR)) return urls;

  const files = fs
    .readdirSync(DAILY_DISCOVERIES_DIR)
    .filter((f) => f.endsWith('.json') && f !== '.gitkeep')
    .sort()
    .reverse();

  let count = 0;
  for (const file of files) {
    const date = file.replace('.json', '');
    if (date >= today) continue;
    if (count >= days) break;
    count++;

    try {
      const data: DailyDiscoveryResult = JSON.parse(
        fs.readFileSync(path.join(DAILY_DISCOVERIES_DIR, file), 'utf-8')
      );
      for (const robot of data.robots) {
        if (robot.source_link) urls.add(robot.source_link);
      }
    } catch {
      // skip corrupted files
    }
  }

  return urls;
}

// ============================================================================
// RSS Fetching
// ============================================================================

async function fetchAllFeeds(): Promise<{ items: RSSItem[]; errors: FetchError[] }> {
  const parser = new Parser({
    timeout: 15000,
    headers: { 'User-Agent': 'awesome-robots-discovery/1.0' },
  });

  const results = await Promise.all(
    RSS_SOURCES.map(async ({ name, url }) => {
      try {
        const feed = await parser.parseURL(url);
        const items: RSSItem[] = (feed.items || []).map((entry) => ({
          title: (entry.title || '').replace(/\n/g, ' ').trim(),
          link: entry.link || '',
          source: name,
          pubDate: entry.pubDate || entry.isoDate || '',
        }));
        return { items, error: null };
      } catch (e) {
        const error: FetchError = {
          source: name,
          error: e instanceof Error ? e.message : String(e),
          timestamp: new Date().toISOString(),
        };
        return { items: [] as RSSItem[], error };
      }
    })
  );

  const items = results.flatMap((r) => r.items);
  const errors = results.map((r) => r.error).filter((e): e is FetchError => e !== null);

  return { items, errors };
}

// ============================================================================
// Claude extraction
// ============================================================================

async function extractRobotsWithClaude(
  articles: RSSItem[],
  existingIds: string[]
): Promise<DiscoveredRobot[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required');
  }

  const client = new Anthropic({ apiKey });

  const articlesJson = JSON.stringify(
    articles.map(({ title, link, source, pubDate }) => ({ title, link, source, pubDate }))
  );

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    temperature: 0,
    system: `You are a robotics industry analyst. Extract NEW physical robots (humanoids, quadrupeds, exoskeletons, mobile manipulators) from news articles. Ignore software-only AI, simulations, or previously known robots.

Known robot IDs to skip (already in catalog): ${existingIds.join(', ')}

Return a JSON array of objects with these fields:
- company: string | null
- robot_name: string | null
- type: "humanoid" | "quadruped" | null
- status: "research" | "prototype" | "commercial"
- image_link: string | null
- specs_link: string | null
- source_link: string (the article URL)
- source_type: "ieee" | "robotreport" | "arxiv" | "news" | "press_release" | "company"
- confidence_score: number (0-1)
- description: string (one sentence)
- shipping_signal: "shipping_now" | "shipping_announced" | "preorder" | "pilot_only" | "unknown"

Only include robots you are confident are real, physical robots. If no new robots are found, return an empty array [].
Return ONLY valid JSON, no markdown fences or explanation.`,
    messages: [
      {
        role: 'user',
        content: `Extract new robots from these ${articles.length} articles:\n\n${articlesJson}`,
      },
    ],
  });

  const text =
    response.content[0].type === 'text' ? response.content[0].text : '';
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  try {
    const robots: DiscoveredRobot[] = JSON.parse(cleaned);
    const now = new Date().toISOString();
    return robots.map((r) => ({
      ...r,
      discovered_at: now,
      quality_score: {
        overall: r.confidence_score >= 0.7 ? 8 : r.confidence_score >= 0.4 ? 5 : 3,
        completeness: r.company && r.robot_name ? 8 : 4,
        reliability: r.confidence_score >= 0.7 ? 8 : 5,
        flags: [
          ...(!r.company ? ['missing_company' as const] : []),
          ...(!r.robot_name ? ['missing_robot_name' as const] : []),
          ...(!r.image_link ? ['missing_image' as const] : []),
        ],
      },
    }));
  } catch {
    return [];
  }
}

// ============================================================================
// Main pipeline
// ============================================================================

async function main() {
  const today = new Date().toISOString().split('T')[0];

  // Step 1: Fetch all RSS feeds in parallel
  const { items: rawItems, errors } = await fetchAllFeeds();
  const successCount = RSS_SOURCES.length - errors.length;

  for (const err of errors) {
    process.stderr.write(`Warning: ${err.source} failed: ${err.error}\n`);
  }

  // Step 2: Deduplicate by URL
  const dedupedItems = deduplicateByUrl(rawItems);

  // Step 3: Cross-day dedup
  const previousUrls = loadPreviousDaysUrls(today);
  const crossDayDeduped = dedupedItems.filter((item) => !previousUrls.has(item.link));

  // Step 4: Pre-filter to cap items
  const preFiltered = preFilterItems(crossDayDeduped, 60);

  // Step 5: Robot keyword filter
  const robotItems = preFiltered.filter(isRobotRelated);

  process.stdout.write(
    `Fetched: ${rawItems.length} items from ${successCount}/${RSS_SOURCES.length} sources\n` +
    `After URL dedup: ${dedupedItems.length}\n` +
    `After cross-day dedup: ${crossDayDeduped.length}\n` +
    `After pre-filter: ${preFiltered.length}\n` +
    `Robot-related: ${robotItems.length}\n`
  );

  // Step 6: Extract robots with Claude
  let robots: DiscoveredRobot[] = [];
  if (robotItems.length > 0) {
    const robotsJsonPath = path.join(process.cwd(), 'src', 'data', 'robots.json');
    const existingRobots = JSON.parse(fs.readFileSync(robotsJsonPath, 'utf-8'));
    const existingIds: string[] = existingRobots.map((r: { id: string }) => r.id);

    process.stdout.write(`Extracting robots with Claude from ${robotItems.length} articles...\n`);
    robots = await extractRobotsWithClaude(robotItems, existingIds);
    process.stdout.write(`Claude extracted ${robots.length} new robot(s)\n`);
  } else {
    process.stdout.write('No robot-related articles found today\n');
  }

  // Step 7: Save results
  if (!fs.existsSync(DAILY_DISCOVERIES_DIR)) {
    fs.mkdirSync(DAILY_DISCOVERIES_DIR, { recursive: true });
  }

  const result: DailyDiscoveryResult = {
    fetch_date: new Date().toISOString(),
    sources_fetched: successCount,
    sources_failed: errors.length,
    articles_collected: rawItems.length,
    articles_after_dedup: dedupedItems.length,
    articles_after_filter: robotItems.length,
    robots,
    errors,
  };

  const outputPath = path.join(DAILY_DISCOVERIES_DIR, `${today}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  process.stdout.write(`Saved to data/daily-discoveries/${today}.json\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    process.stderr.write(`Fatal error: ${e instanceof Error ? e.message : e}\n`);
    process.exit(1);
  });
}

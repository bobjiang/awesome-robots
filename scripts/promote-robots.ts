#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';
import type { DiscoveredRobot } from '../src/types/discovered-robot';
import type { BaseRobot } from '../src/types/robot';

// ============================================================================
// Constants
// ============================================================================

const ROBOTS_JSON_PATH = path.join(process.cwd(), 'src', 'data', 'robots.json');
const BRANDS_JSON_PATH = path.join(process.cwd(), 'src', 'data', 'brands.json');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'robots');
const DAILY_DISCOVERIES_DIR = path.join(process.cwd(), 'data', 'daily-discoveries');
const MIN_CONFIDENCE = 0.7;

// ============================================================================
// Exported utilities (tested)
// ============================================================================

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function buildRobotId(brand: string, name: string): string {
  return `${slugify(brand)}-${slugify(name)}`;
}

export function isPromotable(robot: DiscoveredRobot): boolean {
  return (
    robot.confidence_score >= MIN_CONFIDENCE &&
    robot.company !== null &&
    robot.robot_name !== null &&
    robot.type !== null
  );
}

export function robotAlreadyExists(
  brand: string,
  name: string,
  existingRobots: { id: string }[]
): boolean {
  const candidateId = buildRobotId(brand, name);
  return existingRobots.some((r) => r.id === candidateId);
}

export function buildImagePath(brand: string, name: string): {
  dir: string;
  localPath: string;
} {
  const slug = buildRobotId(brand, name);
  return {
    dir: path.join(IMAGES_DIR, slug),
    localPath: `/images/robots/${slug}/robot-1.jpg`,
  };
}

export async function downloadImage(
  url: string,
  destDir: string,
  filename: string
): Promise<boolean> {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    if (filename.includes('/') || filename.includes('..')) return false;

    const res = await fetch(url, {
      headers: { 'User-Agent': 'awesome-robots-promote/1.0' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return false;

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 1000) return false; // skip tiny/broken files

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.writeFileSync(path.join(destDir, filename), buffer);
    return true;
  } catch (e) {
    process.stderr.write(`    Image download error: ${e instanceof Error ? e.message : e}\n`);
    return false;
  }
}

// ============================================================================
// Internal functions (not exported)
// ============================================================================

async function enrichWithClaude(
  client: Anthropic,
  robot: DiscoveredRobot,
  robotId: string,
  imagePath: string
): Promise<BaseRobot> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    temperature: 0,
    system: `You are a robotics catalog editor. Given a discovered robot, generate a complete catalog entry as JSON.

Return a JSON object with these exact fields:
{
  "id": "${robotId}",
  "name": "<robot model name>",
  "brand": "<company name>",
  "category": "<humanoid|quadruped|accessory|other>",
  "price": { "starting": <number or "request">, "currency": "USD", "models": [{ "name": "Base", "price": <number or "request"> }] },
  "specifications": { "dimensions": "<HxWxD>", "weight": "<kg>", "dof": <number or null>, "maxSpeed": "<m/s or null>", "payload": "<kg or null>", "battery": "<description or null>" },
  "features": ["<8-10 short feature strings for card display>"],
  "images": ${imagePath ? `["${imagePath}"]` : '[]'},
  "officialUrl": "<official product URL or null>",
  "description": "<2-3 sentence marketing summary>",
  "timeline": { "announcedAt": "<ISO date if known>" },
  "availability": { "status": "${robot.status}", "regions": [] },
  "sources": [{ "kind": "press", "url": "${robot.source_link}" }],
  "lastVerifiedAt": "${new Date().toISOString().split('T')[0]}"
}

Use information from the article description. If you don't know a spec, use reasonable null or omit. Use "request" for unknown pricing. Return ONLY valid JSON, no markdown fences.`,
    messages: [
      {
        role: 'user',
        content: `Create catalog entry for:
Company: ${robot.company}
Robot: ${robot.robot_name}
Type: ${robot.type}
Status: ${robot.status}
Source: ${robot.source_link}
Specs page: ${robot.specs_link || 'N/A'}
Description: ${robot.description || 'N/A'}`,
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const parsed = JSON.parse(cleaned) as Record<string, unknown>;

  // Validate required fields before accepting
  if (
    typeof parsed.name !== 'string' ||
    typeof parsed.brand !== 'string' ||
    typeof parsed.description !== 'string' ||
    !Array.isArray(parsed.features) ||
    !Array.isArray(parsed.images)
  ) {
    throw new Error('Claude returned incomplete robot entry (missing required fields)');
  }

  return parsed as unknown as BaseRobot;
}

interface BrandEntry {
  id: string;
  name: string;
  description: string;
  website: string;
  logo: string;
  [key: string]: unknown; // preserve extra fields like country, founded
}

function ensureBrandExists(
  brands: BrandEntry[],
  company: string,
  description: string,
  website: string | null
): boolean {
  const brandId = slugify(company);
  if (brands.some((b) => b.id === brandId)) return false;

  brands.push({
    id: brandId,
    name: company,
    description: description || `${company} is a robotics company.`,
    website: website || '',
    logo: `/images/brands/${brandId}-logo.svg`,
  });

  // Sort brands alphabetically by id
  brands.sort((a, b) => a.id.localeCompare(b.id));
  return true;
}

// ============================================================================
// Main promotion pipeline
// ============================================================================

async function main() {
  const today = new Date().toISOString().split('T')[0];
  const discoveryPath = path.join(DAILY_DISCOVERIES_DIR, `${today}.json`);

  if (!fs.existsSync(discoveryPath)) {
    process.stdout.write(`No discovery file for ${today}, skipping promotion\n`);
    return;
  }

  const discovery = JSON.parse(fs.readFileSync(discoveryPath, 'utf-8'));
  const discovered: DiscoveredRobot[] = discovery.robots || [];

  const candidates = discovered.filter(isPromotable);
  if (candidates.length === 0) {
    process.stdout.write('No robots meet promotion criteria, skipping\n');
    return;
  }

  const existingRobots: BaseRobot[] = JSON.parse(fs.readFileSync(ROBOTS_JSON_PATH, 'utf-8'));
  const brands: BrandEntry[] = JSON.parse(fs.readFileSync(BRANDS_JSON_PATH, 'utf-8'));

  const newCandidates = candidates.filter(
    (r) => !robotAlreadyExists(r.company!, r.robot_name!, existingRobots)
  );
  if (newCandidates.length === 0) {
    process.stdout.write('All promotable robots already exist in catalog, skipping\n');
    return;
  }

  process.stdout.write(`Promoting ${newCandidates.length} robot(s) to catalog...\n`);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY environment variable is required');
  const client = new Anthropic({ apiKey });

  let promoted = 0;
  let brandsAdded = 0;

  for (const robot of newCandidates) {
    const robotId = buildRobotId(robot.company!, robot.robot_name!);
    process.stdout.write(`  Processing: ${robot.company} ${robot.robot_name} (${robotId})...\n`);

    const { dir, localPath } = buildImagePath(robot.company!, robot.robot_name!);
    let imagePath = '';
    if (robot.image_link) {
      const ok = await downloadImage(robot.image_link, dir, 'robot-1.jpg');
      if (ok) {
        imagePath = localPath;
        process.stdout.write(`    Image downloaded\n`);
      } else {
        process.stdout.write(`    Image download failed, continuing without image\n`);
      }
    }

    try {
      const entry = await enrichWithClaude(client, robot, robotId, imagePath);

      entry.id = robotId;
      const categoryMap: Record<string, BaseRobot['category']> = {
        humanoid: 'humanoid',
        quadruped: 'quadruped',
      };
      entry.category = categoryMap[robot.type!] ?? 'other';
      if (imagePath && (!entry.images || entry.images.length === 0)) {
        entry.images = [imagePath];
      }

      existingRobots.push(entry);
      promoted++;

      if (ensureBrandExists(brands, robot.company!, robot.description || '', entry.officialUrl)) {
        brandsAdded++;
        process.stdout.write(`    New brand added: ${robot.company}\n`);
      }

      process.stdout.write(`    Promoted to catalog\n`);
    } catch (e) {
      process.stderr.write(
        `    Failed to enrich ${robotId}: ${e instanceof Error ? e.message : e}\n`
      );
    }
  }

  if (promoted > 0) {
    existingRobots.sort((a, b) => a.id.localeCompare(b.id));
    fs.writeFileSync(ROBOTS_JSON_PATH, JSON.stringify(existingRobots, null, 2) + '\n');
    process.stdout.write(`Updated robots.json (${existingRobots.length} total robots)\n`);

    if (brandsAdded > 0) {
      fs.writeFileSync(BRANDS_JSON_PATH, JSON.stringify(brands, null, 2) + '\n');
      process.stdout.write(`Updated brands.json (${brands.length} total brands)\n`);
    }
  }

  process.stdout.write(
    `Done: ${promoted} promoted, ${newCandidates.length - promoted} failed, ${brandsAdded} new brands\n`
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
    .then(() => process.exit(0))
    .catch((e) => {
      process.stderr.write(`Fatal error: ${e instanceof Error ? e.message : e}\n`);
      process.exit(1);
    });
}

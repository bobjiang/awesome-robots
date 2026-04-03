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
  } catch {
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
  return JSON.parse(cleaned) as BaseRobot;
}

interface BrandEntry {
  id: string;
  name: string;
  description: string;
  website: string;
  logo: string;
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

// Suppress unused warnings — these will be used in the main promote flow
void enrichWithClaude;
void ensureBrandExists;

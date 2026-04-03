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

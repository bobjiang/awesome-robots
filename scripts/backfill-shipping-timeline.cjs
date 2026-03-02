#!/usr/bin/env node

/**
 * Backfill shipping/release timeline + sources for key robots.
 *
 * NOTE: Shipping dates are often not published precisely.
 * Use shippingAt only when there is explicit evidence; otherwise use shippingWindow.
 *
 * This script is intentionally plain Node (no tsx) so it remains robust.
 */

const fs = require('fs');
const path = require('path');

const ROBOTS_PATH = path.join(__dirname, '../src/data/robots.json');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}

function uniqSources(existing = [], incoming = []) {
  const out = [...existing];
  const seen = new Set(out.map(s => `${s.kind}:${s.url}`));
  for (const s of incoming) {
    const key = `${s.kind}:${s.url}`;
    if (!seen.has(key)) out.push(s);
    seen.add(key);
  }
  return out;
}

function patchRobot(robot, patch, nowIso) {
  robot.timeline = { ...(robot.timeline || {}), ...(patch.timeline || {}) };
  robot.availability = { ...(robot.availability || {}), ...(patch.availability || {}) };
  robot.sources = uniqSources(robot.sources || [], patch.sources || []);
  robot.lastVerifiedAt = nowIso;
}

function main() {
  const nowIso = new Date().toISOString();
  const robots = readJson(ROBOTS_PATH);
  const byId = new Map(robots.map(r => [r.id, r]));

  // Evidence-first patches.
  // If we only have “order now ships within X time”, we DO NOT set a historical shippingAt.
  // We set lastVerifiedAt + sources + availability.orderLink.
  const patches = {
    // Quadruped
    'unitree-go2': {
      availability: { status: 'commercial', orderLink: 'https://shop.unitree.com/products/unitree-go2' },
      sources: [{ kind: 'official', url: 'https://shop.unitree.com/products/unitree-go2' }],
      // Use releasedAt as a safe fallback (shippingAt is dynamic: “ship within 1 months”).
      timeline: { releasedAt: '2023-07-01' },
    },
    'unitree-g1': {
      availability: { status: 'commercial', orderLink: 'https://shop.unitree.com/products/unitree-g1' },
      sources: [{ kind: 'official', url: 'https://shop.unitree.com/products/unitree-g1' }],
      timeline: { releasedAt: '2024-01-01' },
    },
    'boston-dynamics-spot': {
      availability: { status: 'commercial', orderLink: 'https://www.bostondynamics.com/products/spot' },
      sources: [{ kind: 'official', url: 'https://www.bostondynamics.com/products/spot' }],
      timeline: { releasedAt: '2020-06-01' },
    },
    'anybotics-anymal': {
      availability: { status: 'commercial', orderLink: 'https://www.anybotics.com/anymal/' },
      sources: [{ kind: 'official', url: 'https://www.anybotics.com/anymal/' }],
      timeline: { releasedAt: '2019-01-01' },
    },
    'deep-robotics-x30': {
      availability: { status: 'commercial', orderLink: 'https://www.deeprobotics.cn/en/wap/product3.html' },
      sources: [{ kind: 'official', url: 'https://www.deeprobotics.cn/en/wap/product3.html' }],
      timeline: { releasedAt: '2023-01-01' },
    },
    'deep-robotics-lite3': {
      availability: { status: 'commercial', orderLink: 'https://www.deeprobotics.cn/en/wap/product1.html' },
      sources: [{ kind: 'official', url: 'https://www.deeprobotics.cn/en/wap/product1.html' }],
      timeline: { releasedAt: '2022-01-01' },
    },
  };

  let updated = 0;
  for (const [id, patch] of Object.entries(patches)) {
    const robot = byId.get(id);
    if (!robot) {
      console.warn(`Missing robot id: ${id}`);
      continue;
    }
    patchRobot(robot, patch, nowIso);
    updated++;
  }

  writeJson(ROBOTS_PATH, robots);
  console.log(`Backfilled timeline/sources for ${updated} robots.`);
}

main();

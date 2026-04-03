import { describe, it, expect } from 'vitest';
import {
  slugify,
  isPromotable,
  robotAlreadyExists,
  buildRobotId,
} from '../../scripts/promote-robots';
import type { DiscoveredRobot } from '../../src/types/discovered-robot';

const makeDiscovery = (overrides: Partial<DiscoveredRobot> = {}): DiscoveredRobot => ({
  company: 'Acme Robotics',
  robot_name: 'Walker X1',
  type: 'humanoid',
  status: 'commercial',
  image_link: 'https://example.com/walker.jpg',
  specs_link: 'https://acme.com/walker-x1',
  source_link: 'https://news.com/article',
  discovered_at: '2026-04-04T00:00:00Z',
  source_type: 'news',
  confidence_score: 0.85,
  quality_score: { overall: 8, completeness: 8, reliability: 8, flags: [] },
  description: 'A commercial humanoid robot.',
  shipping_signal: 'shipping_now',
  ...overrides,
});

describe('slugify', () => {
  it('converts name to kebab-case slug', () => {
    expect(slugify('Acme Robotics')).toBe('acme-robotics');
  });
  it('handles special characters', () => {
    expect(slugify('1X Technologies')).toBe('1x-technologies');
  });
  it('collapses multiple hyphens', () => {
    expect(slugify('Hello  World!!!')).toBe('hello-world');
  });
});

describe('buildRobotId', () => {
  it('combines brand and name slugs', () => {
    expect(buildRobotId('Unitree', 'Go2')).toBe('unitree-go2');
  });
  it('handles names with spaces', () => {
    expect(buildRobotId('Boston Dynamics', 'Spot Enterprise')).toBe(
      'boston-dynamics-spot-enterprise'
    );
  });
});

describe('isPromotable', () => {
  it('accepts high-confidence robot with company and name', () => {
    expect(isPromotable(makeDiscovery())).toBe(true);
  });
  it('rejects low confidence', () => {
    expect(isPromotable(makeDiscovery({ confidence_score: 0.5 }))).toBe(false);
  });
  it('rejects missing company', () => {
    expect(isPromotable(makeDiscovery({ company: null }))).toBe(false);
  });
  it('rejects missing robot_name', () => {
    expect(isPromotable(makeDiscovery({ robot_name: null }))).toBe(false);
  });
  it('rejects null type', () => {
    expect(isPromotable(makeDiscovery({ type: null }))).toBe(false);
  });
});

describe('robotAlreadyExists', () => {
  const existing = [{ id: 'unitree-go2' }, { id: 'boston-dynamics-spot' }];

  it('returns true for existing robot', () => {
    expect(robotAlreadyExists('Unitree', 'Go2', existing as never[])).toBe(true);
  });
  it('returns false for new robot', () => {
    expect(robotAlreadyExists('Acme', 'Walker', existing as never[])).toBe(false);
  });
});

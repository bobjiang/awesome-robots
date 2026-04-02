import { describe, it, expect } from 'vitest';
import {
  deduplicateByUrl,
  isRobotRelated,
  preFilterItems,
  parseSitemapXml,
} from '../../scripts/daily-discover';

describe('deduplicateByUrl', () => {
  it('removes duplicate URLs', () => {
    const items = [
      { title: 'A', link: 'https://a.com', source: 'S1', pubDate: '' },
      { title: 'B', link: 'https://a.com', source: 'S2', pubDate: '' },
      { title: 'C', link: 'https://c.com', source: 'S1', pubDate: '' },
    ];
    expect(deduplicateByUrl(items)).toHaveLength(2);
  });

  it('keeps first occurrence when URLs duplicate', () => {
    const items = [
      { title: 'First', link: 'https://a.com', source: 'S1', pubDate: '' },
      { title: 'Second', link: 'https://a.com', source: 'S2', pubDate: '' },
    ];
    const result = deduplicateByUrl(items);
    expect(result[0].title).toBe('First');
  });

  it('returns empty array for empty input', () => {
    expect(deduplicateByUrl([])).toHaveLength(0);
  });
});

describe('isRobotRelated', () => {
  it('matches robot keywords in title', () => {
    expect(
      isRobotRelated({
        title: 'New humanoid robot from Figure AI',
        link: '',
        source: '',
        pubDate: '',
      })
    ).toBe(true);
  });

  it('matches quadruped keyword', () => {
    expect(
      isRobotRelated({
        title: 'Boston Dynamics quadruped update',
        link: '',
        source: '',
        pubDate: '',
      })
    ).toBe(true);
  });

  it('matches robotics keyword', () => {
    expect(
      isRobotRelated({
        title: 'Advances in robotics manipulation',
        link: '',
        source: '',
        pubDate: '',
      })
    ).toBe(true);
  });

  it('rejects non-robot articles', () => {
    expect(
      isRobotRelated({
        title: 'New AI model released for language tasks',
        link: '',
        source: '',
        pubDate: '',
      })
    ).toBe(false);
  });

  it('is case insensitive', () => {
    expect(
      isRobotRelated({
        title: 'HUMANOID ROBOT BREAKTHROUGH',
        link: '',
        source: '',
        pubDate: '',
      })
    ).toBe(true);
  });
});

describe('preFilterItems', () => {
  it('caps items at maxItems with per-source guarantee', () => {
    const items = Array.from({ length: 100 }, (_, i) => ({
      title: `Item ${i}`,
      link: `https://example.com/${i}`,
      source: `Source${i % 5}`,
      pubDate: new Date().toISOString(),
    }));
    const filtered = preFilterItems(items, 30);
    expect(filtered.length).toBeLessThanOrEqual(30);
    // Each of 5 sources should have at least 3 items
    const sources = new Set(filtered.map((i) => i.source));
    expect(sources.size).toBe(5);
  });

  it('returns all items when under maxItems', () => {
    const items = [
      { title: 'A', link: 'https://a.com', source: 'S1', pubDate: '' },
      { title: 'B', link: 'https://b.com', source: 'S2', pubDate: '' },
    ];
    expect(preFilterItems(items, 30)).toHaveLength(2);
  });

  it('returns empty array for empty input', () => {
    expect(preFilterItems([], 30)).toHaveLength(0);
  });
});

describe('parseSitemapXml', () => {
  it('extracts URLs and lastmod from sitemap XML', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/blog/post-1</loc>
    <lastmod>2026-04-01</lastmod>
  </url>
  <url>
    <loc>https://example.com/blog/post-2</loc>
    <lastmod>2026-03-28</lastmod>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <lastmod>2025-01-01</lastmod>
  </url>
</urlset>`;
    const items = parseSitemapXml(xml, 'TestSource', '/blog/');
    expect(items).toHaveLength(2);
    expect(items[0].link).toBe('https://example.com/blog/post-1');
    expect(items[0].source).toBe('TestSource');
    expect(items[0].pubDate).toBe('2026-04-01');
  });

  it('filters by path prefix', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://example.com/news/a</loc></url>
  <url><loc>https://example.com/docs/b</loc></url>
</urlset>`;
    const items = parseSitemapXml(xml, 'S', '/news/');
    expect(items).toHaveLength(1);
    expect(items[0].link).toBe('https://example.com/news/a');
  });

  it('returns empty for invalid XML', () => {
    expect(parseSitemapXml('not xml', 'S')).toHaveLength(0);
  });

  it('derives title from URL slug', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://example.com/blog/my-great-post</loc></url>
</urlset>`;
    const items = parseSitemapXml(xml, 'S', '/blog/');
    expect(items[0].title).toBe('my great post');
  });
});

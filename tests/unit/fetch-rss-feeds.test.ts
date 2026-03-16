import { describe, it, expect } from 'vitest';
import { parseSourcesCSV, filterRecentArticles } from '../../scripts/fetch-rss-feeds';
import type { Article } from '../../scripts/fetch-rss-feeds';

describe('parseSourcesCSV', () => {
  it('parses rows that have RSS feed URLs', () => {
    const csv = `Name,Link,Description,RSS feed,Category
"MIT News (Robotics)","https://news.mit.edu/topic/robotics","MIT robotics news","https://news.mit.edu/topic/mitrobotics-rss.xml","Academic Research"
"Google DeepMind Blog","https://deepmind.com/blog","DeepMind blog","https://deepmind.com/blog/feed/basic/","Corporate Blog"`;

    const sources = parseSourcesCSV(csv);

    expect(sources).toHaveLength(2);
    expect(sources[0]).toEqual({
      name: 'MIT News (Robotics)',
      link: 'https://news.mit.edu/topic/robotics',
      rssUrl: 'https://news.mit.edu/topic/mitrobotics-rss.xml',
      category: 'Academic Research',
    });
    expect(sources[1]).toEqual({
      name: 'Google DeepMind Blog',
      link: 'https://deepmind.com/blog',
      rssUrl: 'https://deepmind.com/blog/feed/basic/',
      category: 'Corporate Blog',
    });
  });

  it('skips rows without RSS feed URLs', () => {
    const csv = `Name,Link,Description,RSS feed,Category
"CMU Robotics","https://www.ri.cmu.edu/news","CMU news",,"Academic Research"
"ICRA","https://2025.ieee-icra.org","IEEE conf",,"Conference"
"The Robot Report","https://www.therobotreport.com","News","https://therobotreport.com/feed","Industry News"`;

    const sources = parseSourcesCSV(csv);

    expect(sources).toHaveLength(1);
    expect(sources[0].name).toBe('The Robot Report');
  });

  it('handles empty CSV (header only)', () => {
    const csv = `Name,Link,Description,RSS feed,Category`;
    const sources = parseSourcesCSV(csv);
    expect(sources).toHaveLength(0);
  });

  it('handles commas inside quoted fields', () => {
    const csv = `Name,Link,Description,RSS feed,Category
"ICRA (Int'l Conf. on Robotics, and Automation)","https://example.com","Desc with, comma","https://example.com/feed","Conference"`;

    const sources = parseSourcesCSV(csv);

    expect(sources).toHaveLength(1);
    expect(sources[0].name).toBe("ICRA (Int'l Conf. on Robotics, and Automation)");
  });
});

describe('filterRecentArticles', () => {
  function makeArticle(daysAgo: number): Article {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return {
      title: `Article from ${daysAgo} days ago`,
      link: `https://example.com/article-${daysAgo}`,
      pubDate: date.toISOString(),
      source: 'Test Source',
    };
  }

  it('keeps articles within the date range', () => {
    const articles = [makeArticle(0), makeArticle(3), makeArticle(6)];
    const filtered = filterRecentArticles(articles, 7);
    expect(filtered).toHaveLength(3);
  });

  it('filters out articles older than the cutoff', () => {
    const articles = [makeArticle(1), makeArticle(8), makeArticle(14)];
    const filtered = filterRecentArticles(articles, 7);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Article from 1 days ago');
  });

  it('filters out articles with invalid dates', () => {
    const articles: Article[] = [
      {
        title: 'Invalid date',
        link: 'https://example.com/invalid',
        pubDate: 'not-a-date',
        source: 'Test',
      },
    ];
    const filtered = filterRecentArticles(articles, 7);
    expect(filtered).toHaveLength(0);
  });

  it('returns empty array when given empty input', () => {
    const filtered = filterRecentArticles([], 7);
    expect(filtered).toHaveLength(0);
  });

  it('respects different day values', () => {
    const articles = [makeArticle(2), makeArticle(4)];
    const filtered = filterRecentArticles(articles, 3);
    expect(filtered).toHaveLength(1);
  });
});

import { describe, it, expect } from 'vitest';
import { BlogConverter } from '../../src/utils/blog-converter';

describe('BlogConverter', () => {
  const converter = new BlogConverter('https://www.awesomerobots.xyz');

  it('converts blog post to dev.to format with canonical URL', () => {
    const blogPost = {
      title: 'Test Robot Post',
      slug: 'test-robot-post',
      date: '2026-03-18',
      author: 'bob-jiang',
      category: 'news',
      tags: ['robotics', 'humanoid', 'AI'],
      excerpt: 'A test post about robots',
      featured: false,
      published: true,
      content: '## Hello\n\nThis is a test post about robots.',
    };

    const devtoArticle = converter.convertToDevTo(blogPost);

    expect(devtoArticle.title).toBe('Test Robot Post');
    expect(devtoArticle.canonical_url).toBe(
      'https://www.awesomerobots.xyz/blog/test-robot-post'
    );
    expect(devtoArticle.tags).toContain('robotics');
    expect(devtoArticle.tags.length).toBeLessThanOrEqual(4);
    expect(devtoArticle.body_markdown).toContain('Originally published on');
    expect(devtoArticle.body_markdown).toContain('This is a test post about robots.');
    expect(devtoArticle.published).toBe(true);
  });

  it('limits tags to 4 and ensures robotics tag', () => {
    const blogPost = {
      title: 'Many Tags Post',
      slug: 'many-tags',
      date: '2026-03-18',
      author: 'bob-jiang',
      category: 'news',
      tags: ['ai', 'humanoid', 'automation', 'manufacturing', 'research'],
      excerpt: 'Test',
      featured: false,
      published: true,
      content: 'Content',
    };

    const devtoArticle = converter.convertToDevTo(blogPost);
    expect(devtoArticle.tags.length).toBeLessThanOrEqual(4);
    expect(devtoArticle.tags[0]).toBe('robotics');
  });

  it('converts relative links to absolute URLs', () => {
    const blogPost = {
      title: 'Links Post',
      slug: 'links-post',
      date: '2026-03-18',
      author: 'bob-jiang',
      category: 'news',
      tags: ['robotics'],
      excerpt: 'Test',
      featured: false,
      published: true,
      content: 'Check out [our guide](/blog/guide) and ![image](/images/robot.png)',
    };

    const devtoArticle = converter.convertToDevTo(blogPost);
    expect(devtoArticle.body_markdown).toContain(
      'https://www.awesomerobots.xyz/blog/guide'
    );
    expect(devtoArticle.body_markdown).toContain(
      'https://www.awesomerobots.xyz/images/robot.png'
    );
  });
});

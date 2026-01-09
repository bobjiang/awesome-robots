import Parser from 'rss-parser';
import { convert } from 'html-to-text';
import type { RSSArticle } from '@/types/discovered-robot';

class RSSParser {
  private parser = new Parser();

  async fetchFeed(url: string): Promise<RSSArticle[]> {
    try {
      const feed = await this.parser.parseURL(url);
      const articles: RSSArticle[] = [];

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      for (const item of feed.items) {
        const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();

        // Only include articles from last 7 days
        if (pubDate < sevenDaysAgo) {
          continue;
        }

        const content = this.cleanContent(
          item['content:encoded'] || item.content || item.contentSnippet || ''
        );

        articles.push({
          title: item.title || 'Untitled',
          link: item.link || '',
          pubDate,
          content,
          excerpt: item.contentSnippet?.substring(0, 200) || '',
        });
      }

      return articles;
    } catch (error) {
      throw new Error(`Failed to fetch RSS feed from ${url}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private cleanContent(html: string): string {
    // Convert HTML to plain text
    const text = convert(html, {
      wordwrap: false,
      selectors: [
        // Remove navigation, ads, and other non-content elements
        { selector: 'nav', format: 'skip' },
        { selector: 'footer', format: 'skip' },
        { selector: 'aside', format: 'skip' },
        { selector: '.advertisement', format: 'skip' },
        { selector: '.ad', format: 'skip' },
      ],
    });

    // Limit to ~1000 words for LLM processing
    const words = text.split(/\s+/).slice(0, 1000);
    return words.join(' ').trim();
  }
}

export { RSSParser };

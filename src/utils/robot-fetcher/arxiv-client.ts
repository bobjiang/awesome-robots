import * as cheerio from 'cheerio';
import type { ArxivPaper } from '@/types/discovered-robot';

class ArxivClient {
  private baseUrl = 'https://arxiv.org/list/cs.RO/new';

  async fetchNewPapers(): Promise<ArxivPaper[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();
      return this.parseListingPage(html);
    } catch (error) {
      throw new Error(`Failed to fetch arXiv papers: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private parseListingPage(html: string): ArxivPaper[] {
    const $ = cheerio.load(html);
    const papers: ArxivPaper[] = [];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Parse each paper entry
    $('dt').each((_, dtElement) => {
      const dd = $(dtElement).next('dd');
      if (!dd.length) return;

      // Extract arXiv ID
      const arxivLink = $(dtElement).find('a[title="Abstract"]').attr('href');
      if (!arxivLink) return;

      const id = arxivLink.replace('/abs/', '');

      // Extract title
      const titleElem = dd.find('.list-title');
      const titleText = titleElem.text().replace('Title:', '').trim();

      // Only process papers with "robot" or "humanoid" in title
      if (!titleText.toLowerCase().match(/robot|humanoid/)) {
        return;
      }

      // Extract authors
      const authorsText = dd.find('.list-authors').text().replace('Authors:', '').trim();
      const authors = authorsText.split(',').map(a => a.trim());

      // Extract abstract (from mathjax span or text content)
      const abstractElem = dd.find('.mathjax');
      const abstract = abstractElem.text().trim() || '';

      // Extract submission date from dt element
      const dateText = $(dtElement).text();
      const dateMatch = dateText.match(/\w{3},\s+\d+\s+\w{3}\s+\d{4}/);
      const submittedDate = dateMatch ? new Date(dateMatch[0]) : new Date();

      // Filter to last 7 days
      if (submittedDate < sevenDaysAgo) {
        return;
      }

      papers.push({
        id,
        title: titleText,
        authors,
        abstract,
        link: `https://arxiv.org/abs/${id}`,
        submittedDate,
      });
    });

    return papers;
  }

  // Helper to add rate limiting delay
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export { ArxivClient };

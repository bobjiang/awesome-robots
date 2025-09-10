import fs from 'fs';
import matter from 'gray-matter';
import { DevToArticle } from './devto-client';

interface BlogPost {
  title: string;
  slug: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  excerpt: string;
  featured: boolean;
  published: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  content: string;
}

class BlogConverter {
  private baseUrl: string;

  constructor(baseUrl = 'https://www.awesomerobots.xyz') {
    this.baseUrl = baseUrl;
  }

  parseMarkdownFile(filePath: string): BlogPost {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    return {
      title: data.title,
      slug: data.slug,
      date: data.date,
      author: data.author,
      category: data.category,
      tags: data.tags || [],
      excerpt: data.excerpt,
      featured: data.featured || false,
      published: data.published || true,
      seo: data.seo,
      content
    };
  }

  convertToDevTo(blogPost: BlogPost): DevToArticle {
    // Process content to add canonical URL and attribution
    const processedContent = this.processContentForDevTo(blogPost);
    
    return {
      title: blogPost.title,
      published: blogPost.published,
      body_markdown: processedContent,
      tags: this.processTagsForDevTo(blogPost.tags),
      canonical_url: `${this.baseUrl}/blog/${blogPost.slug}`,
      description: blogPost.excerpt
    };
  }

  private processContentForDevTo(blogPost: BlogPost): string {
    let content = blogPost.content;
    
    // Add header with canonical link and attribution
    const header = `> 🤖 Originally published on [Awesome Robots](${this.baseUrl}/blog/${blogPost.slug})
> 
> This article is part of our comprehensive coverage of AI robotics developments. Visit [awesomerobots.xyz](${this.baseUrl}) for the latest robot reviews, buying guides, and industry analysis.

---

`;

    // Add footer with links back to the site
    const footer = `

---

## 🔗 Related Resources

Visit [Awesome Robots](${this.baseUrl}) for:
- 🤖 [Latest Robot Reviews](${this.baseUrl}/categories/reviews)
- 📚 [Buying Guides](${this.baseUrl}/categories/buying-guides) 
- 📰 [Industry News](${this.baseUrl}/blog)
- 🔍 [Robot Catalog](${this.baseUrl}/browse)

**Follow us for more robotics content:**
- 🐦 [Twitter/X](https://x.com/awesome__robots)
- 📧 [Newsletter](https://awesomerobotsxyz.substack.com/)

*What robots or topics would you like us to cover next? Let us know in the comments!*`;

    // Process internal links to absolute URLs
    content = this.processInternalLinks(content);
    
    // Process images to use absolute URLs
    content = this.processImages(content);
    
    return header + content + footer;
  }

  private processTagsForDevTo(tags: string[]): string[] {
    // Dev.to has specific tag requirements
    // - Max 4 tags
    // - Alphanumeric characters only
    // - No spaces, use hyphens instead
    
    const processedTags = tags
      .slice(0, 4) // Limit to 4 tags
      .map(tag => tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
      .filter(tag => tag.length > 0 && tag.length <= 20); // Dev.to tag length limits
    
    // Ensure we have some basic robotics tags
    if (!processedTags.includes('robotics')) {
      processedTags.unshift('robotics');
    }
    
    return processedTags.slice(0, 4); // Final limit to 4 tags
  }

  private processInternalLinks(content: string): string {
    // Convert relative links to absolute URLs
    return content.replace(/\[([^\]]+)\]\(\/([^)]+)\)/g, `[$1](${this.baseUrl}/$2)`);
  }

  private processImages(content: string): string {
    // Convert relative image paths to absolute URLs
    return content.replace(/!\[([^\]]*)\]\(\/([^)]+)\)/g, `![$1](${this.baseUrl}/$2)`);
  }

  createLocalBlogPost(title: string, content: string, options: Partial<BlogPost> = {}): string {
    const slug = options.slug || this.generateSlug(title);
    const date = options.date || new Date().toISOString().split('T')[0];
    
    const frontmatter = {
      title,
      slug,
      date,
      author: options.author || 'bob-jiang',
      category: options.category || 'news',
      tags: options.tags || ['robotics', 'AI'],
      excerpt: options.excerpt || this.generateExcerpt(content),
      featured: options.featured || false,
      published: options.published !== undefined ? options.published : true,
      seo: options.seo || {
        title: title,
        description: options.excerpt || this.generateExcerpt(content),
        keywords: options.tags || ['robotics', 'AI']
      }
    };

    const frontmatterString = Object.entries(frontmatter)
      .map(([key, value]) => {
        if (typeof value === 'object') {
          return `${key}:\n${Object.entries(value).map(([k, v]) => `  ${k}: ${JSON.stringify(v)}`).join('\n')}`;
        }
        return `${key}: ${JSON.stringify(value)}`;
      })
      .join('\n');

    return `---\n${frontmatterString}\n---\n\n${content}`;
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  private generateExcerpt(content: string, maxLength = 160): string {
    // Remove markdown formatting and get first paragraph
    const plainText = content
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
      .replace(/\*([^*]+)\*/g, '$1') // Remove italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
      .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // Remove images
      .trim();

    const firstParagraph = plainText.split('\n\n')[0];
    
    if (firstParagraph.length <= maxLength) {
      return firstParagraph;
    }
    
    return firstParagraph.substring(0, maxLength - 3).trim() + '...';
  }
}

export { BlogConverter, type BlogPost };
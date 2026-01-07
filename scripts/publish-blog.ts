#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { DevToClient } from '../src/utils/devto-client';
import { BlogConverter } from '../src/utils/blog-converter';

// Load environment variables from .env.local file
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

interface PublishOptions {
  file?: string;
  title?: string;
  draft?: boolean;
  devtoOnly?: boolean;
  localOnly?: boolean;
}

class BlogPublisher {
  private devtoClient: DevToClient;
  private converter: BlogConverter;
  private contentDir: string;

  constructor() {
    this.devtoClient = new DevToClient();
    this.converter = new BlogConverter(
      process.env.NEXT_PUBLIC_BASE_URL || 'https://www.awesomerobots.xyz'
    );
    this.contentDir = path.join(process.cwd(), 'content', 'blog');
  }

  async publishFromFile(filePath: string, options: PublishOptions = {}) {
    console.log(`📖 Reading blog post from: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const blogPost = this.converter.parseMarkdownFile(filePath);
    console.log(`📝 Parsed: "${blogPost.title}" by ${blogPost.author}`);

    if (!options.localOnly) {
      await this.publishToDevTo(blogPost, options);
    }

    console.log('✅ Publishing complete!');
  }

  async publishNewContent(title: string, content: string, options: PublishOptions = {}) {
    console.log(`📝 Creating new blog post: "${title}"`);
    
    // Create local markdown file first
    const slug = this.generateSlug(title);
    const fileName = `${slug}.md`;
    const filePath = path.join(this.contentDir, fileName);
    
    if (!options.devtoOnly) {
      const markdownContent = this.converter.createLocalBlogPost(title, content, {
        published: !options.draft,
        ...options
      });

      fs.writeFileSync(filePath, markdownContent);
      console.log(`📁 Local file created: ${fileName}`);
    }

    // Parse the created file and publish to dev.to
    if (!options.localOnly) {
      const blogPost = this.converter.parseMarkdownFile(filePath);
      await this.publishToDevTo(blogPost, options);
    }

    console.log('✅ Publishing complete!');
    return { filePath, slug };
  }

  private async publishToDevTo(blogPost: any, options: PublishOptions) {
    console.log('🚀 Publishing to dev.to...');
    
    const devtoArticle = this.converter.convertToDevTo(blogPost);
    
    // Set draft mode if specified
    if (options.draft) {
      devtoArticle.published = false;
    }

    try {
      const response = await this.devtoClient.createArticle(devtoArticle);
      console.log(`✅ Published to dev.to: ${response.url}`);
      console.log(`📊 Article ID: ${response.id}`);
      
      // Save dev.to article ID for future updates
      this.saveDevToMetadata(blogPost.slug, response);
      
      return response;
    } catch (error) {
      console.error('❌ Failed to publish to dev.to:', error);
      throw error;
    }
  }

  private saveDevToMetadata(slug: string, response: any) {
    const metadataDir = path.join(process.cwd(), '.devto');
    const metadataFile = path.join(metadataDir, `${slug}.json`);
    
    if (!fs.existsSync(metadataDir)) {
      fs.mkdirSync(metadataDir, { recursive: true });
    }
    
    fs.writeFileSync(metadataFile, JSON.stringify({
      devto_id: response.id,
      devto_url: response.url,
      published_at: response.created_at,
      last_updated: new Date().toISOString()
    }, null, 2));
    
    console.log(`💾 Saved dev.to metadata: ${slug}.json`);
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  async listRecentPosts() {
    console.log('📚 Recent blog posts:');
    const files = fs.readdirSync(this.contentDir)
      .filter(file => file.endsWith('.md'))
      .sort((a, b) => {
        const aStats = fs.statSync(path.join(this.contentDir, a));
        const bStats = fs.statSync(path.join(this.contentDir, b));
        return bStats.mtime.getTime() - aStats.mtime.getTime();
      })
      .slice(0, 10);

    files.forEach((file, index) => {
      const filePath = path.join(this.contentDir, file);
      const blogPost = this.converter.parseMarkdownFile(filePath);
      console.log(`${index + 1}. ${blogPost.title} (${file})`);
    });
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const publisher = new BlogPublisher();

  if (args.length === 0) {
    console.log(`
🤖 Awesome Robots Blog Publisher

Usage:
  npm run publish-blog <command> [options]

Commands:
  file <path>           Publish existing markdown file
  new "<title>"         Create and publish new blog post
  list                  List recent blog posts

Options:
  --draft              Publish as draft
  --devto-only         Only publish to dev.to (skip local file)
  --local-only         Only create local file (skip dev.to)

Examples:
  npm run publish-blog file content/blog/my-post.md
  npm run publish-blog new "My Amazing Robot Review"
  npm run publish-blog new "Draft Post" --draft
  npm run publish-blog list
`);
    return;
  }

  const command = args[0];
  const options: PublishOptions = {
    draft: args.some(arg => arg === '--draft'),
    devtoOnly: args.some(arg => arg === '--devto-only'),
    localOnly: args.some(arg => arg === '--local-only')
  };

  try {
    switch (command) {
      case 'file':
        if (!args[1]) {
          console.error('❌ Please specify a file path');
          return;
        }
        await publisher.publishFromFile(args[1], options);
        break;

      case 'new':
        if (!args[1]) {
          console.error('❌ Please specify a title');
          return;
        }
        const title = args[1];
        console.log('✏️ Enter your blog content (end with Ctrl+D on a new line):');
        
        // Read content from stdin
        const content = await new Promise<string>((resolve) => {
          let data = '';
          process.stdin.on('data', chunk => data += chunk);
          process.stdin.on('end', () => resolve(data.trim()));
        });
        
        await publisher.publishNewContent(title, content, options);
        break;

      case 'list':
        await publisher.listRecentPosts();
        break;

      default:
        console.error(`❌ Unknown command: ${command}`);
    }
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Check if this is the main module (ES module equivalent)
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { BlogPublisher };
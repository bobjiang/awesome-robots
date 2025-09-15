#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { BlogPublisher } from './publish-blog';

interface DigestContent {
  issueNumber: number;
  date: string;
  introduction: string;
  topNews: string[];
  research: string[];
  events: string[];
  toolOfWeek: string;
  communityCorner: string[];
  trends: string[];
  conclusion: string;
}

class DigestGenerator {
  private contentDir: string;
  private templatePath: string;
  private publisher: BlogPublisher;

  constructor() {
    this.contentDir = path.join(process.cwd(), 'content', 'blog');
    this.templatePath = path.join(process.cwd(), 'content', 'templates', 'awesome-robots-digest-template.md');
    this.publisher = new BlogPublisher();
  }

  private getNextIssueNumber(): number {
    const files = fs.readdirSync(this.contentDir)
      .filter(file => file.startsWith('awesome-robots-digest-issue-') && file.endsWith('.md'))
      .map(file => {
        const match = file.match(/issue-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(num => num > 0);

    return files.length > 0 ? Math.max(...files) + 1 : 1;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private formatDisplayDate(date: Date): string {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  private generateWeekDateRange(date: Date): string {
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - 7);
    const endDate = new Date(date);
    endDate.setDate(date.getDate() - 1);
    
    const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDate.getDate()}–${endDate.getDate()}`;
    } else {
      return `${startMonth} ${startDate.getDate()}–${endMonth} ${endDate.getDate()}`;
    }
  }

  private createDigestTemplate(issueNumber: number, date: Date): string {
    const dateStr = this.formatDate(date);
    const displayDate = this.formatDisplayDate(date);
    const weekRange = this.generateWeekDateRange(date);

    return `---
title: "Awesome Robots Digest - Issue #${issueNumber} - ${displayDate}"
slug: "awesome-robots-digest-issue-${issueNumber}"
date: "${dateStr}"
author: "bob-jiang"
category: "digest"
tags: ["digest", "newsletter", "robotics", "AI", "weekly", "industry-news", "research"]
excerpt: "Weekly digest of the latest developments in AI robotics, featuring industry news, research breakthroughs, upcoming events, and community highlights from the robotics world."
featured: false
published: false
seo:
  title: "Awesome Robots Digest - Issue #${issueNumber} - Latest AI Robotics News & Updates"
  description: "Stay updated with the latest AI robotics developments, research breakthroughs, industry news, and community highlights in our weekly digest."
  keywords: ["robotics news", "AI robotics", "robotics digest", "weekly robotics", "robotics industry", "robotics research"]
---

## TL;DR; 📋

**[This week (${weekRange}) highlights - to be filled with key developments]**

- **[Key Development 1]** - [Brief description]
- **[Key Development 2]** - [Brief description]
- **[Key Development 3]** - [Brief description]
- **[Research Focus]** - [Research highlights]
- **[Upcoming Events]** - [Conference/event highlights]

---

## Introduction 🚀

This week's developments (${weekRange}) brought [description of key themes]. [Brief overview of major trends, announcements, or shifts in the AI robotics space]. This issue explores [what topics will be covered].

---

## Top News & Breakthroughs 📰

### 🏢 Company News
- **[Company Name]** announced [specific news] - [brief explanation of significance]
- **[Company Name]** [development/milestone] - [impact on industry]

### 🚀 Product Launches
- **[Product Name]** by **[Company]** - [key features and market impact]
- **[New Technology]** breakthrough in [specific area] - [technical significance]

### 💰 Funding & Investments
- **[Startup]** raised $[X]M Series [X] led by **[Investor]** - [use case and market potential]
- **[Corporate]** invested in **[Robotics Company]** - [strategic implications]

### 🌐 Industry Developments
- **[Industry]** adoption of **[Technology]** accelerates - [market trends and implications]
- **[Regulation/Standard]** announced for **[Robotics Application]** - [compliance and market impact]

---

## Research Spotlight 🔬

### 📄 Research Papers
- **[Paper Title]** by **[Authors]** - [key findings and practical applications]
  - *Published in: [Journal/Conference]*
  - *Key Innovation: [specific technical advancement]*

### 🔧 Open Source Projects
- **[Project Name]** - [description of functionality and community impact]
  - *GitHub: [link]*
  - *Use Cases: [specific applications]*

### 🎓 Academic Breakthroughs
- **[University]** researchers develop **[Technology]** - [scientific significance and potential applications]

**Why it matters:** [Explanation of significance for the field]

---

## Event Horizon 📅

### 🗓️ This Week
- **[Event Name]** - [Date] at [Location/Platform]
  - *Focus: [main topics or themes]*
  - *Registration: [link if available]*

### 📅 Next Week
- **[Conference Name]** - [Date Range] in [City/Online]
  - *Keynote Speakers: [notable presenters]*
  - *Topics: [main areas of focus]*

### 🎯 Upcoming Deadlines
- **[Call for Papers/Submissions]** - Deadline: [Date]
  - *Requirements: [brief description]*
  - *Submission Link: [URL]*

### 🌍 Major Conferences (Next 3 Months)
- **[Conference]** - [Date] in [Location]
- **[Workshop]** - [Date] at [Venue]
- **[Exhibition]** - [Date] in [City]

---

## Tool/Resource of the Week 🛠️

### 🎯 Featured Resource: **[Resource Name]**

**[Brief description of what this tool/resource is and its primary purpose]**

**Key Features:**
- **[Feature 1]** - [benefit]
- **[Feature 2]** - [benefit]
- **[Feature 3]** - [benefit]

**Why It's Useful:**
[Explanation of why this resource is valuable for robotics practitioners]

**Getting Started:**
- **Website:** [URL]
- **Documentation:** [link]
- **Community:** [forum/discord/slack link if applicable]

**Use Cases:**
- [Specific application 1]
- [Specific application 2]
- [Specific application 3]

---

## Community Corner 👥

### 💬 Trending Discussions
- **[Forum/Platform]** - "[Discussion Topic]" - [summary of key points and community engagement]
- **[Social Media]** - "[Hashtag/Trend]" - [community response and significance]

### 🛠️ Cool Projects
- **[Project Name]** by **[Creator]** - [description of the project and its innovation]
  - *Demo: [video/link]*
  - *Innovation: [what makes it special]*

### 🎉 Community Highlights
- **[Person/Group]** released **[Project]** - [impact on community]
- **[Event]** organized by **[Community]** - [participation and outcomes]

### 🌟 Spotlight: **[Community Member/Project]**
[Detailed feature of an outstanding community contribution, project, or individual]

---

## Trends to Watch (from this week's signals)

1. **[Trend 1]**: [Description of emerging trend and its implications]

2. **[Trend 2]**: [Description of market/technical development to monitor]

3. **[Trend 3]**: [Description of research direction or industry shift]

---

## Conclusion 🎯

Week in summary: [Brief recap of the week's developments]. [Forward-looking statement about expected developments]. [Engagement prompt for readers].

[Closing thought about the state of AI robotics and what to expect next week/month].

---

## 📧 Stay Connected

- **Subscribe:** [Newsletter signup link](https://awesomerobotsxyz.substack.com/)
- **Follow us:** [Twitter (X) links](https://x.com/awesome__robots)
- **Website:** [Official Website](https://www.awesomerobots.xyz/)

---

*This digest is curated by the Awesome Robots team. Have a story to share? [Contact information]*

**Archive, resources, and partner robots:** [awesomerobots.xyz](https://www.awesomerobots.xyz/)

**Ping us with papers/demos to feature next week.**

**Want a printable version of the digest? Say the word and I'll export a PDF in your template.**

*Curated for the Awesome Robots community. If you want this tailored to specific robot types or focus areas next issue, just let us know!*`;
  }

  async generateWeeklyDigest(publishImmediately = false): Promise<{ filePath: string; issueNumber: number }> {
    const now = new Date();
    const issueNumber = this.getNextIssueNumber();
    
    console.log(`🤖 Generating Awesome Robots Digest Issue #${issueNumber}...`);
    
    const digestContent = this.createDigestTemplate(issueNumber, now);
    const fileName = `awesome-robots-digest-issue-${issueNumber}.md`;
    const filePath = path.join(this.contentDir, fileName);
    
    // Write the template file
    fs.writeFileSync(filePath, digestContent);
    console.log(`📝 Created digest template: ${fileName}`);
    console.log(`📁 Location: ${filePath}`);
    
    if (publishImmediately) {
      console.log(`🚀 Publishing digest immediately...`);
      try {
        await this.publisher.publishFromFile(filePath, { draft: true });
        console.log(`✅ Published as draft to dev.to`);
      } catch (error) {
        console.error(`❌ Failed to publish: ${error}`);
        throw error;
      }
    } else {
      console.log(`📋 Template created. Edit the content and run:`);
      console.log(`   npm run publish-blog file ${filePath}`);
    }
    
    return { filePath, issueNumber };
  }

  async generateAndPublish(): Promise<void> {
    const { filePath, issueNumber } = await this.generateWeeklyDigest(false);
    
    console.log(`\n🎯 Next steps:`);
    console.log(`1. Edit the content in: ${path.basename(filePath)}`);
    console.log(`2. Fill in the TL;DR, news, research, and other sections`);
    console.log(`3. Run: npm run publish-blog file ${filePath}`);
    console.log(`\n💡 Or to publish as draft immediately:`);
    console.log(`   npm run digest-and-publish`);
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const generator = new DigestGenerator();

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🤖 Awesome Robots Digest Generator

Usage:
  npm run generate-digest [options]

Options:
  --publish-draft    Generate template and publish as draft to dev.to
  --template-only    Generate template only (default)
  --help, -h         Show this help message

Examples:
  npm run generate-digest                    # Generate template only
  npm run generate-digest --publish-draft    # Generate and publish as draft
`);
    return;
  }

  try {
    if (args.includes('--publish-draft')) {
      await generator.generateWeeklyDigest(true);
    } else {
      await generator.generateAndPublish();
    }
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Check if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { DigestGenerator };
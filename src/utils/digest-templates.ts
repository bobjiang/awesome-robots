import { DiscoveryStats, TrendAnalysis } from './analytics-engine';
import { FetchResult } from '../types/discovered-robot';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Data package for digest generation
 */
export interface DigestPromptData {
  weekRange: string;
  issueNumber: number;
  discoveryStats: DiscoveryStats;
  discoveredRobots: FetchResult;
  trendAnalysis: TrendAnalysis | null;
  collectedArticles?: {
    ieee: any[];
    robotreport: any[];
    arxiv: any[];
  };
}

// ============================================================================
// Prompt Template Functions
// ============================================================================

/**
 * Build system prompt with writing guidelines
 */
export function buildDigestSystemPrompt(): string {
  return `You are a technical writer specializing in AI robotics industry news and research. Your task is to create engaging, informative weekly digests for the Awesome Robots community.

WRITING GUIDELINES:

1. **Tone & Style**:
   - Professional yet accessible to both experts and enthusiasts
   - Enthusiastic about robotics innovation without being hyperbolic
   - Clear, concise, and information-dense
   - Use active voice and present tense for current developments

2. **Structure**:
   - TL;DR: 3-5 bullet points covering the week's most important developments
   - Introduction: Brief overview of the week's themes (2-3 sentences)
   - Top News & Breakthroughs: Organize by category (Company News, Product Launches, Funding, Industry Developments)
   - Research Spotlight: Highlight notable papers, open-source projects, and academic breakthroughs
   - Event Horizon: Upcoming conferences, workshops, and deadlines
   - Tool/Resource of the Week: Feature one useful resource for the community
   - Community Corner: Trending discussions, cool projects, community highlights
   - Trends to Watch: 3-5 emerging trends based on this week's signals
   - Conclusion: Forward-looking statement and engagement prompt

3. **Content Quality**:
   - Prioritize factual accuracy over excitement
   - Include specific details: company names, product models, technical specs, funding amounts
   - Explain significance: Why does this matter? What's the impact?
   - Link related developments to show industry patterns
   - Cite sources where appropriate

4. **Technical Depth**:
   - Balance accessibility with technical accuracy
   - Explain acronyms on first use
   - Include technical details for experts (specs, capabilities, benchmarks)
   - Provide context for non-experts (market impact, real-world applications)

5. **Formatting**:
   - Use markdown effectively (headers, bold, lists, links)
   - Break long sections into subsections
   - Use emojis sparingly for visual scanning (section headers only)
   - Keep paragraphs short and scannable

OUTPUT FORMAT:
- Return complete markdown content for the blog post
- Include frontmatter with title, metadata
- Follow the digest template structure exactly
- Do NOT include code blocks around the output - just return the raw markdown`;
}

/**
 * Build user prompt with data and instructions
 */
export function buildDigestUserPrompt(data: DigestPromptData): string {
  const {
    weekRange,
    issueNumber,
    discoveryStats,
    discoveredRobots,
    trendAnalysis,
    collectedArticles,
  } = data;

  return `Generate Awesome Robots Digest Issue #${issueNumber} for ${weekRange}.

WEEKLY DISCOVERY DATA:

## Discovery Statistics
- Total articles collected: ${discoveryStats.totalArticles}
- Total robots discovered: ${discoveryStats.totalRobots}
- New robots: ${discoveryStats.newRobots}
- Duplicates filtered: ${discoveryStats.duplicates}

### By Source:
${discoveryStats.bySource
  .map(
    (s) =>
      `- ${s.source}: ${s.robotsDiscovered} robots from ${s.totalArticles} articles (${(s.discoveryRate * 100).toFixed(1)}% discovery rate)`
  )
  .join('\n')}

### By Type:
- Humanoid: ${discoveryStats.byType.humanoid}
- Quadruped: ${discoveryStats.byType.quadruped}
- Other: ${discoveryStats.byType.other}

### By Status:
- Commercial: ${discoveryStats.byStatus.commercial}
- Prototype: ${discoveryStats.byStatus.prototype}
- Research: ${discoveryStats.byStatus.research}

### Quality Breakdown:
- High quality: ${discoveryStats.qualityBreakdown.high}
- Medium quality: ${discoveryStats.qualityBreakdown.medium}
- Low quality: ${discoveryStats.qualityBreakdown.low}

## Discovered Robots
${discoveredRobots.robots
  .map(
    (robot) => `
### ${robot.company} - ${robot.robot_name}
- Type: ${robot.type || 'Unknown'}
- Status: ${robot.status}
- Description: ${robot.description || 'No description'}
- Confidence: ${robot.confidence_score}/100
- Quality: ${robot.quality_score.overall}/100
- Source: ${robot.source_link}
- Specs: ${robot.specs_link || 'Not available'}
`
  )
  .join('\n')}

${
  trendAnalysis
    ? `
## Trend Analysis (${trendAnalysis.periodStart} to ${trendAnalysis.periodEnd})

### Emerging Companies:
${trendAnalysis.trends.emergingCompanies
  .map(
    (c) =>
      `- ${c.company}: ${c.robotCount} robots discovered (Momentum: ${c.momentum}, Latest: ${c.latestProduct})`
  )
  .join('\n')}

### Popular Features:
${trendAnalysis.trends.popularFeatures.map((f) => `- ${f.feature}: ${f.count}`).join('\n')}

### Growing Categories:
${trendAnalysis.trends.growingCategories.map((c) => `- ${c.category}: +${c.growth.toFixed(1)}%`).join('\n')}
`
    : '## Trend Analysis\nNot enough historical data for trend analysis yet.'
}

${
  collectedArticles
    ? `
## Collected Articles (for context)

### IEEE TV (${collectedArticles.ieee.length} articles)
${collectedArticles.ieee
  .slice(0, 5)
  .map((a: any) => `- ${a.title}\n  ${a.link}`)
  .join('\n')}

### The Robot Report (${collectedArticles.robotreport.length} articles)
${collectedArticles.robotreport
  .slice(0, 5)
  .map((a: any) => `- ${a.title}\n  ${a.link}`)
  .join('\n')}

### arXiv cs.RO (${collectedArticles.arxiv.length} papers)
${collectedArticles.arxiv
  .slice(0, 5)
  .map((a: any) => `- ${a.title}\n  ${a.link}`)
  .join('\n')}
`
    : ''
}

TASK:
Create a complete, engaging weekly digest that:
1. Highlights the most significant developments from the discovered robots
2. Organizes news by category (company news, product launches, funding, research)
3. Identifies and explains emerging trends
4. Provides context and significance for each development
5. Includes forward-looking insights about what to watch next

Use the template structure from the system prompt. Make it informative, engaging, and valuable for the robotics community.

Return ONLY the markdown content with frontmatter - no code blocks, no explanations.`;
}

/**
 * Extract markdown content from Claude's response
 * Handles cases where Claude wraps content in code blocks
 */
export function extractMarkdownFromResponse(response: string): string {
  // Remove code block wrapper if present
  const codeBlockMatch = response.match(/```(?:markdown)?\n([\s\S]*?)\n```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  // Return as-is if no code block
  return response.trim();
}

import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import type { DiscoveredRobot } from '@/types/discovered-robot';

// Zod schema for validation
const DiscoveredRobotBaseSchema = z.object({
  company: z.string().nullable(),
  robot_name: z.string().nullable(),
  type: z.enum(['humanoid', 'quadruped']).nullable(),
  status: z.enum(['research', 'prototype', 'commercial']),
  image_link: z.string().url().nullable().or(z.literal(null)),
  specs_link: z.string().url().nullable().or(z.literal(null)),
  source_link: z.string().url(),
  confidence_score: z.number().min(0).max(100),
  description: z.string().optional(),
});

class AnthropicClient {
  private client: Anthropic;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }
    this.client = new Anthropic({ apiKey });
  }

  async extractRobotData(
    content: string,
    sourceUrl: string,
    sourceType: 'rss' | 'arxiv'
  ): Promise<DiscoveredRobot[]> {
    try {
      const prompt = this.buildPrompt(content, sourceUrl, sourceType);

      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      // Extract text content from response
      const responseText = message.content
        .filter(block => block.type === 'text')
        .map(block => (block as { type: 'text'; text: string }).text)
        .join('');

      // Parse JSON response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.warn('No JSON array found in Claude response');
        return [];
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate and filter
      const robots: DiscoveredRobot[] = [];
      for (const item of Array.isArray(parsed) ? parsed : [parsed]) {
        try {
          const validated = DiscoveredRobotBaseSchema.parse(item);

          // Filter by confidence threshold
          if (validated.confidence_score < 50) {
            continue;
          }

          robots.push({
            ...validated,
            discovered_at: new Date().toISOString(),
            source_type: sourceType === 'rss' ? (sourceUrl.includes('ieee') ? 'ieee' : 'robotreport') : 'arxiv',
            quality_score: {
              overall: 0,
              completeness: 0,
              reliability: 0,
              flags: [],
            },
          });
        } catch (validationError) {
          console.warn('Validation failed for robot:', item, validationError);
        }
      }

      return robots;
    } catch (error) {
      throw new Error(`Failed to extract robot data: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private buildPrompt(content: string, sourceUrl: string, sourceType: string): string {
    const contentType = sourceType === 'arxiv' ? 'research paper' : 'article';

    return `You are a robotics analyst. Extract robot information from this ${contentType}.

Output a JSON array with these fields for each robot mentioned:
- company: manufacturer/research institution name (null if unclear)
- robot_name: official product/prototype name (null if unclear)
- type: "humanoid" | "quadruped" | null (null if not clearly one of these two types)
- status: "research" | "prototype" | "commercial" (research for papers/labs, prototype for demos, commercial for available products)
- image_link: URL to robot image if mentioned in article (null otherwise)
- specs_link: URL to specifications/product page if mentioned (null otherwise)
- source_link: "${sourceUrl}"
- confidence_score: 0-100 (how confident you are in the extraction accuracy)
- description: brief 1-sentence description of the robot

Important rules:
1. Only extract PHYSICAL robots (not software, simulations, or algorithms)
2. Set type to null if robot is not clearly humanoid or quadruped (skip industrial arms, drones, etc.)
3. Return empty array [] if no physical humanoid/quadruped robots are found
4. Be conservative with confidence scores - only use 80+ for clear, detailed mentions
5. Extract actual URLs from the article text, don't guess or generate them

Article content:
${content}

Respond with ONLY the JSON array, no additional text.`;
  }
}

export { AnthropicClient };

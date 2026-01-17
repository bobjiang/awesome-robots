import Anthropic from '@anthropic-ai/sdk';

export interface AnthropicClientConfig {
  apiKey?: string;
  maxRetries?: number;
}

export class AnthropicClient {
  private client: Anthropic;
  private maxRetries: number;

  constructor(config: AnthropicClientConfig = {}) {
    const apiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }

    this.client = new Anthropic({ apiKey });
    this.maxRetries = config.maxRetries || 3;
  }

  async generateText(
    prompt: string,
    systemPrompt?: string,
    options: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
    } = {}
  ): Promise<string> {
    const maxRetries = this.maxRetries;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await this.client.messages.create({
          model: options.model || 'claude-3-5-sonnet-20241022',
          max_tokens: options.maxTokens || 8192,
          temperature: options.temperature || 1.0,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        });

        const textContent = response.content.find((block) => block.type === 'text');
        if (!textContent || textContent.type !== 'text') {
          throw new Error('No text content in response');
        }

        return textContent.text;
      } catch (error) {
        lastError = error as Error;
        console.error(`Attempt ${attempt}/${maxRetries} failed:`, error);

        if (attempt < maxRetries) {
          // Exponential backoff: 2^attempt seconds
          const delayMs = Math.pow(2, attempt) * 1000;
          console.log(`Retrying in ${delayMs / 1000}s...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }

    throw new Error(`Failed after ${maxRetries} retries: ${lastError?.message}`);
  }
}

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

  private isRetryableError(error: unknown): boolean {
    // Check if error has status property (API errors)
    if (error && typeof error === 'object' && 'status' in error) {
      const status = (error as { status: number }).status;

      // Retry rate limit errors (429) and server errors (500+)
      if (status === 429 || status >= 500) {
        return true;
      }

      // Don't retry client errors (400, 401, 403, 404, etc.)
      if (status >= 400 && status < 500) {
        return false;
      }
    }

    // Retry network/connection errors (no status code)
    // These typically have error codes like ECONNREFUSED, ETIMEDOUT, etc.
    if (error && typeof error === 'object' && 'code' in error) {
      const code = (error as { code: string }).code;
      const networkErrors = ['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'ENETUNREACH'];
      if (networkErrors.includes(code)) {
        return true;
      }
    }

    // Default to retrying unknown errors
    return true;
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
          model: options.model || 'claude-sonnet-4-5-20250929',
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

        // Check if error is retryable
        const isRetryable = this.isRetryableError(error);

        if (attempt < maxRetries && isRetryable) {
          // Exponential backoff: 2s, 4s, 8s
          const delayMs = Math.pow(2, attempt) * 1000;
          console.log(`Retrying in ${delayMs / 1000}s...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        } else if (!isRetryable) {
          // Don't retry non-retryable errors
          break;
        }
      }
    }

    throw new Error(`Failed after ${maxRetries} retries: ${lastError?.message}`);
  }
}

interface DevToArticle {
  title: string;
  published: boolean;
  body_markdown: string;
  main_image?: string;
  tags: string[];
  canonical_url?: string;
  description?: string;
}

interface DevToResponse {
  id: number;
  title: string;
  url: string;
  published: boolean;
  created_at: string;
}

class DevToClient {
  private apiKey: string;
  private baseUrl = 'https://dev.to/api';

  constructor() {
    this.apiKey = process.env.DEV_TO_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('DEV_TO_API_KEY environment variable is required');
    }
  }

  async createArticle(article: DevToArticle): Promise<DevToResponse> {
    const response = await fetch(`${this.baseUrl}/articles`, {
      method: 'POST',
      headers: {
        'api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ article }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create article on dev.to: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  async updateArticle(articleId: number, article: Partial<DevToArticle>): Promise<DevToResponse> {
    const response = await fetch(`${this.baseUrl}/articles/${articleId}`, {
      method: 'PUT',
      headers: {
        'api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ article }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update article on dev.to: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  async getMyArticles(): Promise<DevToResponse[]> {
    const response = await fetch(`${this.baseUrl}/articles/me`, {
      headers: {
        'api-key': this.apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch articles from dev.to: ${response.status} ${errorText}`);
    }

    return response.json();
  }
}

export { DevToClient, type DevToArticle, type DevToResponse };
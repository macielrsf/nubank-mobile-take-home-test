import { ShortenedUrl } from '../entities/ShortenedUrl';

export interface ShortenUrlUseCase {
  execute(url: string): Promise<ShortenedUrl>;
}

export interface UrlRepository {
  shortenUrl(url: string): Promise<ShortenedUrl>;
}

export class ShortenUrl implements ShortenUrlUseCase {
  constructor(private repository: UrlRepository) {}

  async execute(url: string): Promise<ShortenedUrl> {
    if (!this.isValidUrl(url)) {
      throw new Error('Invalid URL format');
    }

    // Check if URL is accessible before shortening
    const isAccessible = await this.checkUrlAccessibility(url);
    if (!isAccessible) {
      throw new Error('URL is not accessible');
    }

    return this.repository.shortenUrl(url);
  }

  private isValidUrl(url: string): boolean {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return false;
    }
    try {
      // eslint-disable-next-line no-new
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private async checkUrlAccessibility(url: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(url, {
        method: 'HEAD', // Use HEAD to avoid downloading the entire content
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Consider the URL accessible if we get any response (even 404)
      // This means the server responded
      return response.status < 500;
    } catch {
      // URL is not accessible (network error, timeout, CORS, etc.)
      return false;
    }
  }
}

import { UrlResolverApi } from '../repositories/UrlResolver';
import { HttpClient } from '../../infra/http/apiClient';

export class UrlResolverApiImpl implements UrlResolverApi {
  constructor(private httpClient: HttpClient) {}

  async resolve(shortUrl: string): Promise<string> {
    try {
      const response = await this.httpClient.get<{ url: string }>(shortUrl);

      if (response && response.url) {
        return response.url;
      }

      // Fallback to the original short URL
      return shortUrl;
    } catch (error) {
      console.error('Error resolving short URL:', error);
      // Always fallback to the original short URL on any error
      return shortUrl;
    }
  }
}

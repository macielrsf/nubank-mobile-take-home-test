import { UrlResolver } from '../../domain/usecases/resolveShortUrl';

export interface UrlResolverApi {
  resolve(shortUrl: string): Promise<string>;
}

export class UrlResolverImpl implements UrlResolver {
  constructor(private api: UrlResolverApi) {}

  async resolveUrl(shortUrl: string): Promise<string> {
    return this.api.resolve(shortUrl);
  }
}

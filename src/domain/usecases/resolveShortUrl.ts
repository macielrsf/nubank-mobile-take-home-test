export interface ResolveShortUrlUseCase {
  execute(shortUrl: string): Promise<string>;
}

export interface UrlResolver {
  resolveUrl(shortUrl: string): Promise<string>;
}

export class ResolveShortUrl implements ResolveShortUrlUseCase {
  constructor(private urlResolver: UrlResolver) {}

  async execute(shortUrl: string): Promise<string> {
    return this.urlResolver.resolveUrl(shortUrl);
  }
}

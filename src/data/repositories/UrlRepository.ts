import { ShortenedUrl } from '../../domain/entities/ShortenedUrl';
import { UrlRepository as IUrlRepository } from '../../domain/usecases/shortenUrl';
import { UrlApi } from '../sources/UrlApi';

export class UrlRepositoryImpl implements IUrlRepository {
  constructor(private urlApi: UrlApi) {}

  async shortenUrl(url: string): Promise<ShortenedUrl> {
    const response = await this.urlApi.shortenUrl(url);

    return {
      alias: response.alias,
      originalUrl: response._links.self,
      shortUrl: response._links.short,
    };
  }
}

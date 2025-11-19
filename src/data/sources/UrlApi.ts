import { HttpClient } from '../../infra/http/apiClient';

export interface UrlApiResponse {
  alias: string;
  _links: {
    self: string;
    short: string;
  };
}

export class UrlApi {
  private readonly baseUrl =
    'https://url-shortener-server.onrender.com/api/alias';

  constructor(private httpClient: HttpClient) {}

  async shortenUrl(url: string): Promise<UrlApiResponse> {
    return this.httpClient.post<UrlApiResponse>(this.baseUrl, { url });
  }
}

import { UrlApi } from '../../data/sources/UrlApi';
import { HttpClient } from '../../infra/http/apiClient';

describe('UrlApi', () => {
  let mockHttpClient: jest.Mocked<HttpClient>;
  let urlApi: UrlApi;

  beforeEach(() => {
    mockHttpClient = {
      post: jest.fn(),
      get: jest.fn(),
    };
    urlApi = new UrlApi(mockHttpClient);
  });

  it('should call HTTP client with correct parameters', async () => {
    const url = 'https://google.com';
    const mockResponse = {
      alias: 'abc123',
      _links: {
        self: url,
        short: 'https://short.url/abc123',
      },
    };

    mockHttpClient.post.mockResolvedValue(mockResponse);

    const result = await urlApi.shortenUrl(url);

    expect(mockHttpClient.post).toHaveBeenCalledWith(
      'https://url-shortener-server.onrender.com/api/alias',
      { url },
    );
    expect(result).toEqual(mockResponse);
  });

  it('should propagate HTTP errors', async () => {
    const error = new Error('HTTP Error: 500');
    mockHttpClient.post.mockRejectedValue(error);

    await expect(urlApi.shortenUrl('https://google.com')).rejects.toThrow(
      'HTTP Error: 500',
    );
  });
});

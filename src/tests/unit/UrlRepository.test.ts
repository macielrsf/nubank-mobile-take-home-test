import { UrlRepositoryImpl } from '../../data/repositories/UrlRepository';
import { UrlApi, UrlApiResponse } from '../../data/sources/UrlApi';

describe('UrlRepository', () => {
  let mockApi: jest.Mocked<UrlApi>;
  let repository: UrlRepositoryImpl;

  beforeEach(() => {
    mockApi = {
      shortenUrl: jest.fn(),
    } as any;
    repository = new UrlRepositoryImpl(mockApi);
  });

  it('should transform API response to domain entity', async () => {
    const mockApiResponse: UrlApiResponse = {
      alias: 'abc123',
      _links: {
        self: 'https://google.com',
        short: 'https://short.url/abc123',
      },
    };

    mockApi.shortenUrl.mockResolvedValue(mockApiResponse);

    const result = await repository.shortenUrl('https://google.com');

    expect(result).toEqual({
      alias: 'abc123',
      originalUrl: 'https://google.com',
      shortUrl: 'https://short.url/abc123',
    });
  });

  it('should call API with correct URL', async () => {
    const url = 'https://example.com';
    const mockApiResponse: UrlApiResponse = {
      alias: 'test',
      _links: {
        self: url,
        short: 'https://short.url/test',
      },
    };

    mockApi.shortenUrl.mockResolvedValue(mockApiResponse);

    await repository.shortenUrl(url);

    expect(mockApi.shortenUrl).toHaveBeenCalledWith(url);
  });

  it('should propagate API errors', async () => {
    const error = new Error('Network error');
    mockApi.shortenUrl.mockRejectedValue(error);

    await expect(repository.shortenUrl('https://google.com')).rejects.toThrow(
      'Network error',
    );
  });
});

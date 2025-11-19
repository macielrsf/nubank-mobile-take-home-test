import { ShortenUrl, UrlRepository } from '../../domain/usecases/shortenUrl';
import { ShortenedUrl } from '../../domain/entities/ShortenedUrl';

declare const global: { fetch: jest.Mock };

describe('ShortenUrl Use Case', () => {
  let mockRepository: jest.Mocked<UrlRepository>;
  let useCase: ShortenUrl;
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    mockRepository = {
      shortenUrl: jest.fn(),
    };
    useCase = new ShortenUrl(mockRepository);

    // Mock fetch for URL accessibility checks
    originalFetch = global.fetch;
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should shorten a valid URL', async () => {
    const mockUrl = 'https://google.com';
    const mockResult: ShortenedUrl = {
      alias: 'abc123',
      originalUrl: 'https://google.com',
      shortUrl: 'https://short.url/abc123',
    };

    // Mock URL accessibility check
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
    });

    mockRepository.shortenUrl.mockResolvedValue(mockResult);

    const result = await useCase.execute(mockUrl);

    expect(result).toEqual(mockResult);
    expect(mockRepository.shortenUrl).toHaveBeenCalledWith(mockUrl);
  });

  it('should throw error for invalid URL', async () => {
    const invalidUrl = 'not-a-valid-url';

    await expect(useCase.execute(invalidUrl)).rejects.toThrow(
      'Invalid URL format',
    );
    expect(mockRepository.shortenUrl).not.toHaveBeenCalled();
  });

  it('should throw error for URL without protocol', async () => {
    const invalidUrl = 'google.com';

    await expect(useCase.execute(invalidUrl)).rejects.toThrow(
      'Invalid URL format',
    );
  });

  it('should accept http URLs', async () => {
    const mockUrl = 'http://example.com';
    const mockResult: ShortenedUrl = {
      alias: 'xyz789',
      originalUrl: 'http://example.com',
      shortUrl: 'https://short.url/xyz789',
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
    });

    mockRepository.shortenUrl.mockResolvedValue(mockResult);

    const result = await useCase.execute(mockUrl);

    expect(result).toEqual(mockResult);
  });

  it('should propagate repository errors', async () => {
    const mockUrl = 'https://google.com';
    const error = new Error('HTTP Error: 500');

    (global.fetch as jest.Mock).mockResolvedValue({
      status: 200,
    });

    mockRepository.shortenUrl.mockRejectedValue(error);

    await expect(useCase.execute(mockUrl)).rejects.toThrow('HTTP Error: 500');
  });

  it('should throw error when URL is not accessible', async () => {
    const mockUrl = 'https://nonexistent-domain-12345.com';

    // Mock fetch to simulate network error
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(useCase.execute(mockUrl)).rejects.toThrow(
      'URL is not accessible',
    );
    expect(mockRepository.shortenUrl).not.toHaveBeenCalled();
  });

  it('should throw error when URL returns server error (5xx)', async () => {
    const mockUrl = 'https://example.com';

    (global.fetch as jest.Mock).mockResolvedValue({
      status: 500,
    });

    await expect(useCase.execute(mockUrl)).rejects.toThrow(
      'URL is not accessible',
    );
    expect(mockRepository.shortenUrl).not.toHaveBeenCalled();
  });

  it('should accept URL that returns 404 (client error)', async () => {
    const mockUrl = 'https://example.com/not-found';
    const mockResult: ShortenedUrl = {
      alias: 'xyz789',
      originalUrl: 'https://example.com/not-found',
      shortUrl: 'https://short.url/xyz789',
    };

    // 404 is acceptable - server responded
    (global.fetch as jest.Mock).mockResolvedValue({
      status: 404,
    });

    mockRepository.shortenUrl.mockResolvedValue(mockResult);

    const result = await useCase.execute(mockUrl);

    expect(result).toEqual(mockResult);
  });

  it('should handle timeout when checking URL accessibility', async () => {
    const mockUrl = 'https://slow-server.com';

    // Simulate timeout with AbortError
    (global.fetch as jest.Mock).mockRejectedValue(
      Object.assign(new Error('The operation was aborted'), {
        name: 'AbortError',
      }),
    );

    await expect(useCase.execute(mockUrl)).rejects.toThrow(
      'URL is not accessible',
    );
    expect(mockRepository.shortenUrl).not.toHaveBeenCalled();
  });
});

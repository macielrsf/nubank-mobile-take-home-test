import { FetchHttpClient } from '../../infra/http/apiClient';

declare const global: { fetch: jest.Mock };

describe('FetchHttpClient', () => {
  let client: FetchHttpClient;

  beforeEach(() => {
    client = new FetchHttpClient();
    global.fetch.mockClear();
  });

  describe('post', () => {
    it('should make POST request with correct parameters', async () => {
      const mockResponse = { alias: 'test' };
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.post('https://api.test.com', { url: 'test' });

      expect(global.fetch).toHaveBeenCalledWith('https://api.test.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: 'test' }),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error on non-ok response', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(
        client.post('https://api.test.com', { url: 'test' }),
      ).rejects.toThrow('HTTP Error: 500');
    });
  });

  describe('get', () => {
    it('should make GET request', async () => {
      const mockResponse = { data: 'test' };
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.get('https://api.test.com');

      expect(global.fetch).toHaveBeenCalledWith('https://api.test.com');
      expect(result).toEqual(mockResponse);
    });

    it('should throw error on non-ok response', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404,
      });

      await expect(client.get('https://api.test.com')).rejects.toThrow(
        'HTTP Error: 404',
      );
    });
  });
});

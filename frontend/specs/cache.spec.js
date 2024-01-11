import cache from '../src/cache.js';

describe('Cache Utility', () => {
  const cacheKeyPrefix = 'cache-acme-hotel-example';
  const url = 'test-url';
  const cacheKey = `${cacheKeyPrefix}/${url}`;
  const token = 'test-token';
  const mockClient = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrSet', () => {
    it('should return cached data if available', async () => {
      const mockCachedData = { key: 'value' };
      const mockFunc = async () => mockCachedData;

      jest.spyOn(cache, 'getFromCache').mockResolvedValue(mockCachedData);

      const result = await cache.getOrSet(url, token, mockFunc, mockClient);

      expect(result).toEqual(mockCachedData);
    });

    it('should call the provided function and cache the result if no data is available', async () => {
      const mockFunctionResult = { key: 'value' };

      jest.spyOn(cache, 'getFromCache').mockResolvedValueOnce(null);
      jest.spyOn(cache, 'setCache').mockImplementationOnce(() => { });

      const mockFunction = jest.fn().mockResolvedValueOnce(mockFunctionResult);

      const result = await cache.getOrSet(url, token, mockFunction, mockClient);

      expect(result).toEqual(mockFunctionResult);
    });
  });

  describe('invalidate', () => {
    it('should delete data from cache', async () => {
      const mockClient = { delete: jest.fn((_, callback) => callback(null, true)) };

      const input = { url: 'test-url', cacheClient: mockClient };
      const result = await cache.invalidate(input);

      expect(result).toBe(true);
      expect(mockClient.delete).toHaveBeenCalledWith(cacheKey, expect.any(Function));
    });

    it('should throw an error if deleting data from cache fails', async () => {
      const mockClient = { delete: jest.fn((_, callback) => callback(new Error('Delete error'))) };

      const input = { url: 'test-url', cacheClient: mockClient };
      await expect(cache.invalidate(input)).rejects.toThrow('Delete error');
      expect(mockClient.delete).toHaveBeenCalled();
    });
  });
});


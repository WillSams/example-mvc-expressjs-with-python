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
});


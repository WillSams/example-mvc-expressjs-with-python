import memjs from 'memjs';
import utils from './utils.js';

const client = memjs.Client.create();
const cacheKeyPrefix = process.env.CACHE_KEY_PREFIX;

// Cap how long we wait on memcached so an unreachable or misbehaving cache
// degrades to a live fetch instead of hanging the request.
const CACHE_TIMEOUT_MS = 500;

const withTimeout = (promise, ms, label) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);

const setCache = (cacheKey, data, cacheClient) => {
  cacheClient
    .set(cacheKey, JSON.stringify(data), { expires: process.env.CACHE_EXPIRATION })
    .catch((err) => console.warn(`[cache] set failed for ${cacheKey}:`, err.message));
};

const getFromCache = (cacheKey, cacheClient) => {
  const get = new Promise((resolve, reject) => {
    cacheClient.get(cacheKey, (err, content) => {
      if (err) reject(err);
      else {
        const contentString = content?.toString('utf8');
        const parsedContent = utils.isJSON(contentString) ? JSON.parse(contentString) : contentString;
        resolve(parsedContent);
      }
    });
  });
  return withTimeout(get, CACHE_TIMEOUT_MS, `cache get for ${cacheKey}`);
};

const getOrSet = async (url, token, func, { cacheClient = client } = {}) => {
  const cacheKey = `${cacheKeyPrefix}/${url}`;

  try {
    const content = await getFromCache(cacheKey, cacheClient);
    if (content) return content;
  } catch (err) {
    console.warn(
      `[cache] unavailable (${err.message}); serving live results without caching`
    );
    return func(token);
  }

  const data = await func(token);
  setCache(cacheKey, data, cacheClient);
  return data;
};

const invalidate = ({ url = '', cacheClient = client }) => {
  return new Promise((resolve, reject) => {
    const cacheKey = `${cacheKeyPrefix}/${url}`;
    cacheClient.delete(cacheKey, (err, deleted) => {
      if (err) reject(err);
      else resolve(deleted);
    });
  });
};

export default { getFromCache, getOrSet, invalidate, setCache };

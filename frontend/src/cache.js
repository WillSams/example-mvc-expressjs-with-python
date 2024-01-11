import memjs from 'memjs';
import utils from './utils.js';

const client = memjs.Client.create();
const cacheKeyPrefix = process.env.CACHE_KEY_PREFIX;

const setCache = (cacheKey, data, cacheClient) => {
  cacheClient.set(cacheKey, JSON.stringify(data), { expires: process.env.CACHE_EXPIRATION });
};

const getFromCache = (cacheKey, cacheClient) => {
  return new Promise((resolve, reject) => {
    cacheClient.get(cacheKey, (err, content) => {
      if (err) reject(err);
      else {
        const contentString = content?.toString('utf8');
        const parsedContent = utils.isJSON(contentString) ? JSON.parse(contentString) : contentString;
        resolve(parsedContent);
      }
    });
  });
};

const getOrSet = async (url, token, func, { cacheClient = client } = {}) => {
  const cacheKey = `${cacheKeyPrefix}/${url}`;

  try {
    const content = await getFromCache(cacheKey, cacheClient);
    if (content) return content;
    else {
      const data = await func(token);
      setCache(cacheKey, data, cacheClient);
      return data;
    }
  } catch (error) {
    throw error;
  }
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

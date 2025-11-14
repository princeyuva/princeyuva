/**
 * Save A Life Redis Configuration
 * Redis connection for caching, sessions, and real-time data
 */

const redis = require('redis');
require('dotenv').config();

// Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: process.env.REDIS_DB || 0,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  // Connection configuration for production
  ...(process.env.NODE_ENV === 'production' && {
    tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
    keepAlive: 30000,
    connectTimeout: 10000,
    commandTimeout: 5000,
  }),
  // Configuration for development
  ...(process.env.NODE_ENV === 'development' && {
    connectTimeout: 10000,
    commandTimeout: 5000,
  }),
  // Configuration for testing
  ...(process.env.NODE_ENV === 'test' && {
    host: process.env.TEST_REDIS_HOST || 'localhost',
    port: process.env.TEST_REDIS_PORT || 6379,
    db: 1, // Different database for tests
  }),
};

// Create Redis client
const redisClient = redis.createClient(redisConfig);

// Global Redis client for graceful shutdown
global.redisClient = redisClient;

/**
 * Connect to Redis
 */
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis connection successful');

    // Test connection
    await redisClient.ping();
    console.log('Redis ping successful');

    return redisClient;
  } catch (error) {
    console.error('Redis connection failed:', error);
    throw error;
  }
};

/**
 * Close Redis connection
 */
const closeRedis = async () => {
  try {
    await redisClient.quit();
    console.log('Redis connection closed');
  } catch (error) {
    console.error('Error closing Redis connection:', error);
    throw error;
  }
};

/**
 * Health check for Redis
 */
const healthCheck = async () => {
  try {
    const result = await redisClient.ping();
    return {
      status: 'healthy',
      response: result,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Cache helper functions
 */
const cache = {
  /**
   * Set cache with expiration
   */
  set: async (key, value, ttl = 3600) => {
    try {
      const serializedValue = JSON.stringify(value);
      await redisClient.setEx(key, ttl, serializedValue);
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  },

  /**
   * Get cache value
   */
  get: async (key) => {
    try {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  /**
   * Delete cache key
   */
  del: async (key) => {
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  },

  /**
   * Check if key exists
   */
  exists: async (key) => {
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  },

  /**
   * Set cache with expiration in seconds
   */
  setex: async (key, seconds, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      await redisClient.setEx(key, seconds, serializedValue);
      return true;
    } catch (error) {
      console.error('Cache setex error:', error);
      return false;
    }
  },

  /**
   * Increment counter
   */
  incr: async (key) => {
    try {
      return await redisClient.incr(key);
    } catch (error) {
      console.error('Cache incr error:', error);
      return null;
    }
  },

  /**
   * Increment counter by specified amount
   */
  incrby: async (key, amount) => {
    try {
      return await redisClient.incrBy(key, amount);
    } catch (error) {
      console.error('Cache incrby error:', error);
      return null;
    }
  },

  /**
   * Add to set
   */
  sadd: async (key, ...members) => {
    try {
      const serializedMembers = members.map(member => JSON.stringify(member));
      return await redisClient.sAdd(key, serializedMembers);
    } catch (error) {
      console.error('Cache sadd error:', error);
      return 0;
    }
  },

  /**
   * Get all set members
   */
  smembers: async (key) => {
    try {
      const members = await redisClient.sMembers(key);
      return members.map(member => JSON.parse(member));
    } catch (error) {
      console.error('Cache smembers error:', error);
      return [];
    }
  },

  /**
   * Remove from set
   */
  srem: async (key, ...members) => {
    try {
      const serializedMembers = members.map(member => JSON.stringify(member));
      return await redisClient.sRem(key, serializedMembers);
    } catch (error) {
      console.error('Cache srem error:', error);
      return 0;
    }
  },

  /**
   * Push to list
   */
  lpush: async (key, ...elements) => {
    try {
      const serializedElements = elements.map(element => JSON.stringify(element));
      return await redisClient.lPush(key, serializedElements);
    } catch (error) {
      console.error('Cache lpush error:', error);
      return 0;
    }
  },

  /**
   * Pop from list
   */
  rpop: async (key) => {
    try {
      const element = await redisClient.rPop(key);
      return element ? JSON.parse(element) : null;
    } catch (error) {
      console.error('Cache rpop error:', error);
      return null;
    }
  },

  /**
   * Get list range
   */
  lrange: async (key, start = 0, stop = -1) => {
    try {
      const elements = await redisClient.lRange(key, start, stop);
      return elements.map(element => JSON.parse(element));
    } catch (error) {
      console.error('Cache lrange error:', error);
      return [];
    }
  },

  /**
   * Get list length
   */
  llen: async (key) => {
    try {
      return await redisClient.lLen(key);
    } catch (error) {
      console.error('Cache llen error:', error);
      return 0;
    }
  },
};

/**
 * Session management
 */
const session = {
  /**
   * Create session
   */
  create: async (sessionId, userData, ttl = 86400) => { // 24 hours default
    const sessionKey = `session:${sessionId}`;
    return await cache.set(sessionKey, userData, ttl);
  },

  /**
   * Get session
   */
  get: async (sessionId) => {
    const sessionKey = `session:${sessionId}`;
    return await cache.get(sessionKey);
  },

  /**
   * Update session
   */
  update: async (sessionId, userData, ttl = 86400) => {
    const sessionKey = `session:${sessionId}`;
    return await cache.set(sessionKey, userData, ttl);
  },

  /**
   * Delete session
   */
  delete: async (sessionId) => {
    const sessionKey = `session:${sessionId}`;
    return await cache.del(sessionKey);
  },

  /**
   * Refresh session TTL
   */
  refresh: async (sessionId, ttl = 86400) => {
    const sessionKey = `session:${sessionId}`;
    try {
      await redisClient.expire(sessionKey, ttl);
      return true;
    } catch (error) {
      console.error('Session refresh error:', error);
      return false;
    }
  },
};

module.exports = {
  redisClient,
  connectRedis,
  closeRedis,
  healthCheck,
  cache,
  session,
};
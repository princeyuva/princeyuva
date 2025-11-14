/**
 * Save A Life Database Configuration
 * PostgreSQL connection and configuration using Knex.js
 */

const knex = require('knex');
require('dotenv').config();

// Database configuration
const dbConfig = {
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'save_a_life',
  },
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 60000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './seeds',
  },
  // Connection configuration for production
  ...(process.env.NODE_ENV === 'production' && {
    ssl: {
      rejectUnauthorized: false,
      cert: process.env.DB_SSL_CERT,
    },
    debug: false,
  }),
  // Connection configuration for development
  ...(process.env.NODE_ENV === 'development' && {
    debug: true,
  }),
  // Connection configuration for testing
  ...(process.env.NODE_ENV === 'test' && {
    connection: {
      host: process.env.TEST_DB_HOST || 'localhost',
      port: process.env.TEST_DB_PORT || 5432,
      user: process.env.TEST_DB_USER || 'postgres',
      password: process.env.TEST_DB_PASSWORD || 'password',
      database: process.env.TEST_DB_NAME || 'save_a_life_test',
    },
    debug: false,
  }),
};

// Create database connection
const db = knex(dbConfig);

// Global database connection for graceful shutdown
global.dbConnection = db;

/**
 * Connect to database
 */
const connectDB = async () => {
  try {
    // Test connection
    await db.raw('SELECT 1 + 1 as result');
    console.log('Database connection successful');

    // Run migrations if not in test environment
    if (process.env.NODE_ENV !== 'test') {
      await db.migrate.latest();
      console.log('Database migrations completed');
    }

    return db;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

/**
 * Close database connection
 */
const closeDB = async () => {
  try {
    await db.destroy();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
};

/**
 * Health check for database
 */
const healthCheck = async () => {
  try {
    await db.raw('SELECT 1');
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Get database statistics
 */
const getStats = async () => {
  try {
    const stats = await db.raw(`
      SELECT
        schemaname,
        tablename,
        attname,
        n_distinct,
        correlation
      FROM pg_stats
      WHERE schemaname = 'public'
      LIMIT 10
    `);

    return {
      tables: stats.rows,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    return null;
  }
};

/**
 * Execute raw query with error handling
 */
const executeQuery = async (query, params = []) => {
  try {
    const result = await db.raw(query, params);
    return result;
  } catch (error) {
    console.error('Query execution error:', error);
    throw error;
  }
};

/**
 * Transaction helper
 */
const transaction = async (callback) => {
  const trx = await db.transaction();
  try {
    const result = await callback(trx);
    await trx.commit();
    return result;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

module.exports = {
  db,
  connectDB,
  closeDB,
  healthCheck,
  getStats,
  executeQuery,
  transaction,
};
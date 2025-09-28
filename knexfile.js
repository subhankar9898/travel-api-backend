module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './travel.db'
    },
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    },
    // ---- ADD THIS ENTIRE BLOCK ----
    pool: {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 30000, // Increase timeout to 30 seconds
    }
    // ---------------------------------
  }
};


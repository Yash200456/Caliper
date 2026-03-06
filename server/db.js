const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool to your Neon database
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // This is required for secure cloud databases like Neon!
    }
});

module.exports = pool;
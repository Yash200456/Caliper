const { Pool } = require('pg');
require('dotenv').config();

// ensure we have a database URL; fail fast if not
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error("❌ DATABASE_URL is not defined. Please copy .env.example to .env and set the correct connection string.");
    process.exit(1);
}

// Create a connection pool to your Neon database (or whatever Postgres host you're using)
const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false // This is required for secure cloud databases like Neon!
    }
});

module.exports = pool;
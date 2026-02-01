const { Pool } = require('pg');

// PostgreSQL connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://vinevault:vinevault123@localhost:5432/vinevault',
  ssl: false
});

// Test database connection
pool.on('connect', () => {
  console.log('✓ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err.message);
});

// Initialize database connection
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    console.log('✓ Database connection established');
    
    // Test query to verify connection
    await client.query('SELECT NOW()');
    console.log('✓ Database connection verified');
    
    client.release();
  } catch (err) {
    console.error('Database initialization error:', err.message);
    throw err;
  }
}

// Execute query helper
async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error:', { text, error: error.message });
    throw error;
  }
}

// Initialize on module load
initializeDatabase().catch(console.error);

module.exports = {
  query,
  pool
};

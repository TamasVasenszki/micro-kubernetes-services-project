const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

app.get("/validate", async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS auth_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL
      )
    `);

    await pool.query(`
      INSERT INTO auth_users (username)
      SELECT 'demo-user'
      WHERE NOT EXISTS (
        SELECT 1 FROM auth_users WHERE username = 'demo-user'
      )
    `);

    const result = await pool.query(
      "SELECT id, username FROM auth_users LIMIT 1"
    );

    res.json({
      service: "auth",
      authorized: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Auth DB error:", error.message);

    res.status(500).json({
      service: "auth",
      error: "Database error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
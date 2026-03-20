const express = require("express");
const axios = require("axios");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3002;

const AUTH_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3000/validate";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

app.get("/employees", async (req, res) => {
  try {
    const authResponse = await axios.get(AUTH_URL);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      )
    `);

    await pool.query(`
      INSERT INTO employees (name)
      SELECT 'John Doe'
      WHERE NOT EXISTS (
        SELECT 1 FROM employees WHERE name = 'John Doe'
      )
    `);

    const result = await pool.query(
      "SELECT id, name FROM employees LIMIT 1"
    );

    res.json({
      service: "hr",
      auth: authResponse.data,
      employee: result.rows[0],
    });
  } catch (error) {
    console.error("HR error:", error.message);

    res.status(500).json({
      service: "hr",
      error: "HR service error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`HR service running on port ${PORT}`);
});
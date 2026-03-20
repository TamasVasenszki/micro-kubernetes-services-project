const express = require("express");
const axios = require("axios");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3001;

const AUTH_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3000/validate";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

app.get("/files", async (req, res) => {
  try {
    const authResponse = await axios.get(AUTH_URL);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS files (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(100) NOT NULL
      )
    `);

    await pool.query(`
      INSERT INTO files (filename)
      SELECT 'demo-file.txt'
      WHERE NOT EXISTS (
        SELECT 1 FROM files WHERE filename = 'demo-file.txt'
      )
    `);

    const result = await pool.query(
      "SELECT id, filename FROM files LIMIT 1"
    );

    res.json({
      service: "storage",
      auth: authResponse.data,
      file: result.rows[0],
    });
  } catch (error) {
    console.error("Storage error:", error.message);

    res.status(500).json({
      service: "storage",
      error: "Storage service error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Storage service running on port ${PORT}`);
});
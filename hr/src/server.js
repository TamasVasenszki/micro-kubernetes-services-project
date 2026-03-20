const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3002;

const AUTH_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3000/validate";

app.get("/employees", async (req, res) => {
  try {
    const authResponse = await axios.get(AUTH_URL);

    res.json({
      service: "hr",
      auth: authResponse.data,
      employees: ["John Doe", "Jane Doe"],
    });
  } catch (error) {
    res.status(500).json({
      service: "hr",
      error: "Auth service not reachable",
    });
  }
});

app.listen(PORT, () => {
  console.log(`HR service running on port ${PORT}`);
});
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3001;

// később ezt env varból vesszük!
const AUTH_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3000/validate";

app.get("/files", async (req, res) => {
  try {
    const authResponse = await axios.get(AUTH_URL);

    res.json({
      service: "storage",
      auth: authResponse.data,
      data: ["file1", "file2"],
    });
  } catch (error) {
    res.status(500).json({
      service: "storage",
      error: "Auth service not reachable",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Storage service running on port ${PORT}`);
});
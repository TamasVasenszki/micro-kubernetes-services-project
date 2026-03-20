const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/validate", (req, res) => {
  res.json({
    service: "auth",
    authorized: true,
  });
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
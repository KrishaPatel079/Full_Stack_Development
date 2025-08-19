const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// /home route
app.get("/home", (req, res) => {
  res.send("Welcome to a New Team Dashboard!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

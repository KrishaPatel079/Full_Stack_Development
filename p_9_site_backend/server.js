const express = require("express");
const appConfig = require("./src/config/appConfig");
const routes = require("./src/routes");

const app = express();

// Middleware (future use)
app.use(express.json());

// Routes
app.use("/", routes);

// Start server
app.listen(appConfig.PORT, () => {
  console.log(`Server running at http://localhost:${appConfig.PORT}`);
});

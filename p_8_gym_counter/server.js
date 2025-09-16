const express = require('express');
const path = require('path');
const app = express();
const PORT = 3004;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http: localhost:${PORT}`);
});

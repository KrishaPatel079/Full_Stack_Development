const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3006;

// Path to your log file
const LOG_FILE_PATH = path.join(__dirname, 'error.log');

// Serve static files (CSS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Route to view logs
app.get('/', (req, res) => {
    fs.readFile(LOG_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send(`
                <html>
                <head>
                    <title>Log Viewer</title>
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                </head>
                <body class="bg-red-100 flex items-center justify-center min-h-screen">
                    <div class="bg-white shadow-lg rounded-lg p-6 max-w-lg text-center">
                        <h1 class="text-2xl font-bold text-red-600">Error Loading Log File</h1>
                        <p class="mt-4 text-gray-600">The log file could not be accessed. Please check if it exists and permissions are correct.</p>
                    </div>
                </body>
                </html>
            `);
        }

        res.send(`
            <html>
            <head>
                <title>Log Viewer</title>
                <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            </head>
            <body class="bg-red-100 min-h-screen p-6">
                <div class="max-w-4xl mx-auto bg-red-300 shadow-lg rounded-lg p-6">
                    <h1 class="text-3xl font-bold text-gray-800 mb-4">ⓘ Error Log Viewer</h1>
                    <pre class="bg-gray-800 text-red-600 p-4 rounded overflow-x-auto whitespace-pre-wrap">${data.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
                </div>
            </body>
            </html>
        `);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

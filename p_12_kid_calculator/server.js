const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve HTML with AJAX
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>📅 Kids Calculator</title>
        <style>
          body {
            font-family: Comic Sans MS, Arial, sans-serif;
            text-align: center;
            background: linear-gradient(135deg, #ffecd2, #fcb69f);
            margin: 0;
            padding: 0;
          }
          h1 {
            color: #ff4081;
            margin-top: 30px;
            text-shadow: 2px 2px #fff;
          }
          form {
            background: #ffffffcc;
            padding: 30px;
            border-radius: 25px;
            display: inline-block;
            margin-top: 30px;
            box-shadow: 0px 8px 20px rgba(0,0,0,0.2);
          }
          input {
            margin: 10px;
            padding: 15px;
            border-radius: 15px;
            border: 2px solid #ff9800;
            font-size: 18px;
            width: 200px;
            text-align: center;
          }
          select {
            margin: 15px;
            padding: 15px;
            border-radius: 15px;
            border: 2px solid #4caf50;
            font-size: 18px;
            background: #c8e6c9;
          }
          button {
            margin-top: 20px;
            padding: 15px 25px;
            border: none;
            border-radius: 25px;
            font-size: 20px;
            background: linear-gradient(45deg, #ff5722, #ff9800);
            color: white;
            cursor: pointer;
            transition: transform 0.2s;
          }
          button:hover {
            transform: scale(1.1);
          }
          .result {
            margin-top: 20px;
            font-size: 24px;
            font-weight: bold;
            color: #3f51b5;
          }
          .error {
            margin-top: 20px;
            font-size: 20px;
            font-weight: bold;
            color: red;
          }
        </style>
      </head>
      <body>
        <h1>📱 Kids Calculator 📱</h1>
        <form id="calcForm">
          <input type="text" id="num1" name="num1" placeholder="🔢 First Number" required>
          <input type="text" id="num2" name="num2" placeholder="🔢 Second Number" required>
          <br>
          <select id="operation" name="operation">
            <option value="add">➕ Add</option>
            <option value="subtract">➖ Subtract</option>
            <option value="multiply">✖️ Multiply</option>
            <option value="divide">➗ Divide</option>
          </select>
          <br>
          <button type="submit">🟰 Calculate</button>
        </form>
        <div id="output"></div>

        <script>
          document.getElementById("calcForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const num1 = document.getElementById("num1").value;
            const num2 = document.getElementById("num2").value;
            const operation = document.getElementById("operation").value;

            const response = await fetch("/calculate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ num1, num2, operation })
            });

            const data = await response.json();
            const output = document.getElementById("output");

            if (data.error) {
              output.innerHTML = "<p class='error'>❌ " + data.error + "</p>";
            } else {
              output.innerHTML = "<p class='result'>✅ Answer: " + data.result + "</p>";
            }
          });
        </script>
      </body>
    </html>
  `);
});

// Handle calculations (API endpoint)
app.post("/calculate", (req, res) => {
  const num1 = parseFloat(req.body.num1);
  const num2 = parseFloat(req.body.num2);
  const operation = req.body.operation;

  if (isNaN(num1) || isNaN(num2)) {
    return res.json({ error: "Please enter valid numbers!" });
  }

  let result;
  switch (operation) {
    case "add":
      result = num1 + num2;
      break;
    case "subtract":
      result = num1 - num2;
      break;
    case "multiply":
      result = num1 * num2;
      break;
    case "divide":
      if (num2 === 0) {
        return res.json({ error: "Cannot divide by zero!" });
      }
      result = num1 / num2;
      break;
    default:
      return res.json({ error: "Invalid operation!" });
  }

  res.json({ result });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Kids Calculator running at http://localhost:${PORT}`);
});

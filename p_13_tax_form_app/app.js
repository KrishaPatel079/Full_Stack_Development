const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// GET route to show form
app.get("/", (req, res) => {
  res.render("form", { error: null });
});

// POST route to calculate income
app.post("/calculate", (req, res) => {
  const { income1, income2 } = req.body;

  // Validation
  if (!income1 || !income2 || isNaN(income1) || isNaN(income2)) {
    return res.render("form", { error: "❌ Please enter valid numbers for both incomes." });
  }

  const totalIncome = parseFloat(income1) + parseFloat(income2);

  res.render("result", { income1, income2, totalIncome });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

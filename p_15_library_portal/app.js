const express = require("express");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(
  session({
    secret: "library_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");

// Make session user available in all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Login" });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  req.session.user = {
    name: username,
    loginTime: new Date().toLocaleString(),
  };
  res.redirect("/profile");
});

app.get("/profile", (req, res) => {
  if (!req.session.user) return res.redirect("/");
  res.render("profile", { title: "Profile" });
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

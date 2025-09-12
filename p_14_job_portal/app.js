const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
app.set("view engine", "ejs");

// Storage configuration (optional: keep original file name)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique name
  },
});

// File filter (allow only PDFs)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("❌ Only PDF files are allowed!"), false);
  }
};

// Multer upload settings (max file size = 2MB)
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: fileFilter,
}).single("resume");

// Routes
app.get("/", (req, res) => {
  res.render("form", { message: null });
});

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.render("form", { message: err.message });
    }
    if (!req.file) {
      return res.render("form", { message: "❌ Please upload a PDF file." });
    }
    res.render("result", { filename: req.file.filename });
  });
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});

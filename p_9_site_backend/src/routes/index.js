const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

// Home Route
router.get("/", homeController.getHome);

module.exports = router;

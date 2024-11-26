const express = require("express");

// controller functions
const { saveScore } = require("../controllers/countryController");

const router = express.Router();

// save score route
router.post("/save_score", saveScore);

module.exports = router;

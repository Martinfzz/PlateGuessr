const express = require("express");

// controller functions
const { saveScore, countryInfos } = require("../controllers/countryController");

const router = express.Router();

// save score route
router.post("/save_score", saveScore);

// get country infos route
router.get("/:id", countryInfos);

module.exports = router;

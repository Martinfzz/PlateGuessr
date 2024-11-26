const express = require("express");

// controller functions
const { countryGameModeUserScore } = require("../controllers/scoreController");

const router = express.Router();

// get user score for a country game mode route
router.get("/country/game_mode/user", countryGameModeUserScore);

module.exports = router;

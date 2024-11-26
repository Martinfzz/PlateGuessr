const User = require("../models/userModel");
const Country = require("../models/countryModel");
const jwt = require("jsonwebtoken");

const decodeToken = (token) => {
  return jwt.verify(token, process.env.SECRET);
};

const countryGameModeUserScore = async (req, res) => {
  try {
    const { token, countryId, gameModeId } = req.query;

    const userId = decodeToken(token);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const country = await Country.findOne({ country_id: countryId });

    const userCountry = await user.country.get(country._id);
    if (!userCountry) {
      return res.status(200).json({ best_score: 0 });
    }

    const bestScore = userCountry.scores.get(gameModeId).best_score;

    return res.status(201).json({ best_score: bestScore });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

module.exports = {
  countryGameModeUserScore,
};

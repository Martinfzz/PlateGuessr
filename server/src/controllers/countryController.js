const User = require("../models/userModel");
const Country = require("../models/countryModel");
const jwt = require("jsonwebtoken");

const decodeToken = (token) => {
  return jwt.verify(token, process.env.SECRET);
};

const saveScore = async (req, res) => {
  try {
    const { token, countryId, gameModeId, score } = req.query;

    const userId = decodeToken(token);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let country = await Country.findOne({ country_id: countryId });
    if (!country) {
      country = await Country.createCountry(countryId);
    }

    await User.saveScore(
      user,
      countryId,
      country._id,
      gameModeId,
      Number(score)
    );
    await Country.saveScore(user, country, gameModeId, Number(score));

    return res.status(201).json({ message: "Successfully saved", score });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

const countryInfos = async (req, res) => {
  try {
    const { id } = req.params;

    const country = await Country.findOne({ country_id: id });
    if (!country) {
      return res.status(404).json({ error: true });
    } else {
      return res.status(200).json({ data: country.toJSON() });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error" });
  }
};

module.exports = {
  saveScore,
  countryInfos,
};

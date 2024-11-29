const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const topScoreSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const gameModeSchema = new Schema(
  {
    game_mode_id: {
      type: String,
      required: true,
    },
    top_scores: {
      type: [topScoreSchema],
      default: [],
    },
    games_played: {
      type: Number,
      required: true,
      default: 0,
    },
    average_score: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false }
);

const countrySchema = new Schema({
  country_id: {
    type: Number,
    required: true,
    unique: true,
  },
  game_modes: {
    type: [gameModeSchema],
    default: [],
  },
  games_played: {
    type: Number,
    required: true,
    default: 0,
  },
  average_score: {
    type: Number,
    required: true,
    default: 0,
  },
});

// static create method
countrySchema.statics.createCountry = async function (countryId) {
  const country = await this.create({ country_id: countryId });

  return country;
};

const updateTopScores = async (user, gameMode, score) => {
  let topScores = gameMode.top_scores;
  let newScore = { user_id: user._id, username: user.username, score };

  const userExistsInTopScoreIndex = topScores.findIndex(
    (e) => e.user_id === user._id.toString()
  );

  if (userExistsInTopScoreIndex !== -1) {
    if (topScores[userExistsInTopScoreIndex].score < score) {
      topScores[userExistsInTopScoreIndex].score = score;
    }
  } else {
    if (topScores.length < 25) {
      topScores.push(newScore);
    } else {
      topScores.sort((a, b) => b.score - a.score);

      if (score > topScores[topScores.length - 1].score) {
        topScores[topScores.length - 1] = newScore;
      }
    }
  }

  topScores.sort((a, b) => b.score - a.score);

  return topScores;
};

// static save score method
countrySchema.statics.saveScore = async function (
  user,
  country,
  gameModeId,
  score
) {
  const gameMode = country.game_modes?.find(
    (e) => e.game_mode_id === gameModeId
  );
  let gamesPlayed = 1;
  let averageScore = score;
  let topScores = [{ user_id: user._id, username: user.username, score }];

  if (gameMode) {
    gamesPlayed = gameMode.games_played + 1;
    averageScore =
      (gameMode.average_score * gameMode.games_played + score) / gamesPlayed;
    topScores = await updateTopScores(user, gameMode, score);
  }

  const newGameMode = {
    game_mode_id: gameModeId,
    top_scores: topScores,
    games_played: gamesPlayed,
    average_score: averageScore,
  };

  country.average_score =
    (country.average_score * country.games_played + score) /
    (country.games_played + 1);
  country.games_played = country.games_played + 1;
  country.game_modes.set(gameModeId, newGameMode);
  country = await country.save();

  return country;
};

module.exports = mongoose.model("Country", countrySchema);

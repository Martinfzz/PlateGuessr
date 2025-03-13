const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcrypt");
const Country = require("../../models/countryModel");
const User = require("../../models/userModel");
const { Schema } = mongoose;

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
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const gameModeSchema = new Schema({
  game_mode_id: {
    type: String,
    required: true,
  },
  top_scores: [topScoreSchema],
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

const GameMode = mongoose.model("GameMode", gameModeSchema);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Country.deleteMany({});
  await GameMode.deleteMany({});
});

describe("Country Model Test", () => {
  describe("createCountry", () => {
    test("should create a new country", async () => {
      const countryId = 1;

      const country = await Country.createCountry(countryId);

      expect(country).toBeDefined();
      expect(country.country_id).toBe(1);
    });
  });

  describe("saveScore", () => {
    let countryId;
    let gameModeId;
    let country;
    let user;

    beforeEach(async () => {
      countryId = 1;
      gameModeId = "gameModeId";

      country = await Country.createCountry(countryId);
      user = new User({
        email: "test@example.com",
        password: await bcrypt.hash("password", 10),
        username: "testuser",
        country: new Map(),
      });
      await user.save();
    });

    afterEach(async () => {
      await User.deleteMany({});
    });

    test("should save a new score", async () => {
      const savedScore = await Country.saveScore(
        user,
        country,
        gameModeId,
        200
      );

      expect(savedScore.game_modes.get(gameModeId).games_played).toBe(1);
      expect(savedScore.game_modes.get(gameModeId).top_scores).toHaveLength(1);
      expect(savedScore.game_modes.get(gameModeId).average_score).toBe(200);
      expect(savedScore.games_played).toBe(1);
      expect(savedScore.average_score).toBe(200);

      const savedScore2 = await Country.saveScore(
        user,
        country,
        gameModeId,
        100
      );

      expect(savedScore2).toBeDefined();
      expect(savedScore2.game_modes.get(gameModeId)).toBeDefined();
      expect(savedScore2.game_modes.get(gameModeId).game_mode_id).toBe(
        gameModeId
      );
      expect(savedScore2.game_modes.get(gameModeId).games_played).toBe(2);
      expect(savedScore2.game_modes.get(gameModeId).top_scores).toHaveLength(1);
      expect(savedScore2.game_modes.get(gameModeId).top_scores[0].score).toBe(
        200
      );
      expect(savedScore2.game_modes.get(gameModeId).average_score).toBe(150);

      expect(savedScore2.games_played).toBe(2);
      expect(savedScore2.average_score).toBe(150);

      const savedScore3 = await Country.saveScore(
        user,
        country,
        gameModeId,
        300
      );

      expect(savedScore3.game_modes.get(gameModeId).top_scores[0].score).toBe(
        300
      );
    });

    test("top_scores should contain two scores", async () => {
      const user2 = new User({
        email: "test2@example.com",
        password: await bcrypt.hash("password", 10),
        username: "testuser2",
        country: new Map(),
      });
      await user2.save();

      await Country.saveScore(user, country, gameModeId, 200);
      await Country.saveScore(user2, country, gameModeId, 100);

      expect(country.game_modes.get(gameModeId).top_scores).toHaveLength(2);
    });

    test("should not save a score if it is lower than the lowest score", async () => {
      for (let i = 0; i < 30; i++) {
        const user = new User({
          email: `test${i}@example.com`,
          password: await bcrypt.hash("password", 10),
          username: `testuser${i}`,
          country: new Map(),
        });
        await user.save();
        await Country.saveScore(user, country, gameModeId, i);
      }

      const savedScore = await Country.saveScore(user, country, gameModeId, 50);

      expect(savedScore.game_modes.get(gameModeId).top_scores).toHaveLength(25);
      expect(savedScore.game_modes.get(gameModeId).top_scores[0].score).toBe(
        50
      );
      expect(
        savedScore.game_modes.get(gameModeId).top_scores.at(-1).score
      ).toBe(6);
    });
  });
});

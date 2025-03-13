const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const countryController = require("../../controllers/countryController");
const User = require("../../models/userModel");
const Country = require("../../models/countryModel");

const app = express();
app.use(express.json());
app.get("/saveScore", countryController.saveScore);
app.get("/countryInfos/:id", countryController.countryInfos);

jest.mock("../../models/userModel");
jest.mock("../../models/countryModel");
jest.mock("jsonwebtoken");

describe("Country Controller", () => {
  describe("saveScore", () => {
    it("should return 404 if user is not found", async () => {
      jwt.verify.mockReturnValue("userId");
      User.findById.mockResolvedValue(null);

      const response = await request(app).get("/saveScore").query({
        token: "token",
        countryId: "countryId",
        gameModeId: "gameModeId",
        score: 100,
      });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found");
    });

    it("should return 201 if score is saved successfully", async () => {
      jwt.verify.mockReturnValue("userId");
      const user = { _id: "userId" };
      User.findById.mockResolvedValue(user);
      Country.findOne.mockResolvedValue({ _id: "countryId" });
      User.saveScore.mockResolvedValue();
      Country.saveScore.mockResolvedValue();

      const response = await request(app).get("/saveScore").query({
        token: "token",
        countryId: "countryId",
        gameModeId: "gameModeId",
        score: 100,
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Successfully saved");
      expect(response.body.score).toBe("100");
    });

    it("should create a new country if it does not exist", async () => {
      jwt.verify.mockReturnValue("userId");
      const user = { _id: "userId" };
      User.findById.mockResolvedValue(user);
      Country.findOne.mockResolvedValue(null);
      Country.createCountry.mockResolvedValue({ _id: "countryId" });
      User.saveScore.mockResolvedValue();
      Country.saveScore.mockResolvedValue();

      const response = await request(app).get("/saveScore").query({
        token: "token",
        countryId: "countryId",
        gameModeId: "gameModeId",
        score: 100,
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Successfully saved");
      expect(response.body.score).toBe("100");
    });

    it("should return 500 if there is an internal error", async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error("Internal error");
      });

      const response = await request(app).get("/saveScore").query({
        token: "token",
        countryId: "countryId",
        gameModeId: "gameModeId",
        score: 100,
      });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Internal error");
    });
  });

  describe("countryInfos", () => {
    it("should return 404 if country is not found", async () => {
      Country.findOne.mockResolvedValue(null);

      const response = await request(app).get("/countryInfos/countryId");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe(true);
    });

    it("should return 200 if country is found", async () => {
      const country = {
        country_id: "countryId",
        toJSON: () => ({ id: "countryId" }),
      };
      Country.findOne.mockResolvedValue(country);

      const response = await request(app).get("/countryInfos/countryId");

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe("countryId");
    });

    it("should return 500 if there is an internal error", async () => {
      Country.findOne.mockImplementation(() => {
        throw new Error("Internal error");
      });

      const response = await request(app).get("/countryInfos/countryId");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Internal error");
    });
  });
});

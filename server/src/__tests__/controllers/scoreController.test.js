const {
  countryGameModeUserScore,
} = require("../../controllers/scoreController");
const User = require("../../models/userModel");
const Country = require("../../models/countryModel");
const jwt = require("jsonwebtoken");

jest.mock("../../models/userModel");
jest.mock("../../models/countryModel");
jest.mock("jsonwebtoken");

describe("countryGameModeUserScore", () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {
        token: "testToken",
        countryId: "testCountryId",
        gameModeId: "testGameModeId",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return 404 if user is not found", async () => {
    jwt.verify.mockReturnValue("testUserId");
    User.findById.mockResolvedValue(null);

    await countryGameModeUserScore(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  test("should return 200 with best_score 0 if userCountry is not found", async () => {
    jwt.verify.mockReturnValue("testUserId");
    User.findById.mockResolvedValue({
      country: { get: jest.fn().mockResolvedValue(null) },
    });
    Country.findOne.mockResolvedValue({ _id: "testCountryObjectId" });

    await countryGameModeUserScore(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ best_score: 0 });
  });

  test("should return 201 with best_score if userCountry is found", async () => {
    jwt.verify.mockReturnValue("testUserId");
    User.findById.mockResolvedValue({
      country: {
        get: jest.fn().mockResolvedValue({
          scores: { get: jest.fn().mockReturnValue({ best_score: 100 }) },
        }),
      },
    });
    Country.findOne.mockResolvedValue({ _id: "testCountryObjectId" });

    await countryGameModeUserScore(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ best_score: 100 });
  });

  test("should return 500 if there is an internal error", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Internal error");
    });

    await countryGameModeUserScore(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal error" });
  });
});

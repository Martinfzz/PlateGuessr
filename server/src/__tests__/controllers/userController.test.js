const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const {
  signupUser,
  loginUser,
  updateUser,
  deleteUser,
  userCountryScore,
  getUser,
} = require("../../controllers/userController");
const User = require("../../models/userModel");
const Country = require("../../models/countryModel");
const jwt = require("jsonwebtoken");

jest.mock("../../models/userModel");
jest.mock("jsonwebtoken");

const app = express();
app.use(express.json());
app.post("/login", loginUser);
app.post("/signup", signupUser);
app.put("/update/:id", updateUser);
app.delete("/delete/:id", deleteUser);
app.get("/country/:id", userCountryScore);
app.get("/:id", getUser);

describe("User Controller Tests", () => {
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    test("should return 400 if email is not provided", async () => {
      const response = await request(app).post("/login").send({
        email: "",
        password: "Password123*",
      });

      expect(response.status).toBe(400);
    });

    test("should return 400 if password is not provided", async () => {
      const response = await request(app).post("/login").send({
        email: "test@example.com",
        password: "",
      });

      expect(response.status).toBe(400);
    });

    test("should return 200 if user is logged in", async () => {
      const mockUser = {
        _id: "testUserId",
        email: "test@example.com",
        username: "testuser",
      };

      User.login.mockResolvedValue(mockUser);

      const response = await request(app).post("/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        email: "test@example.com",
        token: undefined,
        username: "testuser",
        id: "testUserId",
      });
    });
  });

  describe("signup", () => {
    test("should signup user and return token", async () => {
      const mockUser = {
        _id: "testUserId",
        email: "test@example.com",
        username: "testuser",
        password: "hashedpassword",
      };

      User.signup.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue("testToken");

      const response = await request(app).post("/signup").send({
        email: "test@example.com",
        password: "password123",
        passwordConfirmation: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        email: "test@example.com",
        token: "testToken",
        username: "testuser",
        id: "testUserId",
      });
      expect(User.signup).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
        "password123"
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { _id: "testUserId" },
        process.env.SECRET,
        { expiresIn: "3d" }
      );
    });

    test("should return 400 if signup fails", async () => {
      User.signup.mockImplementation(() => {
        throw new Error("Signup failed");
      });

      const response = await request(app).post("/signup").send({
        email: "test@example.com",
        password: "password123",
        passwordConfirmation: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Signup failed" });
    });
  });

  describe("update", () => {
    test("should return 400 if oldUsername is not provided", async () => {
      const response = await request(app).put("/update/testId").send({
        oldUsername: "",
        newUsername: "newusername",
        currentPassword: "password123",
        password: "password123",
      });

      expect(response.status).toBe(400);
    });

    test("should update user and return updated user", async () => {
      const mockUser = {
        _id: "testUserId",
        email: "test@example.com",
        username: "newusername",
      };

      User.update.mockResolvedValue(mockUser);
      jwt.verify.mockReturnValue({ _id: "testUserId" });

      const response = await request(app).put("/update/testId").send({
        oldUsername: "oldusername",
        newUsername: "newusername",
        currentPassword: "password123",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        email: "test@example.com",
        token: "testToken",
        username: "newusername",
      });
      expect(User.update).toHaveBeenCalledWith(
        "testUserId",
        "newusername",
        "password123",
        "password123"
      );
    });

    test("should update user username in all countries", async () => {
      const mockUser = {
        _id: "testUserId",
        email: "test@example.com",
        username: "newusername",
      };

      User.update.mockResolvedValue(mockUser);
      jwt.verify.mockReturnValue({ _id: "testUserId" });

      new Country({
        country_id: 1,
        name: "Test Country",
        games_played: 0,
        average_score: 0,
        game_modes: {
          1: {
            game_mode_id: 1,
            top_scores: [
              { user_id: "testUserId", username: "oldusername", score: 100 },
            ],
          },
        },
      }).save();

      const response = await request(app).put("/update/testId").send({
        oldUsername: "oldusername",
        newUsername: "newusername",
        currentPassword: "password123",
        password: "password123",
      });

      const country = await Country.findOne({ country_id: 1 });

      expect(response.status).toBe(200);
      expect(country.game_modes.get("1").top_scores[0].username).toBe(
        "newusername"
      );
    });

    test("should return 400 if update fails", async () => {
      User.update.mockImplementation(() => {
        throw new Error("Update failed");
      });

      const response = await request(app).put("/update/testId").send({
        oldUsername: "oldusername",
        newUsername: "newusername",
        currentPassword: "password123",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Update failed" });
    });
  });

  describe("delete", () => {
    test("should return 400 if id is not provided", async () => {
      const response = await request(app).delete("/delete/");

      expect(response.status).toBe(404);
    });

    test("should delete user and return success message", async () => {
      const response = await request(app).delete("/delete/testId");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
    });

    test("should update deleted user in all countries", async () => {
      const response = await request(app).delete("/delete/testId");

      const country = await Country.findOne({ country_id: 1 });

      expect(response.status).toBe(200);
      expect(country.game_modes.get("1").top_scores[0].deleted).toBe(true);
    });

    test("should return 400 if delete fails", async () => {
      User.delete.mockImplementation(() => {
        throw new Error("Delete failed");
      });

      const response = await request(app).delete("/delete/testId");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Delete failed" });
    });
  });

  describe("user country score", () => {
    test("should return 404 if user is not found", async () => {
      jwt.verify.mockReturnValue("testUserId");
      User.findById.mockResolvedValue(null);

      const response = await request(app).get("/country/testId");

      expect(response.status).toBe(400);
    });

    test("should return 200 with the country data", async () => {
      jwt.verify.mockReturnValue("testUserId");
      User.findById.mockResolvedValue({
        country: { get: jest.fn().mockResolvedValue({}) },
      });

      const response = await request(app).get("/country/testId");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: {}, success: true });
    });
  });

  describe("get user", () => {
    test("should return 400 if id is not provided", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(404);
    });

    test("should return 200 with user data", async () => {
      const mockUser = {
        _id: "testUserId",
        email: "test@example.com",
        username: "testuser",
      };

      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const response = await request(app).get("/testUserId");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: {
          _id: "testUserId",
          email: "test@example.com",
          username: "testuser",
        },
        success: true,
      });
    });

    test("should return 400 if user is not found", async () => {
      User.findById.mockReturnValue(null);

      const response = await request(app).get("/testUserId");

      expect(response.status).toBe(400);
    });
  });
});

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
  verifyEmail,
  resendVerificationEmail,
  resetPassword,
  setPassword,
  googleAuth,
} = require("../../controllers/userController");
const User = require("../../models/userModel");
const Country = require("../../models/countryModel");
const jwt = require("jsonwebtoken");
const { sendVerificationMail } = require("../../utils/sendVerificationMail");
const { sendResetPasswordMail } = require("../../utils/sendResetPasswordMail");

jest.mock("../../models/userModel");
jest.mock("jsonwebtoken");
jest.mock("../../utils/sendVerificationMail");
jest.mock("../../utils/sendResetPasswordMail");
jest.mock("google-auth-library", () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => {
      return {
        getToken: jest
          .fn()
          .mockResolvedValue({ tokens: { id_token: "mock_id_token" } }),
        verifyIdToken: jest.fn().mockResolvedValue({
          getPayload: jest.fn().mockReturnValue({
            email: "test@example.com",
            given_name: "John",
            family_name: "Doe",
          }),
        }),
      };
    }),
  };
});

const app = express();
app.use(express.json());
app.post("/login", loginUser);
app.post("/signup", signupUser);
app.put("/update/:id", updateUser);
app.delete("/delete/:id", deleteUser);
app.get("/country/:id", userCountryScore);
app.get("/:id", getUser);
app.post("/verify-email", verifyEmail);
app.post("/resend-verification-email", resendVerificationEmail);
app.post("/reset-password", resetPassword);
app.post("/set-password", setPassword);
app.post("/auth/google", googleAuth);

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
        isVerified: false,
        authSource: "self",
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
        isVerified: false,
        authSource: "self",
      });
    });
  });

  describe("signup", () => {
    const mockUser = {
      _id: "testUserId",
      email: "test@example.com",
      username: "testuser",
      password: "hashedpassword",
    };

    test("should signup user and return token", async () => {
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
      expect(sendVerificationMail).not.toHaveBeenCalled();
    });

    test("should send verification email", async () => {
      User.signup.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue("testToken");

      await request(app).post("/signup").send({
        email: "test@example.com",
        password: "password123",
        passwordConfirmation: "password123",
      });

      expect(sendVerificationMail).toHaveBeenCalledWith(mockUser);
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
        isVerified: false,
        authSource: "self",
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
        id: "testUserId",
        isVerified: false,
        authSource: "self",
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
    test("should return 404 if id is not provided", async () => {
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
    test("should return 400 if user is not found", async () => {
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
    test("should return 404 if id is not provided", async () => {
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

  describe("verify email", () => {
    test("should return 400 if emailToken is not provided", async () => {
      const response = await request(app).post("/verify-email").send({});

      expect(response.status).toBe(400);
    });

    test("should return 400 if email verification fails", async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app).post("/verify-email").send({
        emailToken: "testToken",
      });

      expect(response.status).toBe(400);
    });

    test("should return 200 with user data", async () => {
      const mockUser = {
        email: "test@example.com",
        username: "testuser",
        authSource: "self",
        emailToken: "testToken",
      };

      User.verifyEmail.mockResolvedValue(mockUser);

      const response = await request(app).post("/verify-email").send({
        emailToken: "testToken",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        email: "test@example.com",
        username: "testuser",
        authSource: "self",
        token: "testToken",
      });
    });
  });

  describe("resend verification email", () => {
    test("should return 400 if email is not provided", async () => {
      const response = await request(app).post("/resend-verification-email");

      expect(response.status).toBe(400);
    });

    test("should return 400 if user is not found", async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post("/resend-verification-email")
        .send({ email: "test@example.com" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "errors.user_not_found" });
    });

    test("should return 400 is user is already verified", async () => {
      const mockUser = {
        email: "test@example.com",
        isVerified: true,
      };

      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/resend-verification-email")
        .send({ email: "test@example.com" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "errors.user_already_verified" });
    });

    test("should return 200 and send verification email", async () => {
      const mockUser = {
        email: "test@example.com",
        isVerified: false,
      };

      User.findOne.mockResolvedValue(mockUser);

      await request(app)
        .post("/resend-verification-email")
        .send({ email: "test@example.com" });

      expect(sendVerificationMail).toHaveBeenCalledWith(mockUser);
    });

    test("should return 400 if email verification fails", async () => {
      User.findOne.mockImplementation(() => {
        throw new Error("Verification failed");
      });

      const response = await request(app)
        .post("/resend-verification-email")
        .send({ email: "test@example.com" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Verification failed" });
    });
  });

  describe("reset password", () => {
    test("should return 200 if user is found and send email", async () => {
      const mockUser = {
        email: "test@example.com",
      };

      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/reset-password")
        .send({ email: "test@example.com" });

      expect(sendResetPasswordMail).toHaveBeenCalledWith(mockUser, "testToken");
      expect(response.status).toBe(200);
    });

    test("should return 200 if user is not found but do not send email", async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post("/reset-password")
        .send({ email: "test@example.com" });

      expect(sendResetPasswordMail).not.toHaveBeenCalled();
      expect(response.status).toBe(200);
    });

    test("should return 400 if reset password fails", async () => {
      User.findOne.mockImplementation(() => {
        throw new Error("Reset password failed");
      });

      const response = await request(app)
        .post("/reset-password")
        .send({ email: "test@example.com" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Reset password failed" });
    });
  });

  describe("set password", () => {
    test("should return 400 if password is not provided", async () => {
      const response = await request(app).post("/set-password").send({});

      expect(response.status).toBe(400);
    });

    test("should return 400 if token is invalid", async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const response = await request(app)
        .post("/set-password")
        .send({ token: "invalidToken" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "errors.invalid_token" });
    });

    test("should return 200 if password is set", async () => {
      jwt.verify.mockReturnValue({ _id: "testUserId" });
      User.setPassword.mockResolvedValue({ email: "test@example.com" });

      const response = await request(app).post("/set-password").send({
        password: "password123",
        passwordConfirmation: "password123",
        token: "testToken",
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        email: "test@example.com",
        token: "testToken",
      });
    });
  });

  describe("google auth", () => {
    let req, res;

    beforeEach(() => {
      req = { body: { code: "mock_code" } };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    it("should authenticate a user and return a token", async () => {
      User.findOne.mockResolvedValue({
        _id: "mock_user_id",
        email: "test@example.com",
        username: "johndoe",
        authSource: "google",
        isVerified: true,
      });

      await googleAuth(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        email: "test@example.com",
        token: "testToken",
        username: "johndoe",
        id: "mock_user_id",
        authSource: "google",
        isVerified: true,
      });
    });

    it("should create a new user if not found", async () => {
      User.findOne.mockResolvedValue(null);
      User.googleAuth.mockResolvedValue({
        _id: "new_user_id",
        email: "test@example.com",
        username: "newuser",
        authSource: "google",
        isVerified: false,
      });

      await googleAuth(req, res);

      expect(User.googleAuth).toHaveBeenCalledWith(
        "test@example.com",
        "John",
        "Doe"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        email: "test@example.com",
        token: "testToken",
        username: "newuser",
        id: "new_user_id",
        authSource: "google",
        isVerified: false,
      });
    });

    it("should return an error if authentication fails", async () => {
      User.findOne.mockImplementation(() => {
        throw new Error("Authentication failed");
      });

      await googleAuth(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Authentication failed" });
    });
  });
});

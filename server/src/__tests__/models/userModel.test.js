const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const bcrypt = require("bcrypt");
const User = require("../../models/userModel");

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
  await User.deleteMany({});
});

describe("User Model Test", () => {
  describe("signup", () => {
    test("should throw an empty fields error", async () => {
      const email = "";
      const password = "";

      let err;
      try {
        await User.signup(email, password, password);
      } catch (error) {
        err = error;
      }

      expect(err).toBeDefined();
      expect(err.message).toBe("validations.all_fields_filled");
    });

    test("should throw an email format error", async () => {
      const email = "aa";
      const password = "password123";

      let err;
      try {
        await User.signup(email, password, password);
      } catch (error) {
        err = error;
      }

      expect(err).toBeDefined();
      expect(err.message).toBe("validations.invalid_email");
    });

    test("should throw an error if the password is not strong enough", async () => {
      const email = "test@example.com";
      const password = "password123";

      let err;
      try {
        await User.signup(email, password, password);
      } catch (error) {
        err = error;
      }

      expect(err).toBeDefined();
      expect(err.message).toBe("validations.not_strong_password");
    });

    test("should throw an error if the passwords doesn't match", async () => {
      const email = "test@example.com";
      const password = "Password123*";
      const passwordConfirmation = "anotherPassword123";

      let err;
      try {
        await User.signup(email, password, passwordConfirmation);
      } catch (error) {
        err = error;
      }

      expect(err).toBeDefined();
      expect(err.message).toBe("validations.password_match");
    });

    test("should fail to create a user with existing email", async () => {
      const email = "test@example.com";
      const password = "Password123*";

      await User.signup(email, password, password);

      let err;
      try {
        await User.signup(email, password, password);
      } catch (error) {
        err = error;
      }

      expect(err).toBeDefined();
      expect(err.message).toBe("validations.signup_not_allowed");
    });

    test("should create and save a user successfully", async () => {
      const email = "test@example.com";
      const password = "Password123*";

      const user = await User.signup(email, password, password);

      expect(user._id).toBeDefined();
      expect(user.email).toBe(email);
      expect(user.username).toBeDefined();
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      expect(isPasswordMatch).toBe(true);
    });
  });

  describe("login", () => {
    test("should throw an empty fields error", async () => {
      const email = "";
      const password = "";

      let err;
      try {
        await User.login(email, password);
      } catch (error) {
        err = error;
      }

      expect(err).toBeDefined();
      expect(err.message).toBe("validations.all_fields_filled");
    });

    test("should fail to login with incorrect email", async () => {
      const email = "test@example.com";
      const password = "password123";

      let err;
      try {
        await User.login(email, password);
      } catch (error) {
        err = error;
      }

      expect(err).toBeDefined();
      expect(err.message).toBe("validations.incorrect_email");
    });

    test("should fail to login with incorrect password", async () => {
      const email = "test@example.com";
      const password = "Password123*";

      await User.signup(email, password, password);

      let err;
      try {
        await User.login(email, "wrongpassword");
      } catch (error) {
        err = error;
      }

      expect(err).toBeDefined();
      expect(err.message).toBe("validations.incorrect_password");
    });

    test("should fail to login with unverified email", async () => {
      const email = "test@example.com";
      const password = "Password123*";

      const user = await User.signup(email, password, password);

      expect(user.isVerified).toBe(false);

      let err;
      try {
        await User.login(email, password);
      } catch (error) {
        err = error;
      }

      expect(err).toBeDefined();
      expect(err.message).toBe("validations.email_not_verified");
    });

    test("should login a user successfully", async () => {
      const email = "test@example.com";
      const password = "Password123*";

      let user = await User.signup(email, password, password);
      user.isVerified = true;
      await user.save();

      user = await User.login(email, password);

      expect(user).toBeDefined();
      expect(user.email).toBe(email);
    });
  });

  describe("update", () => {
    let user;
    let password;

    beforeEach(async () => {
      const email = "test@example.com";
      password = "Password123*";

      user = await User.signup(email, password, password);
    });

    test("should not fail when the username is not changed", async () => {
      const username = user.username;

      let err;
      try {
        await User.update(user._id, username, password, password);
      } catch (error) {
        err = error;
      }

      expect(err).not.toBeDefined();
      expect(user.username).toBe(username);
    });

    test("should fail to update with existing username", async () => {
      const email2 = "test2@example.com";

      const user2 = await User.signup(email2, password, password);
      const username = user2.username;

      let err;
      try {
        await User.update(user._id, username, password, password);
      } catch (error) {
        err = error;
      }

      expect(err).toBeDefined();
      expect(err.message).toBe("validations.username_taken");
    });

    test("should fail when passwords doesn't match", async () => {
      let err;
      try {
        await User.update(
          user._id,
          user.username,
          "anotherPassword123",
          "password123"
        );
      } catch (error) {
        err = error;
      }

      expect(err).toBeDefined();
      expect(err.message).toBe("validations.password_match");
    });

    test("should update user password successfully", async () => {
      const newPassword = "newPassword123*";

      const updatedUser = await User.update(
        user._id,
        user.username,
        password,
        newPassword
      );

      expect(updatedUser).toBeDefined();
    });

    test("should update user username successfully", async () => {
      const newUsername = "newUsername";

      const updatedUser = await User.update(user._id, newUsername, "", "");

      expect(updatedUser).toBeDefined();
      expect(updatedUser.username).toBe(newUsername);
    });
  });

  describe("delete", () => {
    test("should delete a user successfully", async () => {
      const email = "test@example.com";
      const password = "Password123*";

      const user = await User.signup(email, password, password);

      await User.delete(user._id);

      const deletedUser = await User.findById(user._id);

      expect(deletedUser).toBeNull();
    });
  });

  describe("save score", () => {
    test("should save score successfully", async () => {
      const user = new User({
        email: "test@example.com",
        password: await bcrypt.hash("password", 10),
        username: "testuser",
        country: new Map(),
      });
      await user.save();

      const updatedUser = await User.saveScore(
        user,
        "testCountryId",
        "testCountryUuid",
        "testGameModeId",
        100
      );

      const country = updatedUser.country.get("testCountryUuid");
      const gameModeScore = country.scores.get("testGameModeId");

      expect(gameModeScore.best_score).toBe(100);
      expect(gameModeScore.games_played).toBe(1);
      expect(gameModeScore.average_score).toBe(100);
    });

    test("should update score successfully", async () => {
      const user = new User({
        email: "test@example.com",
        password: await bcrypt.hash("password", 10),
        username: "testuser",
        country: new Map(),
      });
      await user.save();

      await User.saveScore(
        user,
        "testCountryId",
        "testCountryUuid",
        "testGameModeId",
        100
      );
      const updatedUser = await User.saveScore(
        user,
        "testCountryId",
        "testCountryUuid",
        "testGameModeId",
        200
      );

      const country = updatedUser.country.get("testCountryUuid");
      const gameModeScore = country.scores.get("testGameModeId");

      expect(gameModeScore.best_score).toBe(200);
      expect(gameModeScore.games_played).toBe(2);
      expect(gameModeScore.average_score).toBe(150);
    });
  });

  describe("verify email", () => {
    test("should verify email successfully", async () => {
      const email = "test@example.com";
      const user = await User.signup(email, "Password123*", "Password123*");

      const updatedUser = await User.verifyEmail(user.emailToken);

      expect(updatedUser).toBeDefined();
      expect(updatedUser.isVerified).toBe(true);
      expect(updatedUser.emailToken).toBeNull();
    });

    test("should fail when email user is not found", async () => {
      let err;
      try {
        await User.verifyEmail("invalidToken");
      } catch (error) {
        err = error;
      }

      expect(err).toBeDefined();
      expect(err.message).toBe("errors.user_not_found");
    });

    test("should fail when email token is not found", async () => {
      let err;
      try {
        await User.verifyEmail();
      } catch (error) {
        err = error;
      }

      expect(err).toBeDefined();
      expect(err.message).toBe("errors.email_token_not_found");
    });
  });

  describe("set password", () => {
    let user;
    let password;

    beforeEach(async () => {
      const email = "test@example.com";
      password = "Password123*";

      user = await User.signup(email, password, password);
    });

    test("should set password successfully", async () => {
      const newPassword = "newPassword123*";

      const updatedUser = await User.setPassword(
        user._id,
        newPassword,
        newPassword
      );

      expect(updatedUser).toBeDefined();
      expect(updatedUser.isVerified).toBe(true);
      expect(updatedUser.emailToken).toBeNull();
    });

    test("should fail when passwords doesn't match", async () => {
      let err;
      try {
        await User.setPassword(user._id, "anotherPassword123", "password123");
      } catch (error) {
        err = error;
      }

      expect(err).toBeDefined();
      expect(err.message).toBe("validations.password_match");
    });

    test("should fail when user is not found", async () => {
      let err;
      try {
        await User.setPassword(
          new mongoose.Types.ObjectId(),
          password,
          password
        );
      } catch (error) {
        err = error;
      }

      expect(err).toBeDefined();
      expect(err.message).toBe("errors.user_not_found");
    });
  });

  describe("google auth", () => {
    const email = "test@example.com";
    const given_name = "test";
    const family_name = "user";

    test("should throw an error if the email exists", async () => {
      await User.signup(email, "Password123*", "Password123*");

      let err;
      try {
        await User.googleAuth(email, given_name, family_name);
      } catch (error) {
        err = error;
      }

      expect(err).toBeDefined();
      expect(err.message).toBe("validations.signup_not_allowed");
    });

    test("should create a user successfully", async () => {
      const user = await User.googleAuth(email, given_name, family_name);

      expect(user).toBeDefined();
      expect(user.email).toBe(email);
      expect(user.username).toBe(`${given_name} ${family_name}`);
      expect(user.authSource).toBe("google");
      expect(user.isVerified).toBe(true);
    });
  });
});

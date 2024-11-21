const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { faker } = require("@faker-js/faker");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
  },
});

// static signup method
userSchema.statics.signup = async function (
  email,
  password,
  passwordConfirmation
) {
  // validation
  if (!email || !password || !passwordConfirmation) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }
  if (password !== passwordConfirmation) {
    throw Error("Passwords doesn't match");
  }

  const emailExists = await this.findOne({ email });

  if (emailExists) {
    throw Error("Sign up not allowed");
  }

  let username = "";

  do {
    username = faker.internet.username();
  } while (!this.findOne({ username }));

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash, username });

  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

// static update method
userSchema.statics.update = async function (
  _id,
  username,
  currentPassword,
  password
) {
  let user = await this.findOne({ _id });
  const usernameExist = await this.findOne({ username });

  if (
    usernameExist &&
    JSON.stringify(usernameExist._id) !== JSON.stringify(user._id)
  ) {
    throw Error("Username already taken");
  }

  if (currentPassword && password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    if (!bcrypt.compareSync(currentPassword, user.password)) {
      throw Error("Passwords doesn't match");
    }
    user = await this.findOneAndUpdate({ _id }, { password: hash, username });
  } else {
    user = await this.findOneAndUpdate({ _id }, { username });
  }

  user = await this.findOne({ _id });
  return user;
};

// static delete method
userSchema.statics.delete = async function (_id) {
  const user = await this.findOneAndDelete({ _id });

  return user;
};

module.exports = mongoose.model("User", userSchema);

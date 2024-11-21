const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const decodeToken = (token) => {
  return jwt.verify(token, process.env.SECRET);
};

// login a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token, username: user.username });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup a user
const signupUser = async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  try {
    const user = await User.signup(email, password, passwordConfirmation);

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ email, token, username: user.username });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update a user
const updateUser = async (req, res) => {
  const { username, currentPassword, password } = req.body;
  const { id } = req.params;

  const decodedToken = decodeToken(id);

  try {
    const user = await User.update(
      decodedToken._id,
      username,
      currentPassword,
      password
    );

    // create a token
    const token = createToken(user._id);

    res.status(200).json({ email: user.email, token, username: user.username });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  const decodedToken = decodeToken(id);

  try {
    await User.delete(decodedToken._id);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser, updateUser, deleteUser };

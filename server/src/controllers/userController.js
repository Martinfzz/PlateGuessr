const User = require("../models/userModel");
const Country = require("../models/countryModel");
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

    res
      .status(200)
      .json({ email, token, username: user.username, id: user._id });
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

    res
      .status(200)
      .json({ email, token, username: user.username, id: user._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update a user
const updateUser = async (req, res) => {
  const { oldUsername, newUsername, currentPassword, password } = req.body;
  const { id } = req.params;

  const decodedToken = decodeToken(id);

  try {
    const user = await User.update(
      decodedToken._id,
      newUsername,
      currentPassword,
      password
    );

    // Update the new username in all of the countries' top scores
    for (let i = 1; i <= 5; i++) {
      await Country.updateMany(
        {
          [`game_modes.${i}.top_scores.username`]: oldUsername,
        },
        {
          $set: {
            [`game_modes.${i}.top_scores.$[elem].username`]: newUsername,
          },
        },
        {
          arrayFilters: [
            {
              "elem.username": oldUsername,
            },
          ],
        }
      );
    }

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

  const user_id = decodeToken(id);

  try {
    // Update the deleted user in all of the countries
    for (let i = 1; i <= 5; i++) {
      await Country.updateMany(
        {
          [`game_modes.${i}.top_scores.user_id`]: user_id,
        },
        {
          $set: {
            [`game_modes.${i}.top_scores.$[elem].deleted`]: true,
          },
        },
        {
          arrayFilters: [
            {
              "elem.user_id": user_id,
            },
          ],
        }
      );
    }

    await User.delete(user_id._id);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get user country score
const userCountryScore = async (req, res) => {
  const { id } = req.params;
  const { token } = req.query;

  const userId = decodeToken(token);

  try {
    const user = await User.findById(userId);
    const country = user.country.get(id);

    res.status(200).json({ data: country ? country : [], success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get user
const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-password");

    res.status(200).json({ data: user, success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  updateUser,
  deleteUser,
  userCountryScore,
  getUser,
};

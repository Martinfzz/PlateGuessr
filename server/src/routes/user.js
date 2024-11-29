const express = require("express");

// controller functions
const {
  loginUser,
  signupUser,
  updateUser,
  deleteUser,
  userCountryScore,
  getUser,
} = require("../controllers/userController");

const router = express.Router();

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

// update route
router.patch("/:id", updateUser);

// delete route
router.delete("/:id", deleteUser);

// user country score route
router.get("/country/:id", userCountryScore);

// user route
router.get("/:id", getUser);

module.exports = router;

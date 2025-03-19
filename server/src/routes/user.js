const express = require("express");

// controller functions
const {
  loginUser,
  signupUser,
  updateUser,
  deleteUser,
  userCountryScore,
  getUser,
  googleAuth,
  verifyEmail,
  resendVerificationEmail,
  resetPassword,
  setPassword,
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

// verify email route
router.post("/verify-email", verifyEmail);

// resend verification email route
router.post("/resend-verification-email", resendVerificationEmail);

// reset password route
router.post("/reset-password", resetPassword);

// set password route
router.post("/set-password", setPassword);

// login with Google
router.post("/auth/google", googleAuth);

module.exports = router;

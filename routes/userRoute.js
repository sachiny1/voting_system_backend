const express = require("express");
const {
  registerUser,
  loginUser,
  verifyToken,
  createPassword,
  logout,
  getMyDetail
} = require("../controller/userController");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/token/verify").post(verifyToken);
router.route("/create-password").post(createPassword);
router.route("/me").get(isAuthenticatedUser,getMyDetail);

router.route("/login").post(loginUser);
router.route("/logout").get(logout);



module.exports = router;

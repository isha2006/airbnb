const express = require("express");
const router = express.Router();
const {saveReturnTo} = require("../middlewares/auth");
const passport = require("passport");
const userController = require("../controllers/user");

router.route("/register")
.get(userController.registerForm)
.post(userController.postRegister)

router.route("/login")
.get(userController.loginForm)
.post(saveReturnTo, passport.authenticate("local", {
  failureFlash: true,
  failureRedirect: "/login"
}), userController.postLogin)

router.get("/logout", userController.logoutForm);

module.exports = router;

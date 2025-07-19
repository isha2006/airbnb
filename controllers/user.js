const User = require("../models/user");

module.exports.registerForm = (req, res) => {
  res.render("auth/register");
}

module.exports.postRegister = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash("success", `Welcome, ${registeredUser.username}!`);
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
}

module.exports.loginForm = (req, res) => {
  res.render("auth/login");
}

module.exports.postLogin = (req, res) => {
  const redirectUrl = res.locals.returnTo || "/listings";
  req.flash("success", `Welcome back, ${req.user.username}`);
  res.redirect(redirectUrl);
}

module.exports.logoutForm = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash("success", "You're Logged out!");
    res.redirect("/listings");
  });
}
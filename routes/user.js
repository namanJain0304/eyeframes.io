const express = require("express");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware");
const router = express.Router();

router.get("/signup", async (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          next(err);
        }
        req.flash("success", "New User Registered");
        res.redirect("/eyeframes");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", async (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  savedRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(async (req, res) => {
    req.flash("success", "Welcome Back");
    let redirectUrl = res.locals.redirectUrl || "/eyeframes";
    res.redirect(redirectUrl);
  })
);

router.get("/logout", async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out successfully");
    res.redirect("/login");
  });
});

module.exports = router;

const express = require("express");
const passport = require("passport");

const authRouter = express.Router();

authRouter.get("/", (req, res) => {
  res.render("auth0-login");
});

authRouter.get(
  "/login",
  passport.authenticate("auth0", {
    scope: "openid email profile"
  }),
  function(req, res) {
    res.redirect("/");
  }
);

authRouter.get("/callback", function(req, res, next) {
  passport.authenticate("auth0", function(err, user, info) {
    console.log("--------------");
    console.log(err);
    console.log("--------------");
    console.log(info);
    console.log("--------------");
    console.log(user);
    console.log("--------------");
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login");
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || "/user");
    });
  })(req, res, next);
});

authRouter.get("/logout", function(req, res, next) {
  req.logout();
  res.redirect("/auth0");
});

module.exports = authRouter;

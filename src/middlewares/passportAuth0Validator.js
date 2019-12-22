const passportAuth0Validator = (req, res, next) => {
  if (req.user) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect("/auth0");
};

module.exports = passportAuth0Validator;

const express = require("express");
const passport = require("passport");

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send("welcome " + req.user.nickname);
});

module.exports = userRouter;

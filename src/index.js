const express = require("express");
const expressHbs = require("express-handlebars");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
const authRouter = require("./routers/auth");
const userRouter = require("./routers/user");
const passportAuth0Validator = require("./middlewares/passportAuth0Validator");

/**
 * Creates an instance of the express server
 */
const app = express();

/**
 * Config for the handlebars template engine
 */
const hbs = expressHbs.create({
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "./views/layouts")
});

/**
 * Config for session management with express sessions
 */
const appSession = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true
};

/**
 *  Enables secure cookies (requires SSL/TLS)
 */
app.set("trust proxy", 1); // accept proxy if node.js is running behind another server
appSession.cookie.secure = true;

/**
 * Use app session object as express middleware
 */
app.use(session(appSession));

/**
 * configure Auth0 strategy with passport
 */
const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

/**
 * Set passport to use Auth0 strategy
 */
passport.use(strategy);

/**
 * Set express to use passport middlewares
 */
app.use(passport.initialize());
app.use(passport.session());

/**
 * keep a smaller payload for the user data
 */
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});

/**
 * Set views information to our express app
 */
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "./views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/auth0", authRouter);

app.use("/user", passportAuth0Validator, userRouter);

app.use("/js", express.static(path.join(__dirname, "./public/js")));

const server = app.listen(process.env.PORT, () => {
  console.log("Server running in port - ", server.address().port);
});

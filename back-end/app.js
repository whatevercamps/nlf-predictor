var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require("passport");
var expressSession = require("express-session");
const dotenv = require("dotenv");
dotenv.config();

var usersRouter = require("./routes/users");
var playersRouter = require("./routes/players");
var templatesRouter = require("./routes/templates");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(expressSession({ secret: process.env.secret }));

app.use(passport.initialize());
app.use(passport.session());
require("./db/passport")(passport);

app.use("/", playersRouter);
app.use("/users", usersRouter);
app.use("/players", playersRouter);
app.use("/templates", templatesRouter);

// passport.serializeUser(function(user, done) {
//     done(null, user._id);
//   });

//   passport.deserializeUser(function(id, done) {
//     User.findById(id, function(err, user) {
//       done(err, user);
//     });
//   });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

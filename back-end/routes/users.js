var express = require("express");
var passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var router = express.Router();
const mongoUtils = require("../db/mongoUtils.js");
const ObjectID = require("mongodb").ObjectID;
const mu = mongoUtils();
const dotenv = require("dotenv");
dotenv.config();

router.get(
  "/token",
  passport.authenticate("jwt", {
    session: false
  }),
  function(req, res) {
    if (!req.headers || !req.headers.authorization)
      return res.json({
        success: false,
        msg: "missing token"
      });
    else {
      let token = req.headers.authorization;
      console.log("token", token);
      let payload = jwt.decode(token.split(" ")[1]);
      console.log("payload", payload);
      if (!payload || !payload._id)
        return res.json({
          success: false,
          msg: "wrong token or error"
        });
      else {
        const query = { _id: ObjectID(payload._id) };
        mu.connect()
          .then(client => mu.getUsers(client, query))
          .then(users => {
            if (!users || !users.length)
              return res.json({
                success: false,
                msg: "wrong token"
              });
            else {
              const token = jwt.sign(users[0], process.env.secret, {
                expiresIn: 60
              });
              res.cookie("jwt", token, { httpOnly: true, secure: false });
              return res.json({
                success: true,
                token: token,
                msg: `your token expires in ${60} seconds`
              });
            }
          });
      }
    }
  }
);

router.get(
  "/validate",
  passport.authenticate("jwt", {
    session: false
  }),
  function(req, res) {
    res.json({ success: true });
  }
);

/* GET users listing. */
router.get("/login", function(req, res) {
  res.render("loginForm");
});

router.get("/register", function(req, res) {
  res.render("registerForm");
});

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log("datos", { email: email, password: password });
  mu.connect()
    .then(client => mu.getUsers(client, { email: email }))
    .then(user => {
      console.log("user", user);
      if (!user || !user.length) {
        return res.json({
          success: false,
          msg: "wrong user"
        });
      } else {
        bcrypt
          .compare(password, user[0].password)
          .then(isMatch => {
            if (isMatch) {
              const token = jwt.sign(user[0], process.env.secret, {
                expiresIn: 60 * 5
              });
              res.cookie("jwt", token, { httpOnly: true, secure: false });
              return res.json({
                success: true,
                token: token,
                msg: `your token expires in ${60 * 5} seconds`
              });
            } else {
              return res.json({
                success: false,
                msg: "Wrong passport"
              });
            }
          })
          .catch(err => {
            console.log("error", err);
            return res.json({ success: false, error: err });
          });
      }
    });
});

router.post("token");

router.post("/register", (req, res) => {
  let newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    templates: []
  };
  // res.json({ hash: "holiii" });
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(newUser.password, salt))
    .then(hash => {
      newUser.password = hash;
      return mu
        .connect()
        .then(client => mu.insertUsers(client, newUser))
        .then(resp => {
          res.json({
            success: true,
            msg: "User registered",
            data: resp
          });
        });
    })
    .catch(err => {
      res.json({
        success: false,
        msg: "Failure registering user",
        error: err
      });
    });
});

module.exports = router;

var express = require("express");
// var passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var router = express.Router();
const mongoUtils = require("../db/mongoUtils.js");
const mu = mongoUtils();

//Mateo León: Para objetivos de la clase se utiliza passport y no JWT

//Mateo León: Falta documentación de código

const comparePasswords = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};

/* GET users listing. */
router.get("/login", function(req, res) {
  res.render("loginForm");
});

router.get("/register", function(req, res) {
  res.render("registerForm");
});

router.post("/auth", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  mu.connect()
    .then(client => mu.getUsers(client, { email: email }))
    .then(user => {
      if (!user) {
        return res.json({
          success: false,
          msg: "wrong user"
        });
      }

      comparePasswords(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          const token = jwt.sign(user.toJSON(), process.env.secret, {
            expiresIn: 1200 //20 minutos
          });

          res.json({
            success: true,
            token: "JWT " + token
          });
        } else {
          return res.json({
            success: false,
            msg: "Wrong passport"
          });
        }
      });
    });
});

/* 
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(newUser.password, salt))
    .then(hash => {
      newUser.password = hash;
      mu.connect(client =>
        mu.insertUsers(client, ((newUser.password = hash), newUser))
      );
    });
*/

router.post("/adduser", (req, res) => {
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

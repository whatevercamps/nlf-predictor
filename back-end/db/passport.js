const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoUtils = require("../db/mongoUtils.js");
const dotenv = require("dotenv");

const mu = mongoUtils();
dotenv.config();

module.exports = function(passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.secret || "defaultsecret";
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      console.log("payload", jwt_payload);
      mu.connect()
        .then((client, query) => mu.getUsers(client, query))
        .then(user => done(null, user))
        .catch(err => done(err, false));
    })
  );
};

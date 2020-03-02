const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoUtils = require("./mongoUtils");
const ObjectID = require("mongodb").ObjectID;
const dotenv = require("dotenv");
dotenv.config();
const mu = mongoUtils();

module.exports = function(passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.secret;

  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      console.log("payload", jwt_payload);
      const query = { _id: ObjectID(jwt_payload._id) };
      mu.connect()
        .then(client => mu.getUsers(client, query))
        .then(users => {
          console.log("users", users);
          if (!users || !users.length) {
            return done(null, false);
          } else {
            return done(null, users[0]);
          }
        });
    })
  );
};

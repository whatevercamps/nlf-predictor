var express = require("express");
var router = express.Router();

const mongoUtils = require("../db/mongoUtils.js");
const mu = mongoUtils();

/* GET users listing. */
router.get("/", function(req, res) {
  mu.connect()
    .then(mu.getPlayers).then(players => {
      res.render("players", {"players": players});
    });
});

// router.get("/players2", function(req, res) {
//   const query = {
//     Position: new RegExp(`.*${req.params.query}.*`, "i")
//   };

//   mu.connect()
//     .then(mu.getPlayers2(query).then(players => {
//       res.render("players", {"players": players});
//     })
//     );
// });

// Data endpoint //
router.get("/playersE", (req, res) => {
  mu.connect()
    .then(mu.getPlayers).then(players => res.json(players));
});
module.exports = router;

var express = require("express");
var router = express.Router();

const mongoUtils = require("../db/mongoUtils.js");
const mu = mongoUtils();

/* GET users listing. */
router.get("/", function(req, res) {
  console.log("queryparams", req.query);
  let query = {};
  let renderBody = { positionSelected: false };
  if (req.query["pos"]) {
    let pos = req.query["pos"].toUpperCase();

    let positions = ["QB", "RB", "DST", "WR", "TE", "K"];

    if (positions.includes(pos)) {
      query["Position"] = pos;
      renderBody["positionSelected"] = pos;
    }
  } else if (req.query["playerName"]) query["Name"] = new RegExp(`.*${req.query["playerName"].split("_").join(".*")}.*`, "i");

  mu.connect()
    .then(client => mu.getPlayers(client, query))
    .then(players => {
      if (req.query["mode"] && req.query["mode"].toLowerCase() == "json")
        res.json(players);
      else
        res.render("players", ((renderBody["players"] = players), renderBody));
    });
});

router.get("/detail/:id", function(req, res) {
  console.log("detail/id params", req.params);

  mu.connect()
    .then(client => mu.findOneByID(client, req.params.id))
    .then(player => {
      console.log("player", player);
      return player;
    })
    .then(player => {
      res.render("playerDetail", {"player": player})
    })
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
    .then(mu.getPlayers)
    .then(players => res.json(players));
});
module.exports = router;

var express = require("express");
var router = express.Router();

const mongoUtils = require("../db/mongoUtils.js");
const mu = mongoUtils();

/* GET users listing. */
router.get("/", function(req, res) {
  console.log("queryparams", req.query);
  let query = { PlayerUrlString: { $not: /.*team-details.*/ } };
  let renderBody = { positionSelected: false };
  if (req.query["pos"]) {
    let pos = req.query["pos"].toUpperCase();

    let positions = ["QB", "RB", "DST", "WR", "TE", "K"];

    if (positions.includes(pos)) {
      query["Position"] = pos;
      renderBody["positionSelected"] = pos;
    }
  }
  if (req.query["playerName"])
    query["Name"] = new RegExp(
      `.*${req.query["playerName"].split("_").join(".*")}.*`,
      "i"
    );
  let page = 1;
  if (req.query["page"] && !isNaN(+req.query["page"])) {
    page = req.query["page"];
  }

  let howManies = 0;
  mu.connect()
    .then(client => mu.howManyPlayers(client, query))
    .then(count => {
      howManies = count;
      return mu
        .connect()
        .then(secondCliente => mu.getPlayers(secondCliente, query, page));
    })
    .catch(error => {
      console.log("err", error);
      res.json({ error: error });
      return undefined;
    })

    .then(players => {
      if (players)
        if (req.query["mode"] && req.query["mode"].toLowerCase() == "json")
          res.json({
            players: players,
            count: howManies,
            page: page
          });
        else
          res.render(
            "players",
            (((renderBody["players"] = players),
            (renderBody["count"] = howManies),
            (renderBody["page"] = page)),
            renderBody)
          );
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
      res.render("playerDetail", { player: player });
    });
});

module.exports = router;

var express = require("express");
var router = express.Router();

const mongoUtils = require("../db/mongoUtils.js");
const mu = mongoUtils();

/*
Mateo León: El código no está documentado así que no se entiende que hace cada función.
*/

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
    //Mateo León: Eliminar o comentar error
      res.json({ error: error });
      return undefined;
    })

    .then(players => {
      if (players)
        if (req.query["mode"] && req.query["mode"].toLowerCase() == "json")
          res.json({ players: players, count: howManies, page: page });
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
    //Mateo León: Comentar o eliminar console.log
      return player;
    })
    .then(player => {
      res.render("playerDetail", { player: player });
    });
});

router.get("/:id", function(req, res) {
  mu.connect()
    .then(client => mu.findOneByID(client, req.params.id))
    .then(player => {
    //Mateo León: Comentar o eliminar console.log
      return player;
    })
    .then(player => {
      res.render("playerResume", { player: player });
    });
});

// Data endpoint //
router.get("/playersE", (req, res) => {
  mu.connect()
    .then(client => mu.getPlayers2(client))
    .then(players => res.json(players));
});
module.exports = router;

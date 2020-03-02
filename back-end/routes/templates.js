var express = require("express");
var router = express.Router();
const mongoUtils = require("../db/mongoUtils.js");
const mu = mongoUtils();

/* GET users listing. */
router.get("/", function(req, res) {
  res.render("templates.html");
});

router.post("/create", function(req, res) {
  const template = {
    name: req.body.name,
    players: req.body.players,
    timestamp: new Date()
  };

  mu.templates.insert(template).then(res.redirect("/"));
});

module.exports = router;

var express = require("express");
var router = express.Router();

const mu = require("../db/mongoUtils.js");

/* GET users listing. */
router.get("/", function(req, res) {
  res.render("players");
});
module.exports = router;

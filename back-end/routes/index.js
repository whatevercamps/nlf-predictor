var express = require("express");
var router = express.Router();

//Mateo León: Esta ruta no funciona que no encuentra views.
/* GET home page. */
router.get("/hi", function(req, res) {
  res.render("index", { title: "Express" });
});

module.exports = router;

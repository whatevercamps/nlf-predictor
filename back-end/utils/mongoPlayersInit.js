"use strict";
const fs = require("fs");
const mongoUtils = require("../db/mongoUtils");

fs.readFile("utils/players_array.json", "utf8", (error, file) => {
  if (error) throw error;
  const players = JSON.parse(file);
  var toAppend = [];

  Object.keys(players).forEach(playerID => {
    toAppend.push(players[playerID]);
  });

  console.log("new players", toAppend);
  const mu = mongoUtils();
  mu.connect().then(client => {
    mu.insertPlayers(client, toAppend);
  });
});

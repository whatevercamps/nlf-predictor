"user strict";
const fetch = require("node-fetch");
const fs = require("fs");
var current_players = [];
var current_total = 0;

var max_players = process.argv[2] || 2000;
var limit = max_players < 2000 ? max_players * 18 : 29045;

console.log("argv", process.argv[2]);
console.log("max", max_players);
console.log("limit", limit);

const writePlayersJSONArray = () =>
  fs.writeFile(
    "utils/players_array.json",
    JSON.stringify(current_players),
    function(err) {
      if (err) {
        console.log(err);
      }
      console.log(`finished :) ${current_total} players written ...
    final lenght: ${current_players.length} ...
    final total: ${current_total}`);
    }
  );

const getPlayers = season => {
  const body = `sort=FantasyPoints-desc&pageSize=${max_players}&group=&filter=&filters.position=&filters.team=&filters.teamkey=&filters.season=${season}&filters.seasontype=1&filters.scope=1&filters.subscope=1&filters.redzonescope=&filters.scoringsystem=&filters.leaguetype=&filters.searchtext=&filters.week=&filters.startweek=&filters.endweek=&filters.minimumsnaps=&filters.teamaspect=&filters.stattype=&filters.exportType=&filters.desktop=&filters.dfsoperator=&filters.dfsslateid=&filters.dfsslategameid=&filters.dfsrosterslot=&filters.page=&filters.showfavs=&filters.posgroup=&filters.oddsstate=&filters.showall=&filters.aggregatescope=1&filters.rangescope=&filters.range=3`;
  console.log("body", body);
  fetch("https://fantasydata.com/FantasyStatsNFL/FantasyStats_Read", {
    credentials: "include",
    headers: {
      accept: "application/json, text/javascript, /; q=0.01",
      "accept-language": "es-419,es;q=0.9,en;q=0.8",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest"
    },
    referrer: `https://fantasydata.com/nfl/fantasy-football-leaders?season=${season}&seasontype=1&scope=1&subscope=1&aggregatescope=1&range=3`,
    referrerPolicy: "no-referrer-when-downgrade",
    body: body,
    method: "POST",
    mode: "cors"
  })
    .then(resp => resp.json())
    .then(data => {
      if (data.Errors) {
        console.log("errors", data.Errors);
        return;
      }
      console.log("appending data with length", data.Data.length);
      current_players = current_players.concat(data.Data);
      current_total += data.Data.length;
      console.log(
        `data downloaded of season ${season} .. 
        obtained ${data.Data.length} players of ${data.Total} ... 
        current total: ${current_total} ...
        current length: ${current_players.length}`
      );

      if (current_total >= limit) {
        writePlayersJSONArray();
      }
    });
};

for (var season = 2019; season >= 2002; season--) {
  getPlayers(season);
}

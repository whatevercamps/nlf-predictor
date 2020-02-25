"user strict";
const fetch = require("node-fetch");
const fs = require("fs");

console.log("obtaining data");

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
  referrer:
    "https://fantasydata.com/nfl/fantasy-football-leaders?season=2019&seasontype=1&scope=1&subscope=1&aggregatescope=1&range=3",
  referrerPolicy: "no-referrer-when-downgrade",
  body:
    "sort=FantasyPoints-desc&pageSize=1704&group=&filter=&filters.position=&filters.team=&filters.teamkey=&filters.season=2019&filters.seasontype=1&filters.scope=1&filters.subscope=1&filters.redzonescope=&filters.scoringsystem=&filters.leaguetype=&filters.searchtext=&filters.week=&filters.startweek=&filters.endweek=&filters.minimumsnaps=&filters.teamaspect=&filters.stattype=&filters.exportType=&filters.desktop=&filters.dfsoperator=&filters.dfsslateid=&filters.dfsslategameid=&filters.dfsrosterslot=&filters.page=&filters.showfavs=&filters.posgroup=&filters.oddsstate=&filters.showall=&filters.aggregatescope=1&filters.rangescope=&filters.range=3",
  method: "POST",
  mode: "cors"
})
  .then(data => data.json())
  .then(players => {
    console.log("data downloaded");
    fs.writeFile("utils/players.json", JSON.stringify(players.Data), function(
      err
    ) {
      if (err) {
        console.log(err);
      }
      console.log("data writed");
    });
  });

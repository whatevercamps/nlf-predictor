"user strict";

const structure = {
  PlayerID: 14536,
  Seasons: {
    Season: 2015,
    Played: 16,
    PassingCompletions: 329,
    PassingAttempts: 483,
    PassingCompletionPercentage: 68.1,
    PassingYards: 4024,
    PassingYardsPerAttempt: 8.3,
    PassingTouchdowns: 34,
    PassingInterceptions: 8,
    PassingRating: 110.12,
    RushingAttempts: 103,
    RushingYards: 553,
    RushingYardsPerAttempt: 5.4,
    RushingTouchdowns: 1,
    Receptions: 0,
    ReceivingTargets: 0,
    ReceivingYards: 0,
    ReceptionPercentage: 0,
    ReceivingTouchdowns: 0,
    ReceivingLong: 0,
    ReceivingYardsPerTarget: 0,
    ReceivingYardsPerReception: 0,
    Fumbles: 7,
    FumblesLost: 3,
    FieldGoalsMade: 0,
    FieldGoalsAttempted: 0,
    FieldGoalPercentage: 0,
    FieldGoalsLongestMade: 0,
    ExtraPointsMade: 0,
    ExtraPointsAttempted: 0,
    TacklesForLoss: 0,
    Sacks: 0,
    QuarterbackHits: 0,
    Interceptions: 0,
    FumblesRecovered: 0,
    Safeties: 0,
    DefensiveTouchdowns: 0,
    SpecialTeamsTouchdowns: 0,
    SoloTackles: 0,
    AssistedTackles: 0,
    SackYards: 0,
    PassesDefended: 0,
    FumblesForced: 0,
    FantasyPoints: 336.26,
    FantasyPointsPerGame: 21,
    TotalTackles: 0
  },
  PlayerUrlString: "/nfl/russell-wilson-fantasy/14536",
  Name: "Russell Wilson",
  ShortName: "R. Wilson",
  Position: "QB",
  TeamUrlString: "/nfl/team-details/SEA",
  Team: "SEA"
};

const fetch = require("node-fetch");
const fs = require("fs");
let current_players = {};
let current_total = 0;

let max_players = process.argv[2] || 2000;
let limit = max_players < 2000 ? max_players * 5 : 8408;

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
    final lenght: ${Object.keys(current_players).length} ...
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
      data.Data.forEach(player => {
        // console.log("playerid", +player.PlayerID);
        let posiblePlayer = current_players[+player.PlayerID];

        if (posiblePlayer) {
          let season = {};
          for (let attr in structure["Seasons"]) {
            season[attr] = player[attr];
          }
          posiblePlayer["Seasons"].push(season);
        } else {
          let newPlayer = {};
          for (let attr in structure) {
            if (attr === "Seasons") {
              let season = {};
              for (let seasonAttr in structure[attr]) {
                season[seasonAttr] = player[seasonAttr];
              }
              let seasons = [];
              seasons.push(season);
              newPlayer[attr] = seasons;
            } else {
              newPlayer[attr] = player[attr];
            }
          }
          posiblePlayer = newPlayer;
          current_players[+player.PlayerID] = posiblePlayer;
        }
      });
      // current_players = current_players.concat(data.Data);
      current_total += data.Data.length;
      console.log(
        `data downloaded of season ${season} .. 
        obtained ${data.Data.length} players of ${data.Total} ... 
        current total: ${current_total} ...
        current length: ${Object.keys(current_players).length}`
      );

      if (current_total >= limit) {
        writePlayersJSONArray();
      }
    });
};

for (let season = 2019; season >= 2015; season--) {
  getPlayers(season);
}

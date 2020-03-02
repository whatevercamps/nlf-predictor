const formSearch = document.querySelector("#formSearch");

const positionSelector = document.querySelector("#positionSelector");

const paginsSenders = document.querySelectorAll(".page-item");

const players = document.querySelectorAll(".player");
let addPlayerToTemplateContainer = document.querySelector(
  "#addPlayerTemplateContainer"
);
let addPlayerToTemplateButton = document.querySelector(
  "#addPlayerTemplateButton"
);

//Player editable datafields
let playerResumeName = document.querySelector("#player-resume-name");
let playerResumeTeam = document.querySelector("#player-resume-team");
let playerResumePoints = document.querySelector("#player-resume-points");
let playerResumeSeason = document.querySelector("#player-resume-season");
let playerResumeImage = document.querySelector("#playerresumeimage");

// let playerResumeNumber = document.querySelector("#player-resume-number");
let playerResumePlayed = document.querySelector("#player-resume-played");
let playerResumePosition = document.querySelector("#player-resume-position");

let playerResumeCMP = document.querySelector("#player-resume-cmp");
let playerResumeYDS = document.querySelector("#player-resume-yds");
let playerResumeINT = document.querySelector("#player-resume-int");
let playerResumePTS = document.querySelector("#player-resume-pts");

let playerResumeId = document.querySelector("#player-resume-id");

let currentPos = null;
let currentPlayerName = null;
let currentPage = 1;

players.forEach(player =>
  player.addEventListener("click", () => {
    console.log("name", player.dataset);
    playerResumeName.innerHTML = player.dataset.playerresumename;
    playerResumeTeam.innerHTML = player.dataset.playerresumeteam;
    playerResumePoints.innerHTML = player.dataset.playerresumepoints;
    playerResumeSeason.innerHTML = player.dataset.playerresumeseason;
    playerResumeImage.src = `https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/nfl/low-res/${player.dataset.playerid}.png`;
    playerResumePlayed.innerHTML = player.dataset.playerresumeplayed;
    playerResumePosition.innerHTML = player.dataset.playerresumeposition;

    playerResumeCMP.innerHTML = player.dataset.playerresumecmp;
    playerResumeYDS.innerHTML = player.dataset.playerresumeyds;
    playerResumeINT.innerHTML = player.dataset.playerresumeint;
    playerResumePTS.innerHTML = player.dataset.playerresumepts;

    addPlayerToTemplateButton.dataset.playerresumename =
      player.dataset.playerresumename;
    addPlayerToTemplateButton.dataset.playerresumeteam =
      player.dataset.playerresumeteam;
    addPlayerToTemplateButton.dataset.season =
      player.dataset.playerresumeseason;
    addPlayerToTemplateButton.dataset.points =
      player.dataset.playerresumepoints;
    addPlayerToTemplateButton.dataset.position =
      player.dataset.playerresumeposition;
    addPlayerToTemplateButton.dataset.playerresumeid =
      player.dataset.playerresumeid;

    let button = document.createElement("button");
    button.id = "addPlayerTemplateButton";
    button.dataset.playerresumename = player.dataset.playerresumename;
    button.dataset.playerresumeteam = player.dataset.playerresumeteam;
    button.addEventListener("click", () => {
      let name = player.dataset.playerresumename;
      let team = player.dataset.playerresumeteam;
      let position = player.dataset.playerresumeposition;
      let points = player.dataset.playerresumepoints;
      let season = player.dataset.playerresumeseason;
      let id = player.dataset.playerresumeid;

      let playerBody = {
        name: name,
        team: team,
        points: points,
        position: position,
        season: season,
        _id: id,
        playerID: player.dataset.playerid
      };
      console.log("pb", playerBody._id);
      addPlayerToTemplate(playerBody);
    });
    button.innerText = "Add player";

    // addPlayerToTemplateContainer.innerHTML = `
    // <button
    // id="addPlayerTemplateButton"
    // style="z-index:10"
    // data-playerresumename="${player.dataset.playerresumename}"
    // data-playerresumeteam="${player.dataset.playerresumeteam}"
    // >Add playeras</button>`;
    addPlayerToTemplateContainer.innerHTML = "";
    addPlayerToTemplateContainer.appendChild(button);

    // addPlayerToTemplateUl.innerHTML = "";
    // let li = document.createElement("li");
    // li.id = "liPlayersTemplate";
    // li.innerHTML = player.dataset.playerresumename;

    // addPlayerToTemplateUl.appendChild(li);

    const link = `/players/detail/${player.dataset.playerresumeid}`;

    console.log("link", link);

    playerResumeId.innerHTML = `<a href="${link}" class="text-right">See details</a>`;
  })
);

const updatePagination = count => {
  let pagination = document.querySelector("#pagination");
  pagination.innerHTML = "";
  let top = Math.min(currentPage + 2, Math.ceil(count / 20));
  let bottom = Math.max(1, currentPage - 1);
  console.log({
    currentPage: currentPage,
    count: count,
    bottom: bottom,
    top: top
  });
  for (var i = bottom; i <= top; i++) {
    const pagin = document.createElement("li");
    pagin.className = "page-item";
    pagin.dataset.index = i;
    pagin.innerHTML = `<a class="page-link"> ${i} </a>`;
    pagin.addEventListener("click", () => {
      currentPage = i;
      const playersUl = document.querySelector("#playerL");
      playersUl.innerHTML = "Querying players";
      getPlayersJSON(currentPlayerName, currentPos, currentPage)
        .then(res => res.json())
        .then(showPlayers);
    });
    pagination.appendChild(pagin);
  }
};

const getPlayersJSON = (currentPlayerName, currentPos, currentPage) => {
  return fetch(
    `/players?mode=json${
      currentPlayerName ? `&playerName=${currentPlayerName}` : ""
    }${currentPos ? `&pos=${currentPos}` : ""}${
      currentPage ? `&page=${currentPage}` : ""
    }`
  );
};
if (positionSelector)
  positionSelector.addEventListener("change", evt => {
    if (evt.target.value) {
      const playersUl = document.querySelector("#playerL");
      playersUl.innerHTML = "Querying players";
      currentPos = evt.target.value.toString();
      console.log("prev currentPos", currentPos);
      currentPos =
        currentPos == "All positions" ? null : currentPos.split(" ")[0];
      currentPage = 1;
      getPlayersJSON(currentPlayerName, currentPos, currentPage)
        .then(res => res.json())
        .then(showPlayers);
    }
  });

paginsSenders.forEach(paginSender =>
  paginSender.addEventListener("click", () => {
    currentPage = +paginSender.dataset.index;
    const playersUl = document.querySelector("#playerL");
    playersUl.innerHTML = "Querying players";
    getPlayersJSON(currentPlayerName, currentPos, currentPage)
      .then(res => res.json())
      .then(showPlayers);
  })
);

const showPlayers = data => {
  let players = data["players"];
  const playersUl = document.querySelector("#playerL");

  playersUl.innerHTML = "";

  players.forEach(player => {
    const playerDiv = document.createElement("div");
    playerDiv.className = "row player";

    playerDiv.dataset.playerresumename = player.Name;
    playerDiv.dataset.playerresumeteam = player.Team;
    playerDiv.dataset.playerresumepoints = player.Seasons[0].FantasyPoints;
    playerDiv.dataset.playerresumeseason = player.Seasons[0].Season;
    playerDiv.dataset.playerid = player.PlayerID;
    playerDiv.dataset.playerresumeplayed = player.Seasons[0].Played;
    playerDiv.dataset.playerresumeposition = player.Position;

    playerDiv.dataset.playerresumecmp = player.Seasons[0].PassingCompletions;
    playerDiv.dataset.playerresumeyds = player.Seasons[0].PassingYards;
    playerDiv.dataset.playerresumeint = player.Seasons[0].Interceptions;
    playerDiv.dataset.playerresumepts = player.Seasons[0].FantasyPoints;

    playerDiv.dataset.playerresumeid = player._id;

    playerDiv.innerHTML = `
    <div class="col-lg-3 playerImage">
      <img
        style="width:70px; height:70px"
        src="https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/nfl/low-res/${player.PlayerID}.png"
        alt="Tom Brady Profile Image"
        class="playerI"
      />
    </div>
    <div class="col-lg-5 playerName">
      <h5>${player.Name}</h5>
      <p>${player.Team} - ${player.Position}</p>
    </div>
    <div class="col-lg-3 playerInfo">
      <h5>${player.Seasons[0].FantasyPoints}pts</h5>
      <p id="season">${player.Seasons[0].Season} season</p>
    </div>
    <div class="col-lg-1 align-self-center playerExtra">
      <a href=""
        ><i class="fa fa-ellipsis-v justify-content-center"></i
      ></a>
    </div>`;

    playerDiv.addEventListener("click", () => {
      playerResumeName.innerHTML = playerDiv.dataset.playerresumename;
      playerResumeTeam.innerHTML = playerDiv.dataset.playerresumeteam;
      playerResumePoints.innerHTML = playerDiv.dataset.playerresumepoints;
      playerResumeSeason.innerHTML = playerDiv.dataset.playerresumeseason;
      playerResumeImage.src = `https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/nfl/low-res/${playerDiv.dataset.playerid}.png`;
      playerResumePlayed.innerHTML = playerDiv.dataset.playerresumeplayed;
      playerResumePosition.innerHTML = playerDiv.dataset.playerresumeposition;

      playerResumeCMP.innerHTML = playerDiv.dataset.playerresumecmp;
      playerResumeYDS.innerHTML = playerDiv.dataset.playerresumeyds;
      playerResumeINT.innerHTML = playerDiv.dataset.playerresumeint;
      playerResumePTS.innerHTML = playerDiv.dataset.playerresumepts;

      playerResumeId.innerHTML = playerDiv.dataset.playerresumeid;

      addPlayerToTemplateButton.dataset.playerresumename =
        playerDiv.dataset.playerresumename;
      addPlayerToTemplateButton.dataset.playerresumeteam =
        playerDiv.dataset.playerresumeteam;
      addPlayerToTemplateButton.dataset.season =
        playerDiv.dataset.playerresumeseason;
      addPlayerToTemplateButton.dataset.points =
        playerDiv.dataset.playerresumepoints;
      addPlayerToTemplateButton.dataset.position =
        playerDiv.dataset.playerresumeposition;

      addPlayerToTemplateContainer.innerHTML = "";
      let button = document.createElement("button");
      button.id = "addPlayerTemplateButton";
      button.addEventListener("click", () => {
        let name = playerDiv.dataset.playerresumename;
        let team = playerDiv.dataset.playerresumeteam;
        let position = playerDiv.dataset.playerresumeposition;
        let points = playerDiv.dataset.playerresumepoints;
        let season = playerDiv.dataset.playerresumeseason;
        console.log("sea", season);
        let id = playerDiv.dataset.playerresumeid;
        let playerBody = {
          name: name,
          team: team,
          points: points,
          position: position,
          season: season,
          _id: id,
          playerID: playerDiv.dataset.playerid
        };
        console.log("playerBody 3", playerBody, playerBody._id);
        addPlayerToTemplate(playerBody);
      });
      button.innerText = "Add player";
      addPlayerToTemplateContainer.appendChild(button);
    });

    playersUl.appendChild(playerDiv);
  });

  updatePagination(data["count"]);
};

const onSearch = evt => {
  const query = document.querySelector("#formSearch #form-player-name").value;
  console.log("uuuh me tocaron", query);

  const playersUl = document.querySelector("#playerL");
  playersUl.innerHTML = " Searching player";
  let queryParam = query.toString().trim();
  console.log("param", queryParam);
  queryParam = queryParam.replace(new RegExp("[\\s]+"), "_");
  console.log("params", queryParam);
  currentPlayerName = queryParam;
  currentPage = 1;
  getPlayersJSON(currentPlayerName, currentPos, currentPage)
    .then(res => res.json())
    .then(data => {
      let players = data["players"];
      console.log("players", players);
      if (!players || !players.length)
        playersUl.innerHTML = " Player not found :(";
      else showPlayers(data);
    });

  evt.preventDefault();
};

const addPlayerToTemplate = player => {
  let templateArray = localStorage.getItem("templateArray")
    ? { ...JSON.parse(localStorage.getItem("templateArray")) }
    : { arr: [] };
  let arr = templateArray["arr"];
  arr.push(player);
  templateArray["arr"] = arr;
  localStorage.setItem("templateArray", JSON.stringify(templateArray));

  let addPlayerToTemplateList = document.querySelector("#listPlayersTemplate");

  let row = document.createElement("div");
  row.className = "row player";
  row.innerHTML = `<div class="col-3 playerImage">
  <img
    style="width:70px; height:70px"
    src="https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/nfl/low-res/${player.playerID}.png"
    alt="Tom Brady Profile Image"
    class="playerI"
  />
</div>
<div class="col-5 playerName">
  <h5>${player.name}</h5>
  <p> ${player.team} - ${player.position}</p>
</div>
<div class="col-3 playerInfo">
<h5>${player.points}pts</h5>
<p id="season">${player.season} season</p>
</div>
<div class="col-1 align-self-center playerExtra">
  <a href="/players/detail/${player._id}"
    ><i class="fa fa-times justify-content-center text-dark"></i
  ></a>
</div>`;

  addPlayerToTemplateList.appendChild(row);
};

if (addPlayerToTemplateButton)
  addPlayerToTemplateButton.addEventListener("click", evt => {
    console.log("holii", evt.target.dataset.playerresumename);

    let name = evt.target.dataset.playerresumename;
    let team = evt.target.dataset.playerresumeteam;
    let position = evt.target.dataset.position;
    let points = evt.target.dataset.points;
    let season = evt.target.dataset.season;
    console.log("sea", season);
    let id = evt.target.dataset.playerresumeid;
    let playerBody = {
      name: name,
      team: team,
      points: points,
      position: position,
      season: season,
      _id: id,
      playerID: evt.target.dataset.playerid
    };
    console.log("playerBody", playerBody._id);
    addPlayerToTemplate(playerBody);
  });

if (formSearch) formSearch.addEventListener("submit", onSearch);

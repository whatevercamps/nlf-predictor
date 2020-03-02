const formSearch = document.querySelector("#formSearch");

const positionSelector = document.querySelector("#positionSelector");

const paginsSenders = document.querySelectorAll(".page-item");

const players = document.querySelectorAll(".player");

//Player editable datafields
let playerResumeName = document.querySelector("#player-resume-name");
let playerResumeTeam = document.querySelector("#player-resume-team");
let playerResumePoints = document.querySelector("#player-resume-points");
let playerResumeSeason = document.querySelector("#player-resume-season");

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

    playerResumePlayed.innerHTML = player.dataset.playerresumeplayed;
    playerResumePosition.innerHTML = player.dataset.playerresumeposition;

    playerResumeCMP.innerHTML = player.dataset.playerresumecmp;
    playerResumeYDS.innerHTML = player.dataset.playerresumeyds;
    playerResumeINT.innerHTML = player.dataset.playerresumeint;
    playerResumePTS.innerHTML = player.dataset.playerresumepts;

    playerResumeId.innerHTML = player.dataset.playerresumeid;
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
        src="../img/tom_brady.png"
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
      console.log("name", playerDiv.dataset);
      playerResumeName.innerHTML = playerDiv.dataset.playerresumename;
      playerResumeTeam.innerHTML = playerDiv.dataset.playerresumeteam;
      playerResumePoints.innerHTML = playerDiv.dataset.playerresumepoints;
      playerResumeSeason.innerHTML = playerDiv.dataset.playerresumeseason;

      playerResumePlayed.innerHTML = playerDiv.dataset.playerresumeplayed;
      playerResumePosition.innerHTML = playerDiv.dataset.playerresumeposition;

      playerResumeCMP.innerHTML = playerDiv.dataset.playerresumecmp;
      playerResumeYDS.innerHTML = playerDiv.dataset.playerresumeyds;
      playerResumeINT.innerHTML = playerDiv.dataset.playerresumeint;
      playerResumePTS.innerHTML = playerDiv.dataset.playerresumepts;

      playerResumeId.innerHTML = playerDiv.dataset.playerresumeid;
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

formSearch.addEventListener("submit", onSearch);

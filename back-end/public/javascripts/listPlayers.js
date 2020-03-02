const formSearch = document.querySelector("#formSearch");

const positionSelector = document.querySelector("#positionSelector");

const paginsSenders = document.querySelectorAll(".page-item");

let currentPos = null;
let currentPlayerName = null;
let currentPage = 1;

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

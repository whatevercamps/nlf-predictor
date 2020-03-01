const formSearch = document.querySelector("#formSearch");

const positionSelector = document.querySelector("#positionSelector");

positionSelector.addEventListener("change", evt => {
  if (evt.target.value) {
    const playersUl = document.querySelector("#playerL");
    playersUl.innerHTML = "Querying players";
    fetch(`/players?pos=${evt.target.value.toString()}&mode=json`)
      .then(res => res.json())
      .then(showPlayers);
  }
});

const showPlayers = players => {
  const playersUl = document.querySelector("#playerL");

  console.log("padre", playersUl);

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
  fetch(`/players?playerName=${queryParam}&mode=json`)
    .then(res => res.json())
    .then(players => {
      if (!players || !players.length)
        playersUl.innerHTML = " Player not found :(";
      else showPlayers(players);
    });

  evt.preventDefault();
};

formSearch.addEventListener("submit", onSearch);

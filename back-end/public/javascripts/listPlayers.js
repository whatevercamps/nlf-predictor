const formSearch = document.querySelector("#formSearch");

const showPlayers = (players) => {
  const playersUl = document.querySelector("#player");

  playersUl.innerHTML = "";

  players.forEach( p => {
    const playerLi = document.createElement("Li");

    playerLi.textContent = `${p.Name} : ${p.Position}`;

    playersUl.appendChild(playerLi);
  });
};

const onSearch = evt => {
  
  const query = document.querySelector("#formSearch #pos").value;
  fetch(`/players/${query}`)
    .then(res => res.json())
    .then(showPlayers);

  evt.preventDefault();
};

formSearch.addEventListener("submit", onSearch);
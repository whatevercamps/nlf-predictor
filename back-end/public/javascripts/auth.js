const loginForm = document.querySelector("#form-signin");
const registerForm = document.querySelector("#form-signup");
const signoutButtom = document.querySelector("#signout-button");
const lds = document.querySelector(".lds-container");
const content = document.querySelector(".wrapper");

if (!sessionStorage.getItem("token")) {
  if (
    window.location.pathname != "/users/login" &&
    window.location.pathname != "/users/register"
  ) {
    console.log("entro al 1");
    sessionStorage.clear();
    window.location = "/users/login";
  }
} else if (window.location.pathname != "/users/login")
  fetch("/users/validate", {
    method: "GET",
    credentials: "include",
    headers: { Authorization: `JWT ${sessionStorage.getItem("token")}` }
  })
    .then(resp => resp.json())
    .then(data => {
      if (!data.success) {
        console.log("entro al 2");
        sessionStorage.clear();
        window.location = "/users/login";
      } else {
        if (lds) {
          lds.remove();
          lds.hidden = true;
        }
        if (content) content.hidden = false;
      }
    })
    .catch(err => {
      console.log(err);
      console.log("entro al 3");
      sessionStorage.clear();
      window.location = "/users/login";
    });

if (signoutButtom)
  signoutButtom.addEventListener("click", () => {
    console.log("entro al 4");
    sessionStorage.clear();
    window.location = "/users/login";
  });

if (registerForm)
  registerForm.addEventListener("submit", evt => {
    evt.preventDefault();
    let name = evt.target.elements[0].value;
    let email = evt.target.elements[1].value;
    let password = evt.target.elements[2].value;
    let body = JSON.stringify({ name: name, email: email, password: password });
    console.log("body", body);
    fetch("/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body
    })
      .then(resp => resp.json())
      .then(data => {
        console.log(data);
        if (data.success) {
          window.location = "/users/login";
        } else {
          console.log("err", data);
        }
      });
  });

if (loginForm)
  loginForm.addEventListener("submit", evt => {
    evt.preventDefault();
    let email = evt.target.elements[0].value;
    let password = evt.target.elements[1].value;
    let body = JSON.stringify({ email: email, password: password });
    console.log("body", body);
    fetch("/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body
    })
      .then(resp => resp.json())
      .then(data => {
        console.log(data);
        if (data.token) {
          sessionStorage.setItem("token", data.token);
          window.location = "/players";
        }
      });
  });

const getNewToken = () => {
  if (sessionStorage.getItem("token")) {
    fetch("/users/token", {
      method: "GET",
      credentials: "include",
      headers: { Authorization: `JWT ${sessionStorage.getItem("token")}` }
    })
      .then(resp => resp.json())
      .then(data => {
        console.log(data);
        if (data.token) {
          sessionStorage.setItem("token", data.token);
          console.log("token", sessionStorage.getItem("token"));
        } else {
          sessionStorage.clear();
          window.location = "/users/login";
        }
      });
  }
};
console.log("creando listener de cada 60 segs");
window.setInterval(getNewToken, 60000);

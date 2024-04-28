import Connection from "./connection.js";

const authOverlay = document.querySelector("#auth-overlay");
const signInForm = document.querySelector("#signin-form");
const singUpForm = document.querySelector("#signup-form");
let connection = null;

const signIn = async (username, password) => {
  return await fetch("/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  }).then((res) => res.json());
};

const signUp = async (username, password) => {
  return await fetch("/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  }).then((res) => res.json());
};

const validate = async () => {
  return await fetch("/validate")
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        return true;
      } else {
        console.warn(data.error);
        return false;
      }
    });
};

document.addEventListener("DOMContentLoaded", async () => {
  if (await validate()) {
    const user = JSON.parse(localStorage.getItem("user"));
    connection = Connection(user);
    authOverlay.style.display = "none";
  }
});

signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const message = document.querySelector("#signin-message");

  signIn(formData.get("username"), formData.get("password")).then((data) => {
    if (data.status === "success") {
      localStorage.setItem("user", JSON.stringify(data.user));
      connection = Connection(data.user);
      authOverlay.style.display = "none";
    } else {
      // report error
      message.textContent = data.error;
    }
  });
});

singUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const message = document.querySelector("#signup-message");

  signUp(formData.get("username"), formData.get("password")).then((data) => {
    if (data.status === "success") {
      message.textContent = "Account created successfully";
    } else {
      // report error
      message.textContent = data.error;
    }
  });
});

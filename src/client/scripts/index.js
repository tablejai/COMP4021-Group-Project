import Connection from "./connection.js";

const joinRoomForm = document.querySelector("#join-room-form");
let connection = null;

const joinGame = async (username) => {
  return await fetch("/join", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: formData.get("username"),
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

const register = async (username, password) => {
  return await fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
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
    connection = Connection();
  }
});

joinRoomForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  await joinGame(formData.get("username")).then((data) => {
    if (data.status === "success") {
      connection = Connection();
    } else {
      // report error
      console.error(data.error);
    }
  });
});

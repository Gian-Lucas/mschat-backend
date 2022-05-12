const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN_URL || "http://localhost:3000",
  },
});

const users = [];

// quando user conectar
io.on("connection", (socket) => {
  console.log(`user ${socket.id} connected`);

  users.push(socket.id);
  console.log(users);

  // quando user enviar uma msg
  socket.on("send_message", (msg) => {
    console.log(msg);

    io.emit("receive_message", {
      user: msg.user,
      text: msg.text,
    });
  });

  // quando user desconectar
  socket.on("disconnect", () => {
    removeUser();
  });

  function removeUser() {
    for (let i = 0; i < users.length; i++) {
      if (users[i] === socket.id) {
        users.splice(i, 1);
      }
    }
    console.log(`user ${socket.id} disconnected`);
    console.log(users);
  }
});

server.listen(process.env.PORT || 8080, () => {
  console.log("Running...");
});

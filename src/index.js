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

io.on("connection", (socket) => {
  console.log(`user ${socket.id} connected`);
  socket.broadcast.emit("enter", `usuário ${socket.id} entrou`);

  users.push(socket.id);

  console.log(users);

  socket.on("disconnect", () => {
    for (let i = 0; i < users.length; i++) {
      if (users[i] === socket.id) {
        users.splice(i, 1);
      }
    }
    console.log(`user ${socket.id} disconnected`);
    socket.broadcast.emit("exit", `usuário ${socket.id} saiu`);

    console.log(users);
  });
});

server.listen(process.env.PORT || 8080, () => {
  console.log("Running...");
});

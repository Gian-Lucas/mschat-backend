const express = require("express");
const app = express();

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

io.on("connection", (socket) => {
  console.log("user connected");
});

server.listen(process.env.PORT || 8080, () => {
  console.log("Running...");
});

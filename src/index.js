const express = require("express");
const mongoose = require("./database/index");
const Message = require("./models/message");
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

async function getMessagesOfRoom(roomCode) {
  try {
    const messages = await Message.find({ roomCode });

    console.log(messages);

    return messages;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function saveNewMessage(msg) {
  try {
    const { roomCode, user, text } = msg;

    const newMessage = new Message({
      roomCode,
      user,
      text,
    });

    const addMessage = await newMessage.save();

    console.log(addMessage);
  } catch (error) {
    console.log(error);
  }
}

function removeUser(socketId) {
  for (let i = 0; i < users.length; i++) {
    if (users[i] === socketId) {
      users.splice(i, 1);
    }
  }
  console.log(`user ${socketId} disconnected`);
  console.log(users);
}

// when user connect
io.on("connection", (socket) => {
  console.log(`user ${socket.id} connected`);

  users.push(socket.id);
  console.log(users);

  // when user send a message
  socket.on("send_message", async (msg) => {
    console.log(msg);

    saveNewMessage(msg);

    io.to(msg.roomCode).emit("receive_message", {
      user: msg.user,
      text: msg.text,
    });
  });

  // join in room
  socket.on("join_room", async (code) => {
    socket.join(code);
    console.log("entrar na sala: ", code);

    io.to(code).emit("room_messages", await getMessagesOfRoom(code));
  });

  // when user disconnect
  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

server.listen(process.env.PORT || 8080, () => {
  console.log("Running...");
});

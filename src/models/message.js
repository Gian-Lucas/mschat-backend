const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  roomCode: String,
  user: {
    name: String,
    email: String,
    image: String,
  },
  text: String,
});

const Message = model("Message", messageSchema);

module.exports = Message;

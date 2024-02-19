const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const path = require("path");
const { formatMessage } = require("./utils/messages");
const {
  addUser,
  getCurrentUser,
  getRoomUsers,
  userLeave,
} = require("./utils/users");
const app = express();
const server = http.createServer(app);
const PORT = 5000;

//Connecting to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/chatRoom")
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(err));

//Serve Static files
app.use(express.static(path.resolve("public")));

const io = socketio(server);

const botName = "Chatbot";

//When Client connects
io.on("connection", (socket) => {
  //Join room
  socket.on("joinRoom", async ({ username, room }) => {
    const user = await addUser(socket.id, username, room);

    // console.log("User............", user);

    socket.join(user.room);

    //Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to the ChatRoom"));

    //Broadcast when user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the room`)
      );

    //Room and users info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: await getRoomUsers(room),
    });
  });

  //Listens the Chat Message
  socket.on("chatMessage", async (msg) => {
    const user = await getCurrentUser(socket.id);
    io.emit("message", formatMessage(user.username, msg));
  });

  //When user disconnects
  socket.on("disconnect", async () => {
    const user = await getCurrentUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the room`)
      );

      await userLeave(socket.id);

      //Room and users info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: await getRoomUsers(user.room),
      });
    }
  });
});

server.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);

// const users = [];
const User = require("../models/user.model");

//Add users
async function addUser(id, username, room) {
  const user = {
    id,
    username,
    room,
  };

  // users.push(user);
  const newUser = await User.create(user);

  return newUser;
}

// Get current user
async function getCurrentUser(id) {
  return await User.findOne({ id: id });
}

//User leave room
async function userLeave(id) {
  return await User.deleteOne({ id: id });
}

//Get room users
async function getRoomUsers(room) {
  // return users.filter((user) => user.room === room);
  return await User.find({ room: room });
}

module.exports = {
  addUser,
  getRoomUsers,
  getCurrentUser,
  userLeave,
};

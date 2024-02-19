const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: { type: String },
    username: { type: String },
    room: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);

module.exports = User;

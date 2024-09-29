const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  phone: {
    type: Number,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

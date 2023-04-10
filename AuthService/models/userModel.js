const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userModel = mongoose.Schema({
  login: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

userModel.methods.matchPassword = async function (entredPassword) {
  return await bcrypt.compare(entredPassword, this.password);
};

userModel.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userModel);

module.exports = User;

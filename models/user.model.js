const mongoose = require("mongoose");
const { isEmail } = require("validator");
const { ADMIN, MANAGER, USER } = require("../utils/user.roles");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "first Name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: [isEmail, "must be enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  token: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [USER, ADMIN, MANAGER],
    default: USER,
  },
  avatar: {
    type: String,
    default:"uploads/default.jpeg"
  },
});
module.exports = mongoose.model("users", userSchema);

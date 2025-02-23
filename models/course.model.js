const mongoose = require("mongoose");
const Courseschema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
});
module.exports = mongoose.model("Courses", Courseschema);

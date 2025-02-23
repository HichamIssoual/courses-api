// CRUD  (Create / Read / Update / Delete) // 20 minutes
const { ERROR } = require("./utils/httpStatusText");
require("dotenv").config();
const port = process.env.PORT;
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const mongoose = require("mongoose");
const url = process.env.MONGO_URL;
mongoose
  .connect(url)
  .then(() => {
    console.log("Connected with mongo db success");
  })
  .catch((reason) => {
    console.log("Error: ", reason);
  });
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
const coursesRouter = require("./routes/courses.routes");
const usersRouter = require("./routes/users.routes");

app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);
// global midlleware for not found routes
app.all("*", (req, res) => {
  res.status(404).json({
    status: ERROR,
    data: null,
    msg: "This Ressource Not available",
    code: 404,
  });
});
// global middle ware for expected errors
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.statusText ? err.statusText : ERROR,
    data: err.data || null,
    message: err.message,
    code: err.statusCode || 500,
  });
});
app.listen(port, () => {
  console.log("Listen On Port:", port);
});

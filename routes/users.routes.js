// get all users
// register
// login
const multer = require("multer");
const { loginValidation } = require("../middlewares/validation-schema");
const { verifyToken } = require("../middlewares/verify.token");
const {
  getUsers,
  register,
  login,
} = require("./../controllers/users.controller");
const express = require("express");
const appError = require("../utils/appError");
const { ERROR } = require("../utils/httpStatusText");
const diskStorage = multer.diskStorage({
  destination: function (req, file, callBack) {
    callBack(null, "uploads");
  },
  filename: function (req, file, callBack) {
    const ext = file.mimetype.split("/").at(1);
    const fileName = `user-${Date.now()}${Math.floor(
      Math.random() * 1946
    )}.${ext}`;
    callBack(null, fileName);
  },
});
const fileFilter = (req, file, callBack) => {
  const fileType = file.mimetype.split("/").at(0);
  if (fileType === "image") {
    return callBack(null, true);
  } else {
    return callBack(
      appError.create("Only accept image Extentions", 400, ERROR),
      false
    );
  }
};
const uploads = multer({ storage: diskStorage, fileFilter: fileFilter });
const Router = express.Router();
Router.route("/").get(verifyToken, getUsers);
Router.route("/register").post(uploads.single("avatar"), register);
Router.route("/login").post(loginValidation, login);
module.exports = Router;

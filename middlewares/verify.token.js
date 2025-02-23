const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const { FAIL } = require("../utils/httpStatusText");
const verifyToken = (req, res, next) => {
  const auth = req.headers["Authorization"] || req.headers["authorization"];
  if (!auth) {
    const error = appError.create("Token Is required", 401, FAIL);
    return next(error);
  }
  const token = auth.split(" ").at(1);
  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = currentUser;
    next();
  } catch (e) {
    const err = appError.create("Invalid Token", 401, FAIL);
    next(err);
  }
};
module.exports = {
  verifyToken,
};

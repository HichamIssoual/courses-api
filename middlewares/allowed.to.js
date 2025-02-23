const appError = require("../utils/appError");
const { ERROR } = require("../utils/httpStatusText");

module.exports = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.currentUser.role)) {
      next();
    } else {
      const error = appError.create(
        "You do not have permission to perform this action",
        403,
        ERROR
      );
      return next(error);
    }
  };
};

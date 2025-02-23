const { body } = require("express-validator");
const addCourseValidation = [
  body("title")
    .notEmpty()
    .withMessage("title Is require")
    .isLength({ min: 5 })
    .withMessage("title must 5 chars or over"),
  body("price")
    .notEmpty()
    .withMessage("price is require")
    .custom((val) => {
      if (typeof val === "string") {
        throw new Error("price is Number its not String");
      } else {
        return val;
      }
    })
    .bail()
    .isFloat({ gt: 4 })
    .withMessage("you must enter 5 dollar or over"),
];
const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("email not Valid"),
  body("password").notEmpty().withMessage("password is required"),
];
module.exports = {
  addCourseValidation: addCourseValidation,
  loginValidation: loginValidation,
};

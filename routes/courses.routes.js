const express = require("express");
const {
  getCourses,
  getSingleCourse,
  addCourse,
  deleteCourse,
  updateCourse,
} = require("../controllers/courses.controller");
const { addCourseValidation } = require("../middlewares/validation-schema");
const { verifyToken } = require("../middlewares/verify.token");
const allowedTo = require("../middlewares/allowed.to");
const { ADMIN, MANAGER } = require("../utils/user.roles");
const router = express.Router();
router
  .route("/")
  .get(getCourses)
  .post(verifyToken, allowedTo(ADMIN, MANAGER), addCourseValidation, addCourse);
router
  .route("/:id")
  .get(getSingleCourse)
  .patch(verifyToken, allowedTo(ADMIN, MANAGER), updateCourse)
  .delete(verifyToken, allowedTo(ADMIN, MANAGER), deleteCourse);
module.exports = router;

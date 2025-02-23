const Course = require("../models/course.model");
const { validationResult } = require("express-validator");
const { FAIL, SUCCESS } = require("./../utils/httpStatusText");
const asyncWrapper = require("./../middlewares/asyncwrapper");
const appError = require("../utils/appError");
const getCourses = async (request, response) => {
  // http://localhost:5000/api/courses?limit=2&page=0
  const { limit, page } = request.query;
  const courses = await Course.find({ price: { $gte: 5 } }, "title price")
    .limit(limit || 10)
    .skip((page - 1) * limit || 0);
  response.json({
    status: SUCCESS,
    data: {
      courses: courses,
    },
  });
};
const getSingleCourse = asyncWrapper(async (request, response, next) => {
  const courseId = request.params.id;
  const course = await Course.findById(courseId);
  if (!course) {
    const error = appError.create("Course Not Found", 404, FAIL);
    return next(error);
  }
  response.json({
    status: SUCCESS,
    data: {
      course: course,
    },
  });
});
const addCourse = async (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array().at(0).msg, 400, FAIL);
    return next(error);
  } else {
    const course = new Course(request.body);
    await course.save();
    response.status(201).json({
      status: SUCCESS,
      data: {
        course: course,
      },
    });
  }
};
const deleteCourse = asyncWrapper(async (request, response, next) => {
  const courseId = request.params.id;
  const res = await Course.deleteOne({ _id: courseId });
  if (res.deletedCount > 0) {
    response.status(200).json({
      status: SUCCESS,
      data: null,
    });
  } else {
    const error = appError.create("Course Not Found", 404, FAIL);
    return next(error);
  }
});
const updateCourse = asyncWrapper(async (request, response) => {
  const courseId = request.params.id;
  const updatedCourse = await Course.findByIdAndUpdate(courseId, {
    $set: { ...request.body },
  });
  response.status(200).json({
    status: SUCCESS,
    data: {
      olderCourse: updatedCourse,
    },
  });
});

module.exports = {
  getCourses,
  getSingleCourse,
  deleteCourse,
  addCourse,
  updateCourse,
};

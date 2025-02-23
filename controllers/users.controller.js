const { validationResult } = require("express-validator");
const asyncwrapper = require("../middlewares/asyncwrapper");
const userModel = require("../models/user.model");
const appError = require("../utils/appError");
const { SUCCESS, FAIL } = require("../utils/httpStatusText");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generate.token");
const getUsers = asyncwrapper(async (req, res) => {
  const allUsers = await userModel.find(
    {},
    "firstName lastName email avatar role token"
  );
  res.status(200).json({
    status: SUCCESS,
    data: {
      users: allUsers,
    },
  });
});
const register = asyncwrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;
  const findByEmail = await userModel.findOne({ email: email });
  if (findByEmail) {
    const error = appError.create("something wrong", 400, FAIL);
    return next(error);
  }
  const hashingPass = await bcrypt.hash(password, 10);
  const newUser = new userModel({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashingPass,
    role: role,
    avatar: req.file.filename,
  });
  // generate token
  const jwToken = await generateToken(
    { id: newUser._id, email: newUser.email, role: newUser.role },
    "100 days"
  );
  newUser.token = jwToken;
  await newUser.save();
  res.status(201).json({
    status: SUCCESS,
    data: {
      user: newUser,
    },
  });
});
const login = asyncwrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    const validationError = appError.create(error.array().at(0).msg, 400, FAIL);
    return next(validationError);
  }
  const findByEmail = await userModel.findOne({ email: email });
  if (!findByEmail) {
    const error = appError.create("email or password wrong", 400, FAIL);
    return next(error);
  }
  const checkPassword = await bcrypt.compare(password, findByEmail.password);
  const jwToken = await generateToken(
    { id: findByEmail._id, email: findByEmail.email, role: findByEmail.role },
    "100 days"
  );
  if (findByEmail && checkPassword) {
    return res.status(200).json({
      status: SUCCESS,
      data: {
        token: jwToken,
        message: "Loged In successfuly",
      },
    });
  } else {
    const error = appError.create("email or password wrong", 400, FAIL);
    return next(error);
  }
});
module.exports = {
  getUsers,
  register,
  login,
};

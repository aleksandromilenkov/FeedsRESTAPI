const User = require("../models/UserModel");
const { validationResult } = require("express-validator");

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 422;
      error.data = errors.array();
      return next(error);
    }
    const { email, name, password } = req.body;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

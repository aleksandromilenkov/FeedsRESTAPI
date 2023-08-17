const { validationResult } = require("express-validator");
const User = require("../models/UserModel");

exports.getStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Could not find status");
      error.statusCode = 404;
      return next(error);
    }
    const status = user.status;
    res.status(200).json({
      message: "Status successfully fetched",
      status: status,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 422;
      return next(error);
    }
    const status = req.body.status;
    console.log(status);
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("Could not find status");
      error.statusCode = 404;
      return next(error);
    }

    user.status = status;
    await user.save();
    res.status(200).json({
      message: "Status successfully updated",
      status: user.status,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

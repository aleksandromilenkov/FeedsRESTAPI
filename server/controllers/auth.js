const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

exports.signup = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    console.log(email, name, password);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 422;
      error.data = errors.array();
      return next(error);
    }
    const user = await User.create({
      email,
      name,
      password: await bcrypt.hash(password, 12),
    });
    await user.save();
    res.status(201).json({
      message: "User created",
      userId: user._id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

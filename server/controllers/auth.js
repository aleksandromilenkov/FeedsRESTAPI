const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

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

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User with this email is not found");
      error.statusCode = 404;
      throw error;
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      const error = new Error("Password is not correct");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      "my secrett",
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      userId: user._id.toString(),
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

const { validationResult } = require("express-validator");
const Post = require("../models/PostModel");
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    if (posts.length === 0) {
      const error = new Error("Could not fetch posts");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      message: "Posts fetched successfully",
      posts: posts,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not find post");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      message: "Post fetched",
      post: post,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const title = req.body.title;
    const content = req.body.content;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 422;
      return next(error);
    }
    const post = await Post.create({
      title: title,
      content: content,
      creator: {
        name: "Max",
      },
      imageUrl: "nature.jpg",
    });

    // Create post in db
    res.status(201).json({
      message: "Post created successfully!",
      post: post,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      return next(err);
    }
  }
};

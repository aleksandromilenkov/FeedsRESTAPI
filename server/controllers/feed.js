const { validationResult } = require("express-validator");
const path = require("path");
const { deleteFile } = require("../utils/clearImage");
const Post = require("../models/PostModel");
exports.getPosts = async (req, res, next) => {
  try {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .skip(perPage * (currentPage - 1))
      .limit(perPage);
    if (posts.length === 0) {
      const error = new Error("Could not fetch posts");
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      message: "Posts fetched successfully",
      posts: posts,
      totalItems: totalItems,
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 422;
      return next(error);
    }
    if (!req.file) {
      const error = new Error("No image provided");
      error.statusCode = 422;
      return next(error);
    }
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.filename;
    const post = await Post.create({
      title: title,
      content: content,
      creator: {
        name: "Max",
      },
      imageUrl: imageUrl,
    });

    // Create post in db
    res.status(201).json({
      message: "Post created successfully!",
      post: post,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      error.statusCode = 422;
      return next(error);
    }
    const { postId } = req.params;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = req.file.filename;
    }
    if (!imageUrl) {
      const error = new Error("No file picked");
      error.statusCode = 422;
      return next(error);
    }
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not find post");
      error.statusCode = 422;
      return next(error);
    }
    if (imageUrl !== post.imageUrl) {
      deleteFile(post.imageUrl);
    }
    const updatedPost = await Post.findByIdAndUpdate(post._id, {
      title,
      content,
      imageUrl,
    });
    res.status(200).json({
      message: "Post updated",
      post: updatedPost,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    // check if creator is logged in user
    deleteFile(post.imageUrl);
    if (!post) {
      const error = new Error("Post does not exists");
      error.statusCode = 404;
      next(error);
    }
    const removedPost = await Post.findByIdAndRemove(postId);
    res.status(200).json({
      message: "Post was deleted",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

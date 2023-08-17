const express = require("express");
const { body } = require("express-validator");
const feedController = require("../controllers/feed");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

// GET /feed/posts
router.get("/posts", isAuth, feedController.getPosts);
router.get("/post/:postId", feedController.getPost);

// POST /feed/post
router.post(
  "/post",
  isAuth,
  [
    body("title")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Invalid input for title"),
    body("content")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Invalid input for content"),
  ],
  feedController.createPost
);

// PUT
router.put(
  "/post/:postId",
  isAuth,
  [
    body("title")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Invalid input for title"),
    body("content")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Invalid input for content"),
  ],
  feedController.updatePost
);

router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;

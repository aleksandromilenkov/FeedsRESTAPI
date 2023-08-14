const express = require("express");
const { body } = require("express-validator");
const feedController = require("../controllers/feed");

const router = express.Router();

// GET /feed/posts
router.get("/posts", feedController.getPosts);
router.get("/post/:postId", feedController.getPost);

// POST /feed/post
router.post(
  "/post",
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

router.delete("/post/:postId", feedController.deletePost);

module.exports = router;

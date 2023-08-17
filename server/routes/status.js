const express = require("express");
const { body } = require("express-validator");
const statusController = require("../controllers/status");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get(
  "/",
  isAuth,
  [body("status").trim().not().isEmpty()],
  statusController.getStatus
);
router.patch("/", isAuth, statusController.updateStatus);

module.exports = router;

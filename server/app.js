const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");
dotenv.config({ path: "./config.env" });
const app = express();

// UPLOADING IMAGES:
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
app.use(upload.single("image"));
// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, PATCH, POST, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// ROUTES:
app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

// ROUTE FOR CATCHING ERRORS:
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(process.env.DATABASE)
  .then((result) => {
    app.listen(8080, () => {
      console.log("Server started at port 8080");
    });
  })
  .catch((err) => console.log(err));

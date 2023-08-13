const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const feedRoutes = require("./routes/feed");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: "./config.env" });
const app = express();

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

// ROUTE FOR CATCHING ERRORS:
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(process.env.DATABASE)
  .then((result) => {
    app.listen(8080, () => {
      console.log("Server started at port 8080");
    });
  })
  .catch((err) => console.log(err));

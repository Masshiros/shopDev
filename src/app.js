require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();
// init middleware
app.use(morgan("dev"));
// morgan("combine")
// morgan("common")
// morgan("short")
// morgan("tiny")
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// init db
require("./dbs/init.mongodb");
// const { countConnect, checkOverLoad } = require("./helpers/check.connect");
// checkOverLoad();
// countConnect();
// init router
app.use("", require("./routes"));
// handle error middleware
// 404
app.use((req, res, next) => {
  const error = new Error("Not Found");
  
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
    console.log(error);
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});
module.exports = app;

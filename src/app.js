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
// init db
require("./dbs/init.mongodb");
const { countConnect, checkOverLoad } = require("./helpers/check.connect");
checkOverLoad();
countConnect();
// init router

// handle error middleware

module.exports = app;

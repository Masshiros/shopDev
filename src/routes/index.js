"use strict";

const express = require("express");
const router = express.Router();

router.use("/v1/api", require("./access"));

module.exports = router;

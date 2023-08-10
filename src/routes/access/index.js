"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const router = express.Router();
const { asyncHandler } = require("../../middlewares/checkAuth");

/**
 * DESC    : Sign up a user
 * METHOD  : POST
 * BODY    :
 * ACCESS  : None
 */
router.post("/shop/signup", asyncHandler( accessController.signUp));
module.exports = router;

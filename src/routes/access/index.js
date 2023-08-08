"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const router = express.Router();

/**
 * DESC    : Sign up a user
 * METHOD  : POST
 * BODY    :
 * ACCESS  : None
 */
router.post("/shop/signup", accessController.signUp);
module.exports = router;

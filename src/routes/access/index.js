"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

/**
 * DESC    : Sign up a user
 * METHOD  : POST
 * BODY    :
 * ACCESS  : None
 */
router.post("/shop/signup", asyncHandler(accessController.signUp));
/**
 * DESC    : Login
 * METHOD  : POST
 * BODY    : {name,email,refreshToken}
 * ACCESS  : None
 */
router.post("/shop/login", asyncHandler(accessController.login));
// authentication //
router.use(authentication)
////////////////////////
/**
 * DESC    : Logout
 * METHOD  : POST
 * BODY    : {name,email,refreshToken}
 * ACCESS  : None
 */
router.post("/shop/logout", asyncHandler(accessController.logout));
module.exports = router;

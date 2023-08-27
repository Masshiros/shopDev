"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");

//authentication//
router.use(authenticationV2);
//////////////////
/**
 * DESC    : Create new product
 * METHOD  : POST
 * BODY    : {product_type,...)
 * ACCESS  : LOGIN
 */
router.post("", asyncHandler(productController.createProduct));
module.exports = router;

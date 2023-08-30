"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
/**
 * DESC    : Search product
 * METHOD  : GET
 * PARAM   : keySearch
 */
router.get(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchProduct)
);
/**
 * DESC    : Find All Product
 * METHOD  : GET
 * QUERY   : yes
 */
router.get("", asyncHandler(productController.findAllProducts));
/**
 * DESC    : Find One Product
 * METHOD  : GET
 * QUERY   : yes
 */
router.get("/:product_id", asyncHandler(productController.findProduct));
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
/**
 * DESC    : Update product
 * METHOD  : PATCH
 * BODY    : {product_type,...)
 * PARAM   : productId
 * ACCESS  : LOGIN
 */
router.patch("/:productId", asyncHandler(productController.updateProduct));
/**
 * DESC    : Publish a product
 * METHOD  : POST
 * PARAMS  : product_id
 * ACCESS  : LOGIN
 */
router.post(
  "/publish/:id",
  asyncHandler(productController.publishProductByShop)
);
/**
 * DESC    : Unpublish a product
 * METHOD  : POST
 * PARAMS  : product_id
 * ACCESS  : LOGIN
 */
router.post(
  "/unpublish/:id",
  asyncHandler(productController.unPublishProductByShop)
);
/**
 * DESC    : Get All Draft Products
 * METHOD  : GET
 * ACCESS  : LOGIN
 */
router.get("/drafts/all", asyncHandler(productController.getAllDraftForShop));
/**
 * DESC    : Get All Publish Products
 * METHOD  : GET
 * ACCESS  : LOGIN
 */
router.get(
  "/published/all",
  asyncHandler(productController.getAllPublishForShop)
);

module.exports = router;

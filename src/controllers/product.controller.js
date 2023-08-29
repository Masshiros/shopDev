"use strict";
const ProductService = require("../services/product.service");
const { SuccessResponse } = require("../core/success.response");

class ProductController {
  // create Product
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create Product Success",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  /**
   * @des   Get All Draft Product
   * @param {Number} limit
   * @param {Number} skip
   * @param {ObjectId} product_shop
   * @return {JSON}
   */
  getAllDraftForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get List Draft Product Success",
      metadata: await ProductService.findAllDraftForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();

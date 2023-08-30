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
   * @des   Update product
   */
  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Update Product Success",
      metadata: await ProductService.updateProduct(req.body.product_type,req.params.productId,{
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  /**
   * @des   Publish a product by shop
   * @param {ObjectId} product_id
   * @param {ObjectId} product_shop
   * @return {JSON}
   */
  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Publish Product Success",
      metadata: await ProductService.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @des   Unpublish a product by shop
   * @param {ObjectId} product_id
   * @param {ObjectId} product_shop
   * @return {JSON}
   */
  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Unpublish Product Success",
      metadata: await ProductService.unPublishProductByShop({
        product_id: req.params.id,
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
  /**
   * @des  Get All Publish Product
   * @param {ObjectId} product_shop
   * @param {ObjectId} product_id
   * @return {JSON}
   */
  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get List Publish Product Success",
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @des   Search Product by keysearch
   */
  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Search Product Success",
      metadata: await ProductService.searchProducts(req.params),
    }).send(res);
  };
  /**
   * @des   find all products
   */
  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Find All Product Success",
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  };
  /**
   * @des   find one product
   */
  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Find Product Success",
      metadata: await ProductService.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();

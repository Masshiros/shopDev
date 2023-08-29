"use strict";

const {
  product,
  electronic,
  furniture,
  clothing,
} = require("../../models/product.model.js");

const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};
module.exports = {
  findAllDraftForShop,
};

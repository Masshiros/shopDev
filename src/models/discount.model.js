"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";
// Declare the Schema of the Mongo model
var discountSchema = new Schema(
  {
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: "fixed_amount" },
    discount_value: { type: Number, required: true },
    discount_code: { type: String, required: true },
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    discount_max_uses: { type: Number, required: true }, // the number of discount can be applied
    discount_uses_count: { type: Number, required: true }, // the number of discount used
    discount_users_used: { type: Array, default: [] }, // who use this discount
    discount_max_uses_per_user: { type: Number, required: true }, // the number of max uses of this discount by one user
    discount_min_order_value: { type: Number, required: true },
    discount_shopId: { type: Schema.Types.ObjectId, ref: "shop" },
    discount_is_active: { type: Boolean, default: true },
    discount_applied_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: { type: Array, default: [] }, // products that applied discount when we choose option "specific" when create discount
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = { discount: model(DOCUMENT_NAME, discountSchema) };

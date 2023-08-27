"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
// define the product type= clothing
const clothingSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
  },
  {
    collection: "clothes",
    timestamps: true,
  }
);
// define the product type= electronic
const electronicSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: string,
    material: string,
  },
  {
    collection: "electronics",
    timestamps: true,
  }
);
//Export the model
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model("Clothing", clothingSchema),
  electronic: model("Electronic", electronicSchema),
};

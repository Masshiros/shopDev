"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";
// Declare the Schema of the Mongo model
var inventorySchema = new Schema(
  {
    invent_productId: { type: Schema.Types.ObjectId, ref: "product" },
    invent_location: { type: String, default: "unknown" },
    invent_stock: { type: Number, required: true },
    invent_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    invent_reservations: { type: Array, default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = { inventory: model(DOCUMENT_NAME, inventorySchema) };

"use strict";
const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const { BadRequestError, ForbiddenError } = require("../core/error.response");
const {
  findAllDraftForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProducts,
  findAllProducts,
  findProduct,
  updateProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");
const { insertInventory } = require("../models/repositories/inventory.repo");
// define Factory class to create product
class ProductFactory {
  /**
   * type: 'Clothing'
   * payload
   */
  static productRegister = {};
  static registerProductType(type, classRef) {
    ProductFactory.productRegister[type] = classRef;
  }
  // create new product
  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegister[type];
    if (!productClass) {
      throw new BadRequestError(`Invalid Product Types ${type}`);
    }
    return new productClass(payload).createProduct();
    // switch (type) {
    //   case "Electronics":
    //     return new Electronics(payload).createProduct();
    //   case "Clothing":
    //     return new Clothing(payload).createProduct();
    //   default:
    //     throw new BadRequestError(`Invalid Product Types ${type}`);
    // }
  }

  // update product
  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegister[type];
    if (!productClass) {
      throw new BadRequestError(`Invalid Product Types ${type}`);
    }
    return new productClass(payload).updateProduct(productId);
  }
  // query all draft products
  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftForShop({ query, limit, skip });
  }
  // query all publish products
  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }

  // publish a product
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }
  // unpublish a product
  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }
  // search product
  static async searchProducts({ keySearch }) {
    return await searchProducts({ keySearch });
  }
  // find all
  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      filter,
      page,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }
  // find detail
  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ["__v"] });
  }
}

// product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }
  // create product
  async createProduct(productId) {
    const newProduct = await product.create({ ...this, _id: productId });

    if (newProduct) {
      // add inventory stock

      await insertInventory({
        productId: newProduct._id,
        shopId: newProduct.product_shop,
        stock: newProduct.product_quantity,
      });
    }
    return newProduct;
  }
  // update product
  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({ productId, bodyUpdate, model: product });
  }
}
// define sub-class for different product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) {
      throw new BadRequestError("Create new Clothing error");
    }
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new BadRequestError("Create new Product error");
    }
    return newProduct;
  }
  async updateProduct(productId) {
    /**
     * 1. remove attr has null undefined
     * 2. check update where
     */

    //1. remove attr has null undefined
    const objectParams = removeUndefinedObject(this);
    //2. check update where
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: clothing,
      });
    }
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}
// define sub-class for different product types Electronics
class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) {
      throw new BadRequestError("Create new Electronics error");
    }
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError("Create new Product error");
    }
    return newProduct;
  }
  async updateProduct(productId) {
    /**
     * 1. remove attr has null undefined
     * 2. check update where
     */

    //1. remove attr has null undefined
    const objectParams = removeUndefinedObject(this);
    //2. check update where
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: electronic,
      });
    }
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}
// define sub-class for different product types Furniture
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) {
      throw new BadRequestError("Create new Furniture error");
    }
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) {
      throw new BadRequestError("Create new Product error");
    }
    return newProduct;
  }
  async updateProduct(productId) {
    /**
     * 1. remove attr has null undefined
     * 2. check update where
     */

    //1. remove attr has null undefined
    const objectParams = removeUndefinedObject(this);
    //2. check update where
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: furniture,
      });
    }
    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}
// register product types
ProductFactory.registerProductType("Electronics", Electronics);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);
// ProductFactory.registerProductType("Furniture", Furniture);
module.exports = ProductFactory;

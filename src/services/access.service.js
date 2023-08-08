"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const { RoleShop } = require("../constants/role.constant");
class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step1: check email exist??
      const holderShop = await shopModel
        .findOne({
          email,
        })
        .lean();
      if (holderShop) {
        return {
          code: "xxx",
          message: "Shop already registered",
        };
      }
      // step2 : hash password
      const hashPassword = bcrypt.hash(password, 10);
      // step3 : create new shop
      const newShop = await shopModel.create({
        name,
        email,
        password: hashPassword,
        roles: [RoleShop.SHOP],
      });
      // step4: create privateKey, publicKey by using pairSync algorithm
      if (newShop) {
        // create privateKey, publicKey
        const {privateKey, publicKey} = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
        });
        console.log({privateKey,publicKey});
      }
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;

"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const RoleShop = require("../constants/role.constant");
const keyTokenService = require("../services/keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.response");

class AccessService {
  static signUp = async ({ name, email, password }) => {
    // try {
      // step1: check email exist??
      const holderShop = await shopModel
        .findOne({
          email,
        })
        .lean();
      if (holderShop) {
        throw new BadRequestError("Error: Shop already exist");
      }
      // step2 : hash password
      const hashPassword = await bcrypt.hash(password, 10);

      // step3 : create new shop
      const newShop = await shopModel.create({
        name,
        email,
        password: hashPassword,
        roles: [RoleShop.SHOP],
      });

      // step4: create accesstoken refreshtoken by using asymmetric algorithm
      if (newShop) {
        // create privateKey, publicKey

        // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        //   privateKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        // });
        // easy level
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        // save publicKey into keyToken model
        console.log({ privateKey, publicKey });
        const keyStore = await keyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          // version 2 - easy level
          privateKey,
        });
        // check publicKey
        if (!keyStore) {
          return {
            code: "xxx",
            message: "error keystore",
          };
        }
        // const publicKeyObject = crypto.createPublicKey(publicKeyString);
        // create accessToken and refreshToken
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        );
        console.log("create token success::", tokens);
        const shop = getInfoData({
          fields: ["_id", "name", "email"],
          object: newShop,
        });
        console.log("Shop:::", shop);
        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens,
          },
        };
      }
      return {
        code: 200,
        metadata: null,
      };
    // } catch (error) {
    //   return {
    //     code: "xxx",
    //     message: error.message,
    //     status: "error",
    //   };
    // }
  };
}

module.exports = AccessService;

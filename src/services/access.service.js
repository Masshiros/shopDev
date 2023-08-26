"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const RoleShop = require("../constants/role.constant");
const KeyTokenService = require("../services/keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { OK, CREATED } = require("../core/success.response");
const { findByEmail } = require("./shop.service");

class AccessService {
  static handlerRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    /**
     * Step 1: Check this token used or not ?
     * Step 2: If yes, decode who is this user and delete all tokens in keyTokenModel
     * Step 3: If no, find that user and verify token
     * Step 4: Check user , if yes, create new AT & RT
     * Step 5: Set keyToken model and return
     */
    const { userId, email } = user;
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happened!! Please relogin");
    }
    if (keyStore.refreshToken !== refreshToken) {
      if (!tokenHolder) throw new AuthFailureError(`Shop not registered`);
    }
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError(`Shop not registered`);
    // create new AT & RT
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );
    // update Token
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });
    return {
      user,
      tokens,
    };
  };
  static handlerRefreshToken = async (refreshToken) => {
    /**
     * Step 1: Check this token used or not ?
     * Step 2: If yes, decode who is this user and delete all tokens in keyTokenModel
     * Step 3: If no, find that user and verify token
     * Step 4: Check user , if yes, create new AT & RT
     * Step 5: Set keyToken model and return
     */
    // Step 1: Check this token used or not ?
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    if (foundToken) {
      // decode who is this user
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      console.log(userId, email);
      // delete all tokens in keyTokenModel
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happened!! Please relogin");
    }
    // if no
    const tokenHolder = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!tokenHolder) throw new AuthFailureError(`Shop not registered`);
    // verifyToken
    const { userId, email } = await verifyJWT(
      refreshToken,
      tokenHolder.privateKey
    );
    console.log(`[2]--`, userId, email);
    // check userId
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError(`Shop not registered`);
    // create new AT & RT
    const tokens = await createTokenPair(
      { userId, email },
      tokenHolder.publicKey,
      tokenHolder.privateKey
    );
    // update Token
    await tokenHolder.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });
    return {
      user: { userId, email },
      tokens,
    };
  };
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };
  /**
   * step 1: check email
   * step 2: match password
   * step 3: create privatekey & publickey
   * step 4: generate tokens and store RT
   * step 5: get data return
   */
  static login = async ({ password, email, refreshToken = null }) => {
    //  step 1: check email
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Shop not registered");
    }
    // step 2: match password
    const isMatch = bcrypt.compare(password, foundShop.password);
    if (!isMatch) {
      throw new AuthFailureError("Authentication Error");
    }
    // step 3: create privatekey, publickey
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    // step 4: generate token and store RT
    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });
    // step 5: return token
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };
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

      // save publicKey, privateKey into keyToken model
      console.log({ privateKey, publicKey });
      const keyStore = await KeyTokenService.createKeyToken({
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
        shop: shop,
        tokens,
      };
      // return {
      //   code: 201,
      //   metadata: {
      //     shop: getInfoData({
      //       fields: ["_id", "name", "email"],
      //       object: newShop,
      //     }),
      //     tokens,
      //   },
      // };
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

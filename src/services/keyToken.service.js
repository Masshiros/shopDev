"use strict";

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey,privateKey}) => {
    try {
      // convert buffer to string
      // const publicKeyString = publicKey.toString();
      const tokens = await keyTokenModel.create({
        user: userId,
        // publicKey: publicKeyString,
        publicKey,
        privateKey,
      });
      return tokens ? tokens : null;
    } catch (error) {
      return error;
    }
  };
}
module.exports = KeyTokenService;

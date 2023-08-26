"use strict";
const JWT = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const HEADER = require("../constants/header.constants");
const { AuthFailureError, NotFoundError } = require("../core/error.response");

const KeyTokenService = require("../services/keyToken.service");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      // algorithm: "RS256",
      expiresIn: "2 days",
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      // algorithm: "RS256",
      expiresIn: "7 days",
    });
    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};
const authentication = asyncHandler(async (req, res, next) => {
  /**
   * step 1: check userId missing?
   * step 2: check keystore with userId
   * step 3: get accessToken
   * step 4: verify token
   * step 5: check user in db
   * step 6: return next
   */
  // step 1: check userId missing
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");
  // step 2: check keystore with userId
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found keyStore");
  //step 3: get accessToken
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");
  // step 4: verify token
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    // step 5: check user in db
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid User");
    //step 6: return next
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});
const authenticationV2 = asyncHandler(async (req, res, next) => {
  /**
   * step 1: check userId missing?
   * step 2: check keystore with userId
   * step 3: get accessToken
   * step 4: verify token
   * step 5: check user in db
   * step 6: return next
   */
  // step 1: check userId missing
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");
  // step 2: check keystore with userId
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found keyStore");
  //step 3: check RT, get accessToken
  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      // step 5: check user in db
      if (userId !== decodeUser.userId)
        throw new AuthFailureError("Invalid User");
      //step 6: return next
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");
  // step 4: verify token
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    // step 5: check user in db
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid User");
    //step 6: return next
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});
const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};
module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
  authenticationV2,
};

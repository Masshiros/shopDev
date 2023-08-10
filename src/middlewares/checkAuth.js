"use strict";

const HEADER = require("../constants/header.constants");
const { findById } = require("../services/apiKey.service");

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY];
    if (!key) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    // check apiKey existed in db
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {
    console.log(error);
  }
};
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Permission Denied",
      });
    }
    console.log("permission::", req.objKey.permissions);
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: "Permission Denied",
      });
    }
    return next();
  };
};
module.exports = { apiKey, checkPermission };

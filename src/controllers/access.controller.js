"use strict";

const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    try {
      /**
       * 200 OK
       * 201 CREATED
       */
      
      return res.status(201).json(await AccessService.signUp(req.body));
    } catch (error) {
      next(error);
    }
  };
}
module.exports = new AccessController();

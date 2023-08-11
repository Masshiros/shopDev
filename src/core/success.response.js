"use strict";
const {
  StatusCodes,
  ReasonPhrases,
} = require("../constants/httpStatus/httpStatusCode");
class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    metadata = {},
    options = {},
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.statusCode = statusCode;
    this.reasonStatusCode = reasonStatusCode;
    this.metadata = metadata;
    this.options = options;
  }
  send(res, headers = {}) {
    return res.status(this.statusCode).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    metadata,
    options = {},
  }) {
    super(message, statusCode, reasonStatusCode, metadata, options);
  }
}
class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.CREATED,
    reasonStatusCode = ReasonPhrases.CREATED,
    metadata,
    options = {},
  }) {
    super(message, statusCode, reasonStatusCode, metadata, options);
  }
}
module.exports = { OK, CREATED, SuccessResponse };

import logger from "../utils/logger.js";
import { ErrorCodes } from "../utils/errorCodes.js";

class responseConfig {
  constructor(errorCode, message, data) {
    // this.errorCode = errorCode;
    // this.message = message;
    // this.data = data;
  }
  /**
   * Sends a success response to the client
   * @param {*} res - The response object
   * @param {*} statusCode - The HTTP status code to send in the response
   * @param {*} message - The message to send in the response
   * @param {*} data - The data to send in the response
   */

  sendSuccess(res, statusCode, message, data) {
    res.status(statusCode).json({
      message: message,
      data: data,
    });
  }

  /**
   * Sends an error response to the client
   * @param {*} res - The response object
   * @param {*} statusCode - The HTTP status code to send in the response
   * @param {*} errorCode - The error code to send in the response
   * @param {*} message - The message to send in the response
   * @param {*} data - The data to send in the response
   */
  sendError(res, statusCode, errorCode, message, data) {
    // Enhanced error logging with stack trace
    logger.error("Error Response", {
      errorCode: errorCode,
      message: message,
      data: data,
      statusCode: statusCode,
      timestamp: new Date().toISOString(),
      stack: data instanceof Error ? data.stack : undefined,
    });
    let errorData = ErrorCodes[errorCode];
    if (errorCode == "1007") {
      errorData = {
        ...errorData,
        message: errorData.message ?? "Something went wrong",
        userMessage: message.user,
      };
    }
    if (errorCode == "998") {
      errorData = {
        ...errorData,
        message: errorData.message,
        userMessage: data.targets ? data.targets.join(", ") + " already exists" : "Record already exists",
      };
    }
    // const message = errorCodes.ErrorCodes[errorCode];
    res.status(statusCode).json({
      errorCode: errorCode,
      errorData: errorData,
      message: {
        message: errorData.message,
        userMessage: errorData.userMessage,
      },
      // data: data,
    });
  }
}

export default new responseConfig();

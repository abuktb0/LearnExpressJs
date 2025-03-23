const logger = require("./logger");
const error = require("./error");
const notFound = require("./notFound");
const {verifyTokenForAuth, verifyTokenForAdmin} = require("./verifyToken")

module.exports = {
    logger, error, notFound, verifyTokenForAuth, verifyTokenForAdmin
}
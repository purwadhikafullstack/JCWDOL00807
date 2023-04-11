const express = require("express");
const Router = express.Router();
const { tokenVerify } = require("../middleware/verifyToken");

const { userTransactionController } = require("../controllers");

Router.post(
  "/add-to-transaction",
  tokenVerify,
  userTransactionController.userTransaction
);

module.exports = Router;

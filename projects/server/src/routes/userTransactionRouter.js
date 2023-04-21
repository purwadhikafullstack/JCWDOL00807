const express = require("express");
const Router = express.Router();
const { tokenVerify } = require("../middleware/verifyToken");

const { userTransactionController } = require("../controllers");

Router.post(
  "/add-to-transaction",
  tokenVerify,
  userTransactionController.userTransaction
);
Router.patch(
  "/cancel-order-by-user",
  tokenVerify,
  userTransactionController.CancelOrderByUser
);
Router.patch(
  "/cancel-order-by-sistem",
  tokenVerify,
  userTransactionController.cancelOrderBySistem
);

module.exports = Router;

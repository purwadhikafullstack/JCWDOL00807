const express = require("express");
const Router = express.Router();
const { tokenVerify } = require("../middleware/verifyToken");
const { orderListController } = require("../controllers");

Router.get('/order-list', tokenVerify, orderListController.OrderList)

module.exports = Router;

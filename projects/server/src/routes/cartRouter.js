const express = require("express");
const Router = express.Router();
const { tokenVerify } = require("../middleware/verifyToken");

const { cartController } = require("../controllers");

Router.post("/add-to-cart", tokenVerify, cartController.cart);

module.exports = Router;

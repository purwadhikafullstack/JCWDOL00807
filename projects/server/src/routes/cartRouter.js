const express = require("express");
const Router = express.Router();
const { tokenVerify } = require("../middleware/verifyToken");

const { cartController } = require("../controllers");

Router.get("/list/:brid", tokenVerify, cartController.cart);
Router.post("/add-to-cart", tokenVerify, cartController.addToCart);
Router.patch("/updateQty", tokenVerify, cartController.cartUpdateQty)
Router.delete("/deleteQty", tokenVerify, cartController.cartDeleteQty)


module.exports = Router;

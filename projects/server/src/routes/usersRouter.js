const express = require("express");
const Router = express.Router();
const { tokenVerify } = require("../middleware/verifyToken");
const uploadImages = require("../middleware/upload");
const { usersController, userProductController } = require("../controllers");
const { transactionController } = require("../controllers");

// Import All Controller

Router.get("/login", usersController.login);
Router.get("/keep-login", tokenVerify, usersController.keepLogin);
Router.post("/forgot-password", usersController.forgotPassword);
Router.patch("/reset-password", tokenVerify, usersController.resetPassword);
Router.post("/register", usersController.register);
Router.patch("/verified", tokenVerify, usersController.verification);
Router.put("/profile", tokenVerify, uploadImages, usersController.usersProfile);
Router.patch(
  "/delete-photo-profile",
  tokenVerify,
  usersController.deleteProfile
);
Router.patch("/change-password", tokenVerify, usersController.changePassword);
Router.get(
  "/change-password-step1",
  tokenVerify,
  usersController.changePasswordStep1
);
Router.get("/list-product", userProductController.listProduct);
Router.get("/product-filter", userProductController.productFilterQuery);
Router.get("/product-detail/:id", userProductController.productDetail);

Router.get("/order_search", tokenVerify,
transactionController.getOrderListUserByQuery)
Router.get("/detailorder_search/:idtrx", tokenVerify,
transactionController.getDetailOrderUserByQuery)

module.exports = Router;

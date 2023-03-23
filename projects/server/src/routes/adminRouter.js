const express = require("express");
const Router = express.Router();
const { tokenVerify } = require("../middleware/verifyToken");
const uploadImages = require("../middleware/uploadProduct");
const { adminController } = require("../controllers");
const { productController } = require("../controllers");

// Import All Controller

Router.get("/getDataDashboard", tokenVerify, adminController.getDataDashboard);
Router.get("/getData", tokenVerify, productController.getData);
Router.get("/product", tokenVerify, productController.getProducts);
Router.get("/product_search", tokenVerify, productController.getProductByQuery);
Router.get("/product/:id", tokenVerify, productController.getProductById);
Router.post(
  "/product",
  tokenVerify,
  uploadImages,
  productController.createProduct
);
Router.patch(
  "/product/:id",
  tokenVerify,
  uploadImages,
  productController.updateProduct
);
Router.delete("/product/:id", tokenVerify, productController.deleteProduct);

Router.get('/login', adminController.Login)
Router.get('/keep-login-admin', tokenVerify, adminController.keepLoginAdmin)

module.exports = Router;

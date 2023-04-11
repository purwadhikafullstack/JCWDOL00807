const express = require("express");
const Router = express.Router();
const { tokenVerify } = require("../middleware/verifyToken");
const uploadImages = require("../middleware/uploadProduct");
const { adminController } = require("../controllers");
const { productController } = require("../controllers");
const { transactionController } = require("../controllers");
const {validationAdminBranch, validationRun} = require("../validation/admin")

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
Router.patch(
  "/product-stock/update/:id",
  tokenVerify,
  productController.UpdateStockProduct
);

Router.patch(
  "/product-stock/delete/:id",
  tokenVerify,
  productController.deleteStock
);
Router.get("/product-stock", tokenVerify, productController.getAllStockProduct);
// Admin
Router.get('/login', adminController.Login)
Router.get('/keep-login-admin', tokenVerify, adminController.keepLoginAdmin)
Router.get('/management', tokenVerify, adminController.managementAdmin)
Router.post('/create-admin-branch', tokenVerify, validationAdminBranch, validationRun, adminController.createAdminBranch)
Router.patch('/update-admin-branch', tokenVerify, validationAdminBranch, validationRun, adminController.updateAdminBranch)
Router.delete('/delete-admin-branch', tokenVerify, adminController.deleteAdminBranch )
Router.get('/branch-store', tokenVerify, adminController.getBranchStore)

Router.get("/login", adminController.Login);
Router.get("/keep-login-admin", tokenVerify, adminController.keepLoginAdmin);
Router.get("/getUserVerified", tokenVerify, adminController.getUserVerified);

Router.get(
  "/order_search",
  tokenVerify,
  transactionController.getOrderListByQuery
);
Router.get(
  "/detailorder_search",
  tokenVerify,
  transactionController.getDetailOrderByQuery
);

Router.get(
  "/super_order_search",
  tokenVerify,
  transactionController.getSuperOrderListByQuery
);
Router.get(
  "/super_detailorder_search",
  tokenVerify,
  transactionController.getSuperDetailOrderByQuery
);

module.exports = Router;

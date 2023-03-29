const express = require("express");
const Router = express.Router();
const { tokenVerify } = require("../middleware/verifyToken");
const uploadImages = require("../middleware/uploadProduct");
const { discountController } = require("../controllers");
// Import All Controller

Router.post(
  "/referralcode",
  tokenVerify,
  uploadImages,
  discountController.createReferralVoucher
);
Router.get(
  "/discount_search",
  tokenVerify,
  discountController.getDiscountByQuery
);

Router.get(
  "/voucher_search",
  tokenVerify,
  discountController.getVoucherByQuery
);
Router.get("/getDiscount/:id", tokenVerify, discountController.getDiscountById);
Router.get("/getVoucher/:id", tokenVerify, discountController.getVoucherById);

Router.post("/discount", tokenVerify, discountController.createDiscount);
Router.post(
  "/voucher",
  tokenVerify,
  uploadImages,
  discountController.createVoucher
);
Router.patch("/discount/:id", tokenVerify, discountController.updateDiscount);
Router.patch(
  "/voucher/:id",
  tokenVerify,
  uploadImages,
  discountController.updateVoucher
);
Router.delete("/discount/:id", tokenVerify, discountController.deleteDiscount);
Router.delete("/voucher/:id", tokenVerify, discountController.deleteVoucher);

module.exports = Router;

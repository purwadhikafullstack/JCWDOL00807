const express = require("express");
const Router = express.Router();

const { usersAddressController } = require("../controllers");
const { tokenVerify } = require("../middleware/verifyToken");

Router.post(
  "/create-address",
  tokenVerify,
  usersAddressController.createAddress
);
Router.delete(
  "/remove-address/:id",
  tokenVerify,
  usersAddressController.deleteAddress
);
Router.get("/find-all", tokenVerify, usersAddressController.findAllAddress);
Router.put(
  "/update-address/:id",
  tokenVerify,
  usersAddressController.updateAddress
);

module.exports = Router;

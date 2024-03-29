const usersController = require("./usersController");
const adminController = require("./adminController");
const usersAddressController = require("./usersAddressController");
const rajaongkirController = require("./rajaOngkirController");
const geoLocationController = require("./geoLocationController");
const categoriesProductController = require("./categoriesProductController");
const productController = require("./productController");
const discountController = require("./discountController");
const userProductController = require("./userProductController");
const transactionController = require("./transactionController");
const cartController = require("./cartController");
const userTransactionController = require("./userTransactionController");

module.exports = {
  usersController,
  usersAddressController,
  rajaongkirController,
  geoLocationController,
  adminController,
  categoriesProductController,
  productController,
  discountController,
  userProductController,
  transactionController,
  cartController,
  userTransactionController,
};

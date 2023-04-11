const usersRouter = require("./usersRouter");
const adminRouter = require("./adminRouter");
const usersAddressRouter = require("./usersAddressRouter");
const rajaOngkirRouter = require("./rajaOngkirRouter");
const geoLocationRouter = require("./geoLocationRouter");
const categoriesProductRouter = require("./categoriesProductRouter");
const discountRouter = require("./discountRouter");
const cartRouter = require("./cartRouter");
const userTransactionRouter = require("./userTransactionRouter");
const orderListRouter = require("./orderListRouter");

module.exports = {
  usersRouter,
  usersAddressRouter,
  rajaOngkirRouter,
  geoLocationRouter,
  adminRouter,
  categoriesProductRouter,
  discountRouter,
  cartRouter,
  userTransactionRouter,
  orderListRouter,
};

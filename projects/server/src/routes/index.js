const usersRouter = require("./usersRouter");
const adminRouter = require("./adminRouter");
const usersAddressRouter = require("./usersAddressRouter");
const rajaOngkirRouter = require("./rajaOngkirRouter");
const geoLocationRouter = require("./geoLocationRouter");
const categoriesProductRouter = require("./categoriesProductRouter");
const discountRouter = require("./discountRouter");
const orderListRouter = require("./orderListRouter")

module.exports = {
  usersRouter,
  usersAddressRouter,
  rajaOngkirRouter,
  geoLocationRouter,
  adminRouter,
  categoriesProductRouter,
  discountRouter,
  orderListRouter
};

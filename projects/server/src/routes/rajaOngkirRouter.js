const express = require("express");
const Router = express.Router();

const { rajaongkirController } = require("../controllers");

Router.get("/province", rajaongkirController.getProvince);
Router.get("/city", rajaongkirController.getCity);

module.exports = Router;

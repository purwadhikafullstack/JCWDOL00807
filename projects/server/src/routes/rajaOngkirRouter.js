const express = require("express");
const Router = express.Router();

const { rajaongkirController } = require("../controllers");

Router.get("/province", rajaongkirController.getProvince);
Router.get("/city", rajaongkirController.getCity);
Router.post("/cost", rajaongkirController.getCost);
Router.get("/getorigin", rajaongkirController.getOriginByBranchStore);
Router.get("/getcity", rajaongkirController.getCityAddress);
Router.post('/destination/:user_id', rajaongkirController.getDestinationByAddress);

module.exports = Router;

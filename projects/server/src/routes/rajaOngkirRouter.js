const express = require("express");
const Router = express.Router();

const { rajaongkirController } = require("../controllers");

Router.get("/province", rajaongkirController.getProvince);
Router.get("/city", rajaongkirController.getCity);
Router.post("/cost", rajaongkirController.getCost);
Router.get("/getorigin", rajaongkirController.getOriginByBranchStore);

module.exports = Router;

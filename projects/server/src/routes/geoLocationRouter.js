const express = require("express");
const Router = express.Router();

const { geoLocationController } = require("../controllers");

Router.get("/coordinate", geoLocationController.getCoordinate);

module.exports = Router;

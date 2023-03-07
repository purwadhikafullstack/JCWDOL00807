const express = require("express");
const Router = express.Router();

const { usersController } = require("../controllers");
const { tokenVerify } = require("../middleware/verifyToken");

Router.get("/login", usersController.login);
Router.get("/keep-login", tokenVerify, usersController.keepLogin);

module.exports = Router;

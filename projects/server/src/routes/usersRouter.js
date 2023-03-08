const express = require("express");
const Router = express.Router();
const { tokenVerify } = require("../middleware/verifyToken");
const { usersController } = require("../controllers");
// Import All Controller

Router.get("/login", usersController.login);
Router.get("/keep-login", tokenVerify, usersController.keepLogin);
Router.post("/register", usersController.register);
Router.patch("/verified", tokenVerify, usersController.verification);

module.exports = Router;

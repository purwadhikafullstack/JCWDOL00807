const express = require("express");
const Router = express.Router();

const { usersController } = require("../controllers");
const { tokenVerify } = require("../middleware/verifyToken");

Router.get("/login", usersController.login);
Router.get("/keep-login", tokenVerify, usersController.keepLogin);
Router.post("/forgot-password", usersController.forgotPassword);
Router.patch("/reset-password", tokenVerify, usersController.resetPassword);

module.exports = Router;

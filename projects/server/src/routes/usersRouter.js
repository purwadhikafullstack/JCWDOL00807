const express = require("express");
const Router = express.Router();
const { tokenVerify } = require("../middleware/verifyToken");
const uploadImages = require("../middleware/upload");
const { usersController } = require("../controllers");

// Import All Controller

Router.get("/login", usersController.login);
Router.get("/keep-login", tokenVerify, usersController.keepLogin);
Router.post("/forgot-password", usersController.forgotPassword);
Router.patch("/reset-password", tokenVerify, usersController.resetPassword);
Router.post("/register", usersController.register);
Router.patch("/verified", tokenVerify, usersController.verification);
Router.put("/profile", tokenVerify, uploadImages, usersController.usersProfile);
Router.patch(
  "/delete-photo-profile",
  tokenVerify,
  usersController.deleteProfile
);




module.exports = Router;

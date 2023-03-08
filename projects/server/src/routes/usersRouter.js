const express = require("express");
const Router = express.Router();
const { tokenVerify } = require("../middleware/verifyToken");
// Import All Controller
const { usersControllers } = require("../controllers"); // Akan otomatis mengambil file index.js nya

Router.post("/register", usersControllers.register);
Router.patch("/verified", tokenVerify, usersControllers.verification);

module.exports = Router;

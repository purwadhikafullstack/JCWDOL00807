const express = require("express");
const Router = express.Router();
const { tokenVerify } = require("../middleware/verifyToken");

const { categoriesProductController } = require("../controllers");

Router.post(
  "/products",
  tokenVerify,
  categoriesProductController.createCategories
);
Router.post("/temp", categoriesProductController.temporary);
Router.patch(
  "/products/update/:id",
  tokenVerify,
  categoriesProductController.updateCategory
);
Router.delete(
  "/products/delete/:id",
  tokenVerify,
  categoriesProductController.deleteCategory
);
Router.get(
  "/find-all",
  tokenVerify,
  categoriesProductController.findAllCategory
);

module.exports = Router;

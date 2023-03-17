const express = require("express");
const Router = express.Router();
const { tokenVerify } = require("../middleware/verifyToken");

const { categoriesProductController } = require("../controllers");

Router.post(
  "/categories",
  tokenVerify,
  categoriesProductController.createCategories
);
Router.post("/temp", categoriesProductController.temporary);
Router.patch(
  "/categories/update/:id",
  tokenVerify,
  categoriesProductController.updateCategory
);
Router.delete(
  "/categories/delete/:id",
  tokenVerify,
  categoriesProductController.deleteCategory
);

module.exports = Router;

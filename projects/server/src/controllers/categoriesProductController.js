const { sequelize } = require("../models");
const { Op } = require("sequelize");

// import model
const db = require("../models/index");
const products_categories = db.product_categories;
const admins = db.admins;

// // import JWT
const { createToken } = require("./../lib/jwt");

module.exports = {
  createCategories: async (req, res) => {
    try {
      const id = req.dataToken.id;
      const { name } = req.body;

      const findAdmin = await admins.findOne({
        where: { id },
      });
      if (
        findAdmin.dataValues.role !== "admin branch" ||
        findAdmin.dataValues.isActive === false
      )
        throw { message: "Unauthorization" };
      if (!name) throw { message: "Data not complete" };

      const isExist = await products_categories.findOne({
        where: { name },
      });
      if (isExist) {
        throw { message: "Product category already exists" };
      }

      await products_categories.create({
        name: name,
      });

      res.status(201).send({
        isSuccess: true,
        message: "Create product categories success",
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const admin_id = req.dataToken.id;
      const { name } = req.body;
      const { id } = req.params;

      const findAdmin = await admins.findOne({
        where: { id: admin_id },
      });
      if (
        findAdmin.dataValues.role !== "admin branch" ||
        findAdmin.dataValues.isActive === false
      )
        throw { message: "Unauthorization" };
      if (!name) throw { message: "Data not complete" };

      const isExistCategory = await products_categories.findOne({
        where: { id },
      });
      if (isExistCategory === null)
        throw { message: "Category selected not found" };

      const isExist = await products_categories.findOne({
        where: { name, id: { [Op.not]: id } },
      });
      if (isExist) {
        throw { message: "Product category already exists" };
      }

      await products_categories.update(
        {
          name,
        },
        { where: { id } }
      );

      res.status(200).send({
        isSuccess: false,
        message: "Update category product success",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const admin_id = req.dataToken.id;
      const { id } = req.params;

      const findAdmin = await admins.findOne({
        where: { id: admin_id },
      });
      if (
        findAdmin.dataValues.role !== "admin branch" ||
        findAdmin.dataValues.isActive === false
      )
        throw { message: "Unauthorization" };

      const isExistCategory = await products_categories.findOne({
        where: { id },
      });
      if (isExistCategory === null)
        throw { message: "Category selected not found" };

      await products_categories.destroy({
        where: { id },
      });
      res.status(200).send({
        isSuccess: false,
        message: "Delete category product success",
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },

  temporary: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(email, password);
      const findAdmin = await admins.findOne({
        where: { email },
      });
      if (findAdmin === null) throw { message: "admin not found" };

      console.log(findAdmin);

      token = createToken({ id: findAdmin.dataValues.id });
      res.status(200).send({
        isSuccess: true,
        message: "login success",
        token: token,
      });
    } catch (error) {
      console.log(error);
    }
  },
};

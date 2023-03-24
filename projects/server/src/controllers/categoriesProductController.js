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
      const { admins_id: id, role, isActive } = req.dataToken;
      const { name } = req.body;

      if (role !== "admin branch" || isActive === false)
        throw { message: "Unauthorization" };

      if (!name) throw { message: "Data not complete" };

      const isExist = await products_categories.findOne({
        where: { name },
      });
      if (isExist) {
        throw { message: "Input field already exists" };
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
      const { admins_id: admin_id, role, isActive } = req.dataToken;

      const { name } = req.body;
      const { id } = req.params;

      if (role !== "admin branch" || isActive === false)
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
      const { admins_id: admin_id, role, isActive } = req.dataToken;

      const { id } = req.params;

      if (role !== "admin branch" || isActive === false)
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
  findAllCategory: async (req, res) => {
    try {
      const { admins_id: admin_id, role, isActive } = req.dataToken;

      if (role !== "admin branch" || isActive === false)
        throw { message: "Unauthorization" };

      const getAllData = await products_categories.findAll({
        attributes: [
          "id",
          "name",
          [
            sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%y-%m-%d"),
            "createdAt",
          ],
          [
            sequelize.fn("DATE_FORMAT", sequelize.col("updatedAt"), "%y-%m-%d"),
            "updatedAt",
          ],
        ],
        order: [["id", "DESC"]],
      });
      res.status(200).send({
        isSuccess: true,
        data: getAllData,
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

      token = createToken({
        admins_id: findAdmin.dataValues.id,
        name: findAdmin.dataValues.name,
        email: findAdmin.dataValues.email,
        role: findAdmin.dataValues.role,
        isActive: findAdmin.dataValues.isActive,
      });
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

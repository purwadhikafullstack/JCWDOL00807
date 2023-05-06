const { sequelize } = require("../models");
const { Op } = require("sequelize");

// import model
const db = require("../models/index");
const products_categories = db.product_categories;
const admins = db.admins;

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
      let { search, sort } = req.query;

      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 0;
      const offset = limit * page;

      if (role !== "admin branch" || isActive === false)
        throw { message: "Unauthorization" };

      let order;
      let inputSearch;
      if (sort === "asc") {
        order = [["name", "DESC"]];
      } else if (sort === "desc") {
        order = [["name", "asc"]];
      } else {
        order = [["id", "DESC"]];
      }

      if (search) {
        inputSearch = { name: { [Op.substring]: search } };
      }

      const { count } = await products_categories.findAndCountAll({
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
        where: { name: { [Op.substring]: search } },
        order: order,
      });

      let totalPages = Math.ceil(count / limit);

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
        where: inputSearch,

        order: order,
        limit: limit,
        offset: offset,
      });

      res.status(200).send({
        isSuccess: true,
        data: getAllData,
        count,
        page,
        totalPages,
        limit,
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
};

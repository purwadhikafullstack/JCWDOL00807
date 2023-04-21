const { sequelize } = require("./../models");
const { Op } = require("sequelize");
const fs = require("fs").promises;

//import env
require("dotenv").config();

// import model
const db = require("./../models/index");
const users = db.users;
const transactions = db.transactions;
const transaction_details = db.transaction_details;

const getOffset = (page = 1, limit = 10) => {
  return (page - 1) * limit;
};

module.exports = {
  OrderList: async (req, res) => {
    try {
      let { _page, _limit, _search } = req.query;
      const page = parseInt(_page);
      const limit = parseInt(_limit);
      const offset = getOffset(page, limit);
      const findOrderList = await transactions.findAll({
        where: {
          status: {
            [Op.like]: `%${_search}%`,
          },
        },
        include: [
          {
            model: users,
            attributes: ["name"],
          },
        ],
        offset,
        limit,
        order: [["createdAt", "DESC"]],
      });

      const listOrder = await transactions.findAll({
        where: {
          status: {
            [Op.like]: `%${_search}%`,
          },
        },
      });

      res.status(200).send({
        isSuccess: true,
        message: "get Order List Success",
        data: {
          totalRecord: listOrder.length,
          totalReturn: findOrderList.length,
          searchText: _search,
          contents: findOrderList,
        },
      });
      // console.log(findAdmin.dataValues)
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
};

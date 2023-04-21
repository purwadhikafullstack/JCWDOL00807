const { sequelize } = require("../models");
const { Op, DATEONLY } = require("sequelize");

// import model
const db = require("./../models/index");
const users = db.users;
const transactions = db.transactions;

// import helper
const differentTime = require("../helper/differentTime");

module.exports = {
  userTransaction: async (req, res) => {
    try {
      const id = req.dataToken.id;
      if (!id)
        throw {
          message:
            "Unauthorization, please register or login for continue transaction",
        };
      const userExist = await users.findOne({
        where: { id },
      });

      if (userExist === null)
        throw {
          message:
            "Unauthorization, please register or login for continue transaction",
        };

      // nanti nulis code lanjutannya disini yaa  terus buat response si successnya bisa di ubah ya kalo responnya error nya mah gapapa gitu aja juga

      res.status(200).send({
        isSuccess: true,
        message: "add to transactions",
      });
    } catch (error) {
      res.status(404).send({
        isSuccess: false,
        message: "Unauthorization",
      });
    }
  },
  CancelOrderByUser: async (req, res) => {
    try {
      const userId = req.dataToken.id;
      const { transactionId, cancellation_reasons } = req.query;

      if (!userId)
        throw {
          message:
            "Unauthorization, please register or login for continue transaction",
        };
      const userExist = await users.findOne({
        where: { id: userId },
      });

      if (userExist === null)
        throw {
          message:
            "Unauthorization, please register or login for continue transaction",
        };

      const statusTransaction = await transactions.findOne({
        where: { [Op.and]: [{ id: transactionId }, { users_id: userId }] },
      });

      if (statusTransaction === null)
        throw {
          message:
            "Sorry, we couldn't find a transaction record that matches your request.",
        };

      if (
        statusTransaction.dataValues.status !==
          "Waiting For Confirmation Payment" &&
        statusTransaction.dataValues.status !== "Waiting For Payment"
      )
        throw {
          message: `Sorry, Your request can only be accepted while it is in the waiting payment status or Waiting For Confirmation Payment status `,
        };

      if (!cancellation_reasons)
        throw {
          message: "Please provide a cancellation reason for your request",
        };

      await transactions.update(
        {
          status: "Canceled",
          cancellation_reasons,
        },
        { where: { [Op.and]: [{ id: transactionId }, { users_id: userId }] } }
      );

      res.status(200).send({
        isSuccess: true,
        message: "Your order has been canceled",
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  cancelOrderBySistem: async (req, res) => {
    try {
      const id = req.dataToken.id;
      let checkStatusOrder = await transactions.findAll({
        where: {
          [Op.and]: [{ users_id: id }, { status: "Waiting For Payment" }],
        },
      });

      if (checkStatusOrder.length === 0)
        throw {
          message: `Status Waiting For Payment does not exist for the user in question`,
        };

      const transaction_id = [];
      checkStatusOrder.forEach((val) => {
        const diffHours = differentTime(val.createdAt);
        if (diffHours > 24) {
          transaction_id.push(val.id);
        }
      });

      await transactions.update(
        { status: "Canceled" },
        { where: { id: transaction_id } }
      );

      res.status(200).send({
        isSuccess: true,
        message: "Cancel Order By Sistem Success",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
};

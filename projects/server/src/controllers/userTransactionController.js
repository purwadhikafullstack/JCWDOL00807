const { sequelize } = require("../models");
const { Op, DATEONLY } = require("sequelize");

// import model
const db = require("./../models/index");
const users = db.users;
const transactions = db.transactions;
const transaction = db.transactions;
const admin = db.admins;
const transaction_detail = db.transaction_details;
const carts = db.carts;
const item_products = db.item_products;
const historyLog = db.stock_history_logs;

// import helper
const differentTime = require("../helper/differentTime");

module.exports = {
  userTransaction: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const userid = req.dataToken.id;
      const {
        detailOrder,
        grandtotal,
        branch_name,
        branch_id,
        products_id,
        isFromCart,
      } = req.body;

      console.log(detailOrder);
      if (!userid)
        throw {
          message:
            "Unauthorization, please register or login for continue transaction",
        };
      const userExist = await users.findOne({
        where: { id: userid },
      });

      if (userExist === null)
        throw {
          message:
            "Unauthorization, please register or login for continue  add product to cart",
        };
      var d = new Date();
      d.setDate(d.getDate() + 1);
      // Get the individual date and time components
      var year = d.getFullYear();
      var month = ("0" + (d.getMonth() + 1)).slice(-2);
      var day = ("0" + d.getDate()).slice(-2);
      var hours = ("0" + d.getHours()).slice(-2);
      var minutes = ("0" + d.getMinutes()).slice(-2);
      var seconds = ("0" + d.getSeconds()).slice(-2);

      // Concatenate the date and time components into a formatted string
      var formattedDate =
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;

      const insert = await transaction.create(
        {
          branch_store: branch_name,
          total_price: grandtotal,
          status: "Waiting For Payment",
          expired_date: formattedDate,
          users_id: userid,
        },
        { transaction: t }
      );

      const transactions_id = insert.id;
      const newMap = detailOrder.map((item) => {
        return { ...item, transactions_id };
      });
      await transaction_detail.bulkCreate(newMap, { transaction: t });

      // loop for update qty
      for (let index = 0; index < newMap.length; index++) {
        await item_products.update(
          {
            stock: sequelize.literal(`stock - ${newMap[index].qty}`),
          },
          {
            where: {
              name: {
                [Op.eq]: newMap[index].product_name,
              },
            },
            transaction: t,
          }
        );
      }

      if (isFromCart) {
        // looping for delete cart
        for (let index = 0; index < products_id.length; index++) {
          await carts.destroy({
            where: {
              users_id: {
                [Op.eq]: userid,
              },
              item_products_id: {
                [Op.eq]: products_id[index].product_id,
              },
              branch_stores_id: {
                [Op.eq]: branch_id,
              },
            },
            transaction: t,
          });
        }
      }

      await t.commit();
      res.status(200).send({
        isSuccess: true,
        message: "Add order is success",
        data: insert,
      });
    } catch (error) {
      res.status(404).send({
        isSuccess: false,
        message: error,
      });
    }
  },

  uploadPaymentProof: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const userid = req.dataToken.id;
      const { id_transaction } = req.body;
      let proofImage = req.files.images;
      let imagePath = proofImage[0].path;
      console.log(proofImage);
      console.log(imagePath);

      if (!userid)
        throw {
          message:
            "Unauthorization, please register or login for continue  add product to cart",
        };
      const userExist = await users.findOne({
        where: { id: userid },
      });

      if (userExist === null)
        throw {
          message:
            "Unauthorization, please register or login for continue transaction",
        };

      await transaction.update(
        { payment_proof: imagePath, status: "Ongoing" },
        {
          where: {
            id: {
              [Op.eq]: id_transaction,
            },
          },
        },
        { transaction: t }
      );

      await t.commit();
      res.status(200).send({
        isSuccess: true,
        message: "update orders is success",
        data: await transaction.findOne({
          where: { id: { [Op.eq]: id_transaction } },
        }),
      });
    } catch (error) {
      res.status(404).send({
        isSuccess: false,
        message: error,
      });
    }
  },
  CancelOrderByUser: async (req, res) => {
    try {
      const userId = req.dataToken.id;
      const { branchId } = req.query;
      const { branchStore } = req.query;
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

      if (statusTransaction.dataValues.status !== "Waiting For Payment")
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

      const updateStockProduct = await transaction_detail.findAll({
        attributes: ["product_name", "qty"],
        where: { transactions_id: transactionId },
      });

      updateStockProduct.map(async (val) => {
        await item_products.update(
          {
            stock: sequelize.literal(`stock + ${val.qty}`),
          },
          {
            where: {
              name: val.product_name,
              branch_stores_id: branchId,
            },
          }
        );
      });

      const historyLogData = updateStockProduct.map((val) => {
        return {
          admin_name: "none",
          branch_store: branchStore,
          product_name: val.product_name,
          qty: val.qty,
          description: `Cancel order by User : ${cancellation_reasons}`,
        };
      });

      await historyLog.bulkCreate(historyLogData);

      await res.status(200).send({
        isSuccess: true,
        message: "Your order has been canceled",
      });

      // const name = transactionDetail.map((val) => {
      //   return val.product_name;
      // });

      // const previousQty = await item_products.findAll({
      //   attributes: ["stock"],
      //   where: { name, branch_stores_id: branchId },
      // });

      // const stockMapping = previousQty.map((val) => {
      //   return val.stock;
      // });

      // const newstock = transactionDetail.map((val)=>{
      //   return val.q
      // })

      // const stock = transactionDetail.map((val) => {
      //   return val.;
      // });

      //       const updates = transactionDetail.map((val) => {
      //   return {
      //     where: { name: val.product_name },
      //     changes: { stock: sequelize.literal(`stock + ${val.qty}`) },
      //   };
      // });

      // await item_products.bulkCreate([update], {
      //   updateOnDuplicate: ["stock"],
      // });

      // await historyLog.bulkCreate(
      //   {
      //     admin_name: none,
      //     branch_store: newData.dataValues.branch,
      //     product_name: newData.dataValues.name,
      //     qty: stock,
      //     description: `Update : ${description}`,
      //   },
      //   { transaction: t }
      // );
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  cancelOrderBySistem: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const id = req.dataToken.id;
      const { branchId, branchStore } = req.query;

      let checkStatusOrder = await transactions.findAll(
        {
          where: {
            [Op.and]: [{ users_id: id }, { status: "Waiting For Payment" }],
          },
        },
        { transaction: t }
      );

      if (checkStatusOrder.length === 0)
        throw {
          message: `Status Waiting For Payment does not exist for the user in question`,
        };

      const transaction_id = [];
      checkStatusOrder.forEach(
        (val) => {
          const diffHours = differentTime(val.createdAt);
          if (diffHours > 24) {
            transaction_id.push(val.id);
          }
        },
        { transaction: t }
      );

      await transactions.update(
        { status: "Canceled" },
        { where: { id: transaction_id } },
        { transaction: t }
      );

      const updateStockProduct = await transaction_detail.findAll(
        {
          attributes: ["product_name", "transactions_id", "qty"],
          where: { transactions_id: transaction_id },
        },
        { transaction: t }
      );

      console.log(updateStockProduct);

      updateStockProduct.map(
        async (val) => {
          console.log(val.qty);
          await item_products.update(
            {
              stock: sequelize.literal(`stock + ${val.qty}`),
            },
            {
              where: {
                name: val.product_name,
                branch_stores_id: branchId,
              },
            }
          );
        },
        { transaction: t }
      );

      // const temp = updateStockProduct.map((val) => {
      //   return val.product_name;
      // });
      // const result = await item_products.findAll({
      //   where: { name: temp, branch_stores_id: branchId },
      // });

      // const jakartaPusat = await item_products.findAll({
      //   where: { name: temp, branch_stores_id: 1 },
      // });

      // const jakartaBarat = await item_products.findAll({
      //   where: { name: temp, branch_stores_id: 2 },
      // });

      const historyLogData = updateStockProduct.map(
        (val) => {
          return {
            admin_name: "none",
            branch_store: branchStore,
            product_name: val.product_name,
            qty: val.qty,
            description: `Cancel order by sistem `,
          };
        },
        { transaction: t }
      );

      await historyLog.bulkCreate(historyLogData, { transaction: t });
      await t.commit();
      res.status(200).send({
        isSuccess: true,
        message: "Cancel Order By Sistem Success",
        data: result,
        // jakartaPusat: jakartaPusat,
        // jakartaBarat: jakartaBarat,
        // updateStockProduct,
      });
    } catch (error) {
      await t.rollback();
      console.log(error);
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
};

const { sequelize } = require("../models");
const { Op } = require("sequelize");

// import model
const db = require("./../models/index");
const users = db.users;
const transaction = db.transactions;
const admin = db.admins;
const transaction_detail = db.transaction_details;
const carts = db.carts;
const item_products = db.item_products;

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
            "Unauthorization, please register or login for continue  add product to cart",
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
      const newMap = detailOrder.map((item) => {
        return { ...item, transactions_id: insert.id };
      });
      await transaction_detail.bulkCreate(newMap, { transaction: t });

      // loop for update qty
      for (let index = 0; index < newMap.length; index++) {
        await item_products.update(
          {
            qty: sequelize.literal(`qty - ${newMap[index].qty}`), // <---- HERE
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
            "Unauthorization, please register or login for continue  add product to cart",
        };

      await transaction.update(
        { payment_proof: imagePath,
          status: "Ongoing"
         },
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
};

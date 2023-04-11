const { sequelize } = require("../models");
const { Op } = require("sequelize");

// import model
const db = require("./../models/index");
const users = db.users;

module.exports = {
  cart: async (req, res) => {
    try {
      const id = req.dataToken.id;
      if (!id)
        throw {
          message:
            "Unauthorization, please register or login for continue  add product to cart",
        };
      const userExist = await users.findOne({
        where: { id },
      });

      if (userExist === null)
        throw {
          message:
            "Unauthorization, please register or login for continue  add product to cart",
        };

      // nanti nulis code lanjutannya disini yaa  terus buat response si successnya bisa di ubah ya kalo responnya error nya mah gapapa gitu aja juga

      res.status(200).send({
        isSuccess: true,
        message: "add to cart",
      });
    } catch (error) {
      res.status(404).send({
        isSuccess: false,
        message: "Unauthorization",
      });
    }
  },
};

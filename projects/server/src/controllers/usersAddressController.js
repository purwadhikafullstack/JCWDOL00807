const { sequelize } = require("./../models");
const { Op } = require("sequelize");

// import model
const db = require("./../models/index");
const user_address = db.user_address;

module.exports = {
  createAddress: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      const id = req.dataToken.id;
      console.log(req.body);

      const {
        street_address,
        city,
        province,
        postal_code,
        country,
        latitude,
        longitude,
        recipient,
        recipients_phone,
      } = req.body;

      console.log(req.body);

      if (
        !street_address ||
        !city ||
        !province ||
        !postal_code ||
        !country ||
        !latitude ||
        !longitude ||
        !recipient ||
        !recipients_phone
      )
        throw {
          message: "your data not complete",
        };

      if (re.test(recipients_phone) === false)
        throw { message: "your phone number not valid" };

      let userAddress = await user_address.findOne({
        where: { [Op.and]: [{ isDefault: true }, { users_id: id }] },
      });
      console.log(userAddress);

      await user_address.create(
        {
          street_address,
          city,
          province,
          postal_code,
          country,
          latitude,
          longitude,
          recipient,
          recipients_phone,
          users_id: id,
          isDefault: !userAddress,
        },
        { transaction: t }
      );

      await t.commit();
      res.status(201).send({
        isSuccess: true,
        message: "Create new address success",
      });
    } catch (error) {
      console.log(error);
      await t.rollback();
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  deleteAddress: async (req, res) => {
    try {
      const { id } = req.params;
      const users_id = req.dataToken.id;

      let isPrimaryAddress = await user_address.findOne({
        where: {
          [Op.and]: [{ isDefault: true }, { users_id: users_id }, { id: id }],
        },
      });

      if (isPrimaryAddress) throw { message: "Cannot remove primary address" };

      console.log(isPrimaryAddress);

      await user_address.destroy({
        where: { [Op.and]: [{ id }, { users_id }] },
      });

      res.status(200).send({
        isSuccess: true,
        message: "delete user address success",
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  findAllAddress: async (req, res) => {
    try {
      const id = req.dataToken.id;
      console.log(id);
      const getAllUserAddress = await user_address.findAll({
        where: { users_id: id },
        order: [["isDefault", "DESC"]],
      });

      res.status(200).send({
        isSuccess: true,
        data: getAllUserAddress,
      });
    } catch (error) {
      res.status(200).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  updateAddress: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      const { id } = req.params;
      const users_id = req.dataToken.id;
      console.log(users_id);
      console.log(req.body);
      const {
        street_address,
        city,
        province,
        postal_code,
        country,
        latitude,
        longitude,
        recipient,
        recipients_phone,
        isDefault,
      } = req.body;

      if (
        !street_address ||
        !city ||
        !province ||
        !postal_code ||
        !country ||
        !latitude ||
        !longitude ||
        !recipient ||
        !recipients_phone
      )
        throw { message: "data not complete" };
      if (!re.test(recipients_phone))
        throw { message: "your phone number not valid" };

      const isDefaultExist = await user_address.findOne(
        {
          where: {
            [Op.and]: [
              { isDefault: true },
              { users_id: users_id },
              { id: { [Op.not]: id } },
            ],
          },
        },
        { transaction: t }
      );

      if (isDefaultExist === null && isDefault === false)
        throw {
          message:
            "Cannot change the primary address, because if you change you don't have the primary address",
        };

      await user_address.update(
        {
          street_address,
          city,
          province,
          postal_code,
          country,
          latitude,
          longitude,
          recipient,
          recipients_phone,
          isDefault,
        },
        { where: { [Op.and]: [{ id }, { users_id }] } },
        { transaction: t }
      );

      if (isDefault === true) {
        await user_address.update(
          {
            isDefault: false,
          },
          {
            where: {
              [Op.and]: [{ users_id: users_id }, { id: { [Op.not]: id } }],
            },
          },
          { transaction: t }
        );
      }

      await t.commit();
      res.status(200).send({
        isSuccess: true,
        message: "update address success",
        data: isDefaultExist,
      });
    } catch (error) {
      await t.rollback();
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
};

// import sequelize
const { sequelize } = require("./../models");
const { Op } = require("sequelize");

// import model
const db = require("./../models/index");
const users = db.users;

// // Import hashing
const { hashPassword, hashMatch } = require("./../lib/hash");

// // import JWT
const { createToken } = require("./../lib/jwt");

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.query;
      let regxEmail = /\S+@\S+\.\S+/;

      if (!email || !password) throw { message: "data not complite" };
      if (!regxEmail.test(email)) throw { message: "not valid email" };

      const findUser = await users.findOne({
        where: { email },
      });

      if (findUser === null) throw { message: "email not found" };

      const matchPassword = await hashMatch(
        password,
        findUser.dataValues.password
      );

      if (matchPassword === false) throw { message: "your password incorect" };

      if (findUser.dataValues.status === "unverified")
        throw { message: "please verified your account" };

      token = createToken({ id: findUser.dataValues.id });

      res.status(200).send({
        isSuccess: true,
        message: "login success",
        name: findUser.dataValues.name,
        token: token,
      });
    } catch (error) {
      res.status(404).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  keepLogin: async (req, res) => {
    try {
      let id = req.dataToken.id;
      const findUser = await users.findOne({
        attributes: { exclude: "password" },
        where: {
          id: id,
        },
      });

      res.status(200).send({
        isSuccess: true,
        message: "getData User Login Success",
        data: findUser.dataValues,
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
};

// import sequelize
const { sequelize } = require("./../models");
const { Op } = require("sequelize");
const transporter = require("../lib/nodemailer");
const handlebars = require("handlebars");
const fs = require("fs").promises;

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
      const regxEmail = /\S+@\S+\.\S+/;

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
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const regxEmail = /\S+@\S+\.\S+/;
      if (!regxEmail.test(email)) {
        throw { message: "not valid email" };
      }

      const findUser = await users.findOne({
        where: { email },
      });
      console.log(findUser === null);

      let token = "";
      let names = "";

      if (findUser === null) {
        token = null;
        names = null;
      } else {
        token = createToken({ id: findUser?.dataValues?.id });
        names = findUser.dataValues.name;
      }

      //mengirimkan link password new password
      let template = await fs.readFile(
        "/Users/aisyahalghifari/Documents/GitHub/JCWDOL00807/projects/server/src/template/email.html",
        "utf-8"
      );
      let compiledTemplate = await handlebars.compile(template);
      let newTemplate = compiledTemplate({
        name: names,
        token: token,
      });

      let mail = {
        from: `Admin <alghifariaisyahputri@gmail.com>`,
        to: `${email}`,
        subject: "Reset Password",
        html: newTemplate,
      };

      transporter.sendMail(mail, (err, resMail) => {
        res.status(201).send({
          isSuccess: true,
          message: `We send a link to your email, so you can get back your account`,
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  resetPassword: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const id = req.dataToken.id;
      const { password, repeatPassword } = req.query;

      let regxPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/;

      if (!password || !repeatPassword) throw { message: "data not complete" };
      if (password !== repeatPassword)
        throw { message: "password and repeat password not match" };
      if (!regxPassword.test(password))
        throw {
          message:
            "Password must be contains number and alphabet with minimum 6 character and maximum 12 character",
        };

      await users.update(
        {
          password: await hashPassword(password),
        },
        { where: { id: id } },
        { transaction: t }
      );

      await t.commit();
      res.status(201).send({
        isSuccess: true,
        message: "your password has been update",
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

// import sequelize
const { sequelize } = require("./../models");
const { Op } = require("sequelize");
const transporter = require("../lib/nodemailer");
const handlebars = require("handlebars");
const fs = require("fs").promises;
const deleteFiles = require("../helper/deleteFile");
const generateUrl = require("../helper/generateUrl");

//import env
require("dotenv").config();

// import model
const db = require("./../models/index");
const users = db.users;

// // Import hashing
const { hashPassword, hashMatch } = require("./../lib/hash");

// // import JWT
const { createToken } = require("./../lib/jwt");

//Import generateOTP and generate Referral code
const { generateOTP } = require("./../lib/generateOTP");
const { generateRef } = require("./../lib/generateRef");

//Import ValidatePhoneNumber
const validatePhoneNumber = require("./../lib/validatePhoneNumber");

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.query;
      const regxEmail = /\S+@\S+\.\S+/;

      if (!email || !password)
        throw {
          message: "Incomplete data. Please fill in missing information.",
        };
      if (!regxEmail.test(email))
        throw {
          message: "The email address you entered is not valid.",
        };

      const findUser = await users.findOne({
        where: { email },
      });
      if (findUser === null)
        throw {
          message: "Couldn't find the email you entered ",
        };
      const matchPassword = await hashMatch(
        password,
        findUser.dataValues.password
      );
      console.log(matchPassword);

      if (matchPassword === false)
        throw { message: "Password you entered is incorrect" };
      if (findUser.dataValues.status === "Unverified")
        throw {
          message:
            "Your account has not yet been verified. Please check your email",
        };

      let image = "";
      if (findUser.dataValues.image) {
        image = generateUrl(findUser.dataValues.image);
      }
      token = createToken({ id: findUser.dataValues.id });
      res.status(200).send({
        isSuccess: true,
        name: findUser.dataValues.name,
        image: image,
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
        attributes: [
          "name",
          "email",
          "phone_number",
          "referral_code",
          "image",
          "gender",
          "otp",
          "status",
          [
            sequelize.fn("DATE_FORMAT", sequelize.col("birthdate"), "%Y-%m-%d"),
            "birthdate",
          ],
        ],
        where: {
          id: id,
        },
      });

      let image = "";
      if (findUser.dataValues.image) {
        image = generateUrl(findUser.dataValues.image);
      }

      delete findUser.dataValues.image;
      findUser.dataValues.image = image;

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
      let reactUrl = process.env.REACT_APP_BASE_URL;

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

      // //mengirimkan link password new password
      let template = await fs.readFile(
        "./template/resetPassword.html",
        "utf-8"
      );
      let compiledTemplate = await handlebars.compile(template);
      let newTemplate = compiledTemplate({
        name: names,
        token: token,
        reactUrl: reactUrl,
      });

      let mail = {
        from: `Admin-GoKu<berakinside1996@gmail.com>`,
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

      if (!password || !repeatPassword)
        throw {
          message: "Incomplete data. Please fill in missing information.",
        };
      if (password !== repeatPassword)
        throw {
          message:
            "Password and repeat password do not match. Please make sure they are the same.",
        };
      if (!regxPassword.test(password))
        throw {
          message:
            "Please choose a password that contains both letters and numbers, and is between 6 and 12 character.",
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
        message: "Your password has been updated",
      });
    } catch (error) {
      await t.rollback();
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },

  register: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      let { name, email, password, phone_number, ref_code } = req.body;
      //1. Email divalidasi melalui isEmail dan disini
      let validasiEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (validasiEmail.test(email) === false) {
        return res.status(404).send({
          isError: true,
          message: "Email is invalid",
          data: null,
        });
      }
      //2. Validasi Password (6-12 karakter)
      let validasiPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/;
      if (!password.match(validasiPassword)) {
        return res.status(404).send({
          isError: true,
          message:
            "Password must be contains number and alphabet with minimum 6 character and maximum 12 character",
          data: null,
        });
      }
      //3. Validasi phone_number
      if (validatePhoneNumber == true) {
        return res.status(404).send({
          isError: true,
          message: "Phone number is invalid",
          data: null,
        });
      }
      if (phone_number == "") {
        return res.status(404).send({
          isError: true,
          message: "Phone number must be filled",
          data: null,
        });
      }
      //4. Pengecekan Email & phone number ke DB serta referral code userlain
      const checkEmail = await users.findAll({
        where: {
          email,
        },
      });
      const checkPhone = await users.findAll({
        where: {
          phone_number,
        },
      });
      if (checkEmail.length !== 0) {
        return res.status(404).send({
          isError: true,
          message: "Email has already registered, please try another attempt",
          data: null,
        });
      }

      if (checkPhone.length !== 0) {
        return res.status(404).send({
          isError: true,
          message:
            "Phone Number has already registered, please try another attempt",
        });
      }

      let checkRef = await users.findAll({
        where: {
          referral_code: ref_code,
        },
      });

      if (checkRef.length == 0 && ref_code !== "") {
        return res.status(404).send({
          isError: true,
          message:
            "Referral code is not registered, please try another referral code",
          data: null,
        });
      }

      //5. Create OTP and Referral Code
      const checkCode = await users.findAll({
        attributes: ["otp", "referral_code"],
      });
      const listOTP = [];
      const listREF = [];
      checkCode.map((value) => {
        listOTP.push(value.dataValues.otp);
        listREF.push(value.dataValues.referral_code);
      });
      console.log(listOTP, listREF);

      // Iterate otp and referal until unique
      let otp;
      let referral_code;

      for (let i = 0; i <= 10; i++) {
        otp = generateOTP(4);
        if (!listOTP.includes(otp)) {
          break;
        }
      }
      for (let i = 0; i <= 10; i++) {
        referral_code = generateRef(6);
        if (!listREF.includes(referral_code)) {
          break;
        }
      }
      //   console.log(otp);
      //   console.log(referral_code);
      //6. Create data user pada database user
      let createUser = await users.create(
        {
          name,
          email,
          password: await hashPassword(password),
          otp,
          referral_code,
          phone_number,
        },
        { transaction: t }
      );

      //7. Mengirimkan email verifikasi pada user
      let users_id = createUser.dataValues.id;
      let token = createToken({ users_id, name, email, otp });
      let mail;
      let reactUrl = process.env.REACT_APP_BASE_URL;
      console.log(reactUrl);
      // console.log(users_id);
      // template 1 = template claim voucher dan verification link
      let template1 = await fs.readFile("./template/verifyClaim.html", "utf-8");
      let compiledTemplate1 = await handlebars.compile(template1);
      let newTemplate1 = compiledTemplate1({
        token: token,
        reactUrl: reactUrl,
      });
      //template 2 = template verification link
      let template2 = await fs.readFile("./template/verifyEmail.html", "utf-8");
      let compiledTemplate2 = await handlebars.compile(template2);
      let newTemplate2 = compiledTemplate2({
        token: token,
        reactUrl: reactUrl,
      });
      if (checkRef.length !== 0) {
        mail = {
          from: `Admin-GoKu<berakinside1996@gmail.com>`,
          to: email,
          subject: "Account Verification & Claim Voucher from Referral code",
          html: newTemplate1,
        };
      } else {
        mail = {
          from: `Admin-GoKu<berakinside1996@gmail.com>`,
          to: email,
          subject: "Account Verification",
          html: newTemplate2,
        };
      }
      console.log(token);
      await t.commit();
      transporter.sendMail(mail, (errMail, resMail) => {
        if (errMail) {
          res.status(404).send({
            isError: true,
            message: "Registration Failed",
            data: null,
          });
        }
        res.status(200).send({
          isError: false,
          message:
            "Registration Success, please check your email for verification",
          data: null,
        });
      });
    } catch (error) {
      await t.rollback();
      res.status(500).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  verification: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { users_id, name, email, otp } = req.dataToken;
      //   console.log(users_id, name, email, otp);
      await users.update(
        {
          status: "Verified",
        },
        {
          where: {
            id: users_id,
            name,
            email,
            otp,
          },
        },
        { transaction: t }
      );
      await t.commit();
      res.status(200).send({
        isError: false,
        message: "User telah terverifikasi",
        data: name,
      });
    } catch (error) {
      await t.rollback();
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  usersProfile: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const id = req.dataToken.id;
      let profile_picture = req.files.images;
      let { name, email, gender, birthdate } = req.body;
      let regxEmail = /\S+@\S+\.\S+/;

      if (!birthdate)
        throw {
          message: "Your date of birth is required. Please fill in the field.",
        };
      let dataProfile = await users.findOne(
        { where: { id: id } },
        { transaction: t }
      );

      name = name.replace(/"%"/g, " ");
      let existEmail = await users.findOne(
        {
          where: {
            email: email,
            id: {
              [Op.not]: id,
            },
          },
        },
        { transaction: t }
      );

      if (regxEmail.test(email) === false) {
        throw {
          message:
            "The email address you entered is not valid. Please try again.",
        };
      }

      if (existEmail)
        throw { message: "Sorry, that email address is already in use." };
      await users.update(
        { name, email, gender, birthdate },
        { where: { id } },
        { transaction: t }
      );

      if (profile_picture) {
        const photoToEdit = profile_picture[0].path;
        await users.update(
          {
            image: photoToEdit,
          },
          { where: { id: id } },
          { transaction: t }
        );
        if (dataProfile.dataValues.image) {
          await fs.unlink(dataProfile.dataValues.image);
        }
      }

      const dataProfileUpdate = await users.findOne(
        { attributes: { exclude: "password" }, where: { id } },
        { transaction: t }
      );
      await t.commit();
      res.status(200).send({
        isSuccess: true,
        message:
          "Profile update complete. Thank you for keeping your information up to date!",
        data: dataProfileUpdate,
      });
    } catch (error) {
      await t.rollback();
      if (req.files.images) deleteFiles(req.files.images);
      console.log(error);
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  deleteProfile: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const id = req.dataToken.id;
      let findUser = await users.findOne({ where: { id } });

      if (!findUser.dataValues.image)
        throw { message: "You dont have profile picture" };

      if (findUser.dataValues.image) {
        await users.update(
          {
            image: null,
          },
          { where: { id: id } },
          { transaction: t }
        );
        await fs.unlink(findUser.dataValues.image);
      }
      await t.commit();
      res.status(200).send({
        isSuccess: true,
        message: "Your profile picture has been delete",
      });
    } catch (error) {
      await t.rollback();
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },

  changePasswordStep1: async (req, res) => {
    try {
      const id = req.dataToken.id;
      let oldPassword = req.query.oldPassword;
      console.log(oldPassword);

      if (!oldPassword)
        throw {
          message: "Please fill your current password.",
        };

      let findUser = await users.findOne({
        where: { id },
      });

      const passwordDataBase = findUser.dataValues.password;
      let match = await hashMatch(oldPassword, passwordDataBase);

      if (match === false)
        throw { message: "Password you entered is incorrect" };

      res.status(200).send({
        isSuccess: true,
        message: "success",
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },

  changePassword: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      let regxPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/;
      const id = req.dataToken.id;
      const { newPassword, repeatPassword } = req.body;
      console.log(newPassword, repeatPassword);

      if (!newPassword || !repeatPassword)
        throw {
          message: "Incomplete data. Please fill in missing information.",
        };
      if (newPassword !== repeatPassword)
        throw {
          message:
            "Password and repeat password do not match. Please make sure they are the same.",
        };
      if (!regxPassword.test(newPassword))
        throw {
          message:
            "Please choose a password that contains both letters and numbers, and is between 6 and 12 character.",
        };

      await users.update(
        {
          password: await hashPassword(newPassword),
        },
        { where: { id: id } },
        { transaction: t }
      );

      await t.commit();
      res.status(201).send({
        isSuccess: true,
        message: "Your password has been updated",
      });
    } catch (error) {
      await t.rollback();
      res.status(500).send({
        isSuccess: true,
        message: error.message,
      });
    }
  },
};

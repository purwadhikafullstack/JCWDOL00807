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

//import Middleware
const transporter = require("./../helper/transporter");

//Import generateOTP and generate Referral code
const { generateOTP } = require("./../lib/generateOTP");
const { generateRef } = require("./../lib/generateRef");

//Import ValidatePhoneNumber
const validatePhoneNumber = require("./../lib/validatePhoneNumber");

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
      console.log(users_id);
      if (checkRef.length !== 0) {
        mail = {
          from: `Admin-GoKu<beraksinside1996@gmail.com`,
          to: email,
          subject: "Account Verification & Claim Voucher from Referral code",
          html: `<a href='http:localhost:8000/api/voucher/${token}'>Claim your voucher from referral code</a>
          <br>
          <a href='http:localhost:3000/authentication/${token}'>Click here for verification your account </a> `,
        };
      } else {
        mail = {
          from: `Admin-GoKu<berakinside1996@gmail.com>`,
          to: email,
          subject: "Account Verification",
          html: `<a href='http:localhost:3000/authentication/${token}'>Click here for verification your account </a>`,
        };
      }
      console.log(mail);
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
};

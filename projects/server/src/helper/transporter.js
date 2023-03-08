const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "berakinside1996@gmail.com",
    pass: "bozymiklaaibfrka",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;

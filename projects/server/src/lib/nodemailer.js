const nodemailer = require("nodemailer");
const password = process.env.password_email;

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: "berakinside1996@gmail.com",
    // password transporter bukan password email kita
    pass: password,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("server is ready to take our messages");
  }
});

module.exports = transporter;

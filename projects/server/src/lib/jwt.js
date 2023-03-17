const jwt = require("jsonwebtoken");
const passtoken = process.env.token;

module.exports = {
  createToken: (payload) => {
    return jwt.sign(payload, passtoken, {
      expiresIn: "48h",
    });
  },
  validateToken: (token) => {
    return jwt.verify(token, passtoken);
  },
};

const createToken = (payload) => {
  return jwt.sign(payload, "123abc", {
    expiresIn: "48h",
  });
};

let admins_id = 1;
let name = "mamat";
let email = "mamat@gmail.com";
let role = "super admin";
let isActive = true;
let token = createToken({ admins_id, name, email, role, isActive });
console.log(token);

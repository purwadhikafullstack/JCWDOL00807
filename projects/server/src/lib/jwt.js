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

let admins_id = 2;
let name = "abdul";
let email = "abdul@gmail.com";
let role = "admin branch";
let isActive = true;
let token = createToken({ admins_id, name, email, role, isActive });
console.log(token);

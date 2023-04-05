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

let name = "abdul";
let email = "abdul@gmail.com";
let role = "admin branch";
let isActive = true;
let branch_stores_id = 1;
let token = createToken({
  name,
  email,
  role,
  isActive,
  branch_stores_id,
});
console.log(token);
// let users_id = "36867dbe-0ce0-4e16-b262-911fbe61498b";
// let name = "kevin";
// let email = "kevin29329329@gmail.com";
// let otp = 8779;
// let token = createToken({ users_id, name, email, otp });
// console.log(token);

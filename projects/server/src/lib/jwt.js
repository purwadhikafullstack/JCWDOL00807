const jwt = require("jsonwebtoken");
const passtoken = process.env.token;

module.exports = {
  createToken: (payload) => {
    return jwt.sign(payload, passtoken, {
      expiresIn: "48h",
    });
  },
  createTokenHasExpired: (payload) => {
    return jwt.sign(payload, passtoken, {
      expiresIn: "1h",
    });
  },
  validateToken: (token) => {
    return jwt.verify(token, passtoken);
  },
};

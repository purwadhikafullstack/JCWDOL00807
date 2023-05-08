const jwt = require("jsonwebtoken");
const passtoken = process.env.token;
module.exports = {
  auth: (req, res, next) => {
    jwt.verify(req.token, passtoken, (err, decode) => {
      if (err) {
        return res.status(401).send("User not auth!");
      }
      req.user = decode;
      next();
    });
  },
};

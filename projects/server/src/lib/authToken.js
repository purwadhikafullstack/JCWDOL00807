const jwt = require("jsonwebtoken");
module.exports = {
  auth: (req, res, next) => {
    jwt.verify(req.token, "123abc", (err, decode) => {
      if (err) {
        return res.status(401).send("User not auth!");
      }
      req.user = decode;
      next();
    });
  },
};

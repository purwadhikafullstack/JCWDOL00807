const jwt = require("jsonwebtoken");
const passtoken = process.env.token;

module.exports = {
  tokenVerify: (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({
        error: true,
        message: "token not found",
        isData: false,
        data: null,
      });
    }

    jwt.verify(token, passtoken, (err, dataToken) => {
      try {
        if (err) throw err;
        req.dataToken = dataToken;
        next();
      } catch (error) {
        res.status(500).send({
          isError: true,
          message: error.message,
        });
      }
    });
  },
};

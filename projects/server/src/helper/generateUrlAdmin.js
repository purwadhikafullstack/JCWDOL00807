require("dotenv").config();
let api = process.env.REACT_APP_BASE_API;

const generateUrlAdmin = (pathImage) => {
  return api + pathImage.slice(5);
};

module.exports = generateUrlAdmin;

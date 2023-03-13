let api = process.env.REACT_APP_BASE_API;

const generateUrl = (pathImage) => {
  return api + pathImage.slice(6);
};

module.exports = generateUrl;

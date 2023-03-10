const generateUrl = (pathImage) => {
  console.log("haloo");
  //   return process.env.REACT_APP_API_BASE_URL;
  return pathImage.slice(6);
};

module.exports = generateUrl;

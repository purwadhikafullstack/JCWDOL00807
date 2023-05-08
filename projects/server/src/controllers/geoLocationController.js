const axios = require("axios");

module.exports = {
  getCoordinate: async (req, res) => {
    try {
      let key = process.env.KEY_OPENCAGE;
      let { city, province, country } = req.query;

      let response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${city}+${province}+${country}&key=${key}&pretty=1`
      );

      const data = response.data.results;

      let detailAddress = data.map((val) => {
        return val.geometry;
      });

      console.log(detailAddress);

      res.status(200).send({
        isSuccess: true,
        message: data[0].formatted,
        data: detailAddress[0],
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
};

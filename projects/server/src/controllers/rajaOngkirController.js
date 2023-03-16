const axios = require("axios");

module.exports = {
  getProvince: async (req, res) => {
    try {
      let key = process.env.KEY_RAJAONGKIR;

      let response = await axios.get(
        "https://api.rajaongkir.com/starter/province",
        {
          headers: { key: key },
        }
      );

      res.status(200).send({
        isSuccess: true,
        message: "get data province Success !",
        data: {
          rajaongkir: {
            country: "Indonesia",
            province: response.data.rajaongkir.results,
          },
        },
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  getCity: async (req, res) => {
    try {
      let key = process.env.KEY_RAJAONGKIR;

      let { province_id } = req.query;

      if (!province_id) throw { message: "your not select province" };

      let response = await axios.get(
        `https://api.rajaongkir.com/starter/city?province=${province_id}`,
        {
          headers: {
            key: key,
          },
        }
      );

      res.status(200).send({
        isSuccess: true,
        message: "Get City Success",
        data: {
          rajaongkir: {
            country: "Indonesia",
            city: response.data.rajaongkir.results,
          },
        },
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.status,
      });
    }
  },
};

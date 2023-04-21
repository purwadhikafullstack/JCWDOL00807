const axios = require("axios");

module.exports = {
  getProvince: async (req, res) => {
    try {
      let key = process.env.KEY_RAJAONGKIR;
      let { province_id } = req.query;

      let response = await axios.get(
        "https://api.rajaongkir.com/starter/province",
        {
          params: {
            id: province_id || ''
          },
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

      let { province_id, city_id } = req.query;

      // if (!province_id) throw { message: "your not select province" };

      let response = await axios.get(
        `https://api.rajaongkir.com/starter/city`,
        {
          params: {
            province: province_id || '',
            id: city_id || ''
          },
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
  getCost: async (req, res) => {
    try {
      let key = process.env.KEY_RAJAONGKIR;

      const { origin, destination, weight, courier } = req.body;

      if (!origin) throw { message: "origin was empty" };
      if (!destination) throw { message: "destination was empty" };
      if (!weight) throw { message: "weight was empty" };
      if (!courier) throw { message: "courier was empty" };

      let response = await axios.post(
        "https://api.rajaongkir.com/starter/cost",
        {
          origin,
          destination,
          weight,
          courier,
        },
        {
          headers: {
            key: key,
            "content-type": "application/x-www-form-urlencoded",
          },
        }
      );

      res.status(200).send({
        isSuccess: true,
        message: "get cost success",
        data: {
          rajaongkir: {
            country: "Indonesia",
            costs: response.data.rajaongkir.results[0].costs
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

  getOriginByBranchStore: async (req, res) => {
    try {
      let key = process.env.KEY_RAJAONGKIR;

      let { branch } = req.query;

      if (!branch) throw { message: "origin was empty" };

      let response = await axios.get(
        "https://api.rajaongkir.com/starter/city",
        {
          headers: {
            key: key,
          },
        }
      );

      const { results } = response.data.rajaongkir
      const origin = results.filter(x => x.city_name == branch)

      res.status(200).send({
        isSuccess: true,
        message: "get origin success",
        data: origin[0],
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.status,
      });
    }
  },
};

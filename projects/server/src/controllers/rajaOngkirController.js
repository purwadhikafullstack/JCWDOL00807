const axios = require("axios");
const db = require("./../models/index");
// const carts = db.carts;
const { sequelize } = require("../models");

debugger;
module.exports = {
  getProvince: async (req, res) => {
    try {
      let key = process.env.KEY_RAJAONGKIR;
      let { province_id } = req.query;

      let response = await axios.get(
        "https://api.rajaongkir.com/starter/province",
        {
          params: {
            id: province_id || "",
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
      // if (error.message === ){

      // }
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
            province: province_id || "",
            id: city_id || "",
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
            costs: response.data.rajaongkir.results[0].costs,
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

      const { results } = response.data.rajaongkir;
      const origin = results.filter((x) => x.city_name == branch);

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

  getCityAddress: async (req, res) => {
    try {
      let key = process.env.KEY_RAJAONGKIR;

      let { cityname } = req.query;

      if (!cityname) throw { message: "city was empty" };

      let response = await axios.get(
        "https://api.rajaongkir.com/starter/city",
        {
          headers: {
            key,
          },
        }
      );

      const { results } = response.data.rajaongkir;
      const origin = results.filter((x) => x.city_name == cityname);

      res.status(200).send({
        isSuccess: true,
        message: "get origin success",
        data: origin[0],
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error,
      });
    }
  },

  getDestinationByAddress: async (req, res) => {
    try {
      const { users_id } = req.params;
      const { origin, destination, weight, courier } = req.body;

      // Ambil data alamat tujuan pengiriman dengan kolom isDefault bernilai 1
      const [rows, fields] = await sequelize.query(
        "SELECT * FROM user_address WHERE users_id = ? AND isDefault = 1",
        {
          replacements: [users_id],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (!rows[0]) {
        throw { message: "No default address found" };
      }

      const { street_address, city, province, postal_code, country } = rows[0];

      // Panggil API untuk menghitung ongkos kirim
      const response = await axios.post(
        "https://api.rajaongkir.com/starter/cost",
        {
          origin,
          destination,
          weight,
          courier,
        },
        // {
        //   origin: "Jakarta", // ganti dengan origin yang sesuai
        //   destination: city,
        //   weight: 1000, // ganti dengan berat barang yang sesuai
        //   courier: "jne", // ganti dengan kurir yang sesuai
        // },
        {
          headers: {
            key: process.env.KEY_RAJAONGKIR,
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
            costs: response.data.rajaongkir.results[0].costs,
            destination: {
              street_address,
              city,
              province,
              postal_code,
              country,
            },
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
};

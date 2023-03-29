const { sequelize, Sequelize } = require("../models");
const { Op } = require("sequelize");

// import model
const db = require("../models/index");
const admin = db.admins;
const branch_stores = db.branch_stores;
const item_products = db.item_products;
const product_categories = db.product_categories;
const discounts = db.discounts;
const vouchers = db.vouchers;
const radians = require("../helper/radians");
const generateUrlAdmin = require("../helper/generateUrlAdmin");

module.exports = {
  listProduct: async (req, res) => {
    try {
      const { latitude, longitude } = req.query;
      const branchLocation = await branch_stores.findAll({
        attributes: ["latitude", "longitude", "name"],
      });
      const R = 6371; // radius Bumi dalam kilometer
      let distances = [];
      let closest = -1;

      for (let i = 0; i < branchLocation.length; i++) {
        let lat = branchLocation[i].dataValues.latitude;
        let lon = branchLocation[i].dataValues.longitude;
        let dlat = radians(lat - latitude);
        let dlon = radians(lon - longitude);
        let a =
          Math.sin(dlat / 2) * Math.sin(dlat / 2) +
          Math.cos(radians(latitude)) *
            Math.cos(radians(lat)) *
            Math.sin(dlon / 2) *
            Math.sin(dlon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;
        distances[i] = d;
        if (closest == -1 || d < distances[closest]) {
          closest = i;
        }
      }

      console.log(closest);

      const listProduct = await sequelize.query(
        `select bs.name as branch, ip.id,pc.name as category,  ip.name, ip.images, ip.description, ip.weight, ip.stock, ip.price,
        d.cut_nominal, CONCAT(Round((d.cut_percentage * 100),0),"%") AS cut_percentage,
        CASE WHEN d.status = 1 THEN ROUND(ip.price - (CASE WHEN d.cut_percentage THEN ip.price * d.cut_percentage ELSE COALESCE(d.cut_nominal,0) END),0) ELSE Null END AS price_after_discount,
        d.status, ip.createdAt,ip.branch_stores_id,ip.vouchers_id, d.discount_type  from item_products ip 
        left join discounts d on d.id = ip.discount_id 
        join product_categories pc on pc.id = ip.product_categories_id 
        join branch_stores bs on bs.id = ip.branch_stores_id where ip.branch_stores_id = ? LIMIT 5;`,
        {
          replacements: [closest + 1],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      listProduct.map((val) => {
        return (val.images = generateUrlAdmin(val.images));
      });

      const promotion = await sequelize.query(
        `select bs.name as branch, ip.id,pc.name as category,  ip.name, ip.images, ip.description, ip.weight, ip.stock, ip.price,
        d.cut_nominal, CONCAT(Round((d.cut_percentage * 100),0),"%") AS cut_percentage,
        CASE WHEN d.status = 1 THEN ROUND(ip.price - (CASE WHEN d.cut_percentage THEN ip.price * d.cut_percentage ELSE COALESCE(d.cut_nominal,0) END),0) ELSE Null END AS price_after_discount,
        d.status, ip.createdAt,ip.branch_stores_id,ip.vouchers_id, d.discount_type  from item_products ip 
        left join discounts d on d.id = ip.discount_id 
        join product_categories pc on pc.id = ip.product_categories_id 
        join branch_stores bs on bs.id = ip.branch_stores_id where ip.branch_stores_id = ? and status = 1 LIMIT 5;
     `,
        {
          replacements: [closest + 1],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      promotion.map((val) => {
        return (val.images = generateUrlAdmin(val.images));
      });

      const latest = await sequelize.query(
        `select bs.name as branch, ip.id,pc.name as category,  ip.name, ip.images, ip.description, ip.weight, ip.stock, ip.price,
        d.cut_nominal, CONCAT(Round((d.cut_percentage * 100),0),"%") AS cut_percentage,
        CASE WHEN d.status = 1 THEN ROUND(ip.price - (CASE WHEN d.cut_percentage THEN ip.price * d.cut_percentage ELSE COALESCE(d.cut_nominal,0) END),0) ELSE Null END AS price_after_discount,
        d.status, ip.createdAt,ip.branch_stores_id,ip.vouchers_id, d.discount_type  from item_products ip 
        left join discounts d on d.id = ip.discount_id 
        join product_categories pc on pc.id = ip.product_categories_id 
        join branch_stores bs on bs.id = ip.branch_stores_id where ip.branch_stores_id = ?  ORDER BY ip.createdAt DESC LIMIT 5 ;`,

        {
          replacements: [closest + 1],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      latest.map((val) => {
        return (val.images = generateUrlAdmin(val.images));
      });

      const getDataBestSeller = await sequelize.query(
        `SELECT (td.product_name) , sum(td.qty) as qty from transactions t join transaction_details td on td.transactions_id = t.id
        where (t.status="Order Confirmed" or t.status="On Delivering" or t.status="Ongoing") AND branch_store = ?
        group by td.product_name order by sum(td.qty) desc 
        limit 5;`,

        {
          replacements: [branchLocation[closest].name],
          type: sequelize.QueryTypes.SELECT,
        }
      );
      console.log(getDataBestSeller);

      let dataBestSeller = getDataBestSeller.map(
        (val) => `${val.product_name}`
      );

      const productBestSeller = await sequelize.query(
        `SELECT bs.name AS branch, ip.id, pc.name AS category, ip.name, ip.images, ip.description, ip.weight, ip.stock, ip.price,
      d.cut_nominal, CONCAT(ROUND((d.cut_percentage * 100),0),"%") AS cut_percentage,
      CASE WHEN d.status = 1 THEN ROUND(ip.price - (CASE WHEN d.cut_percentage THEN ip.price * d.cut_percentage ELSE COALESCE(d.cut_nominal,0) END),0) ELSE NULL END AS price_after_discount,
      d.status, ip.createdAt, ip.branch_stores_id, ip.vouchers_id, d.discount_type
      FROM item_products ip
      LEFT JOIN discounts d ON d.id = ip.discount_id
      JOIN product_categories pc ON pc.id = ip.product_categories_id
      JOIN branch_stores bs ON bs.id = ip.branch_stores_id
      WHERE ip.branch_stores_id = ? AND ip.name IN ("${dataBestSeller[0]}", "${dataBestSeller[1]}", "${dataBestSeller[2]}", "${dataBestSeller[3]}", "${dataBestSeller[4]}" );`,

        {
          replacements: [closest + 1],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      productBestSeller.map((val) => {
        return (val.images = generateUrlAdmin(val.images));
      });

      const category = await sequelize.query(
        `select Distinct pc.name FROM item_products ip JOIN product_categories pc ON pc.id = ip.product_categories_id where branch_stores_id =?;
     `,
        {
          replacements: [closest + 1],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      let newCategories = category.map((val) => {
        return val.name;
      });

      res.status(200).send({
        isSuccess: true,
        message: "List Product Success",
        data: {
          branch: branchLocation[closest].name,
          category: newCategories,
          allProduct: listProduct,
          promotion: promotion,
          latest: latest,
          bestSeller: productBestSeller,
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

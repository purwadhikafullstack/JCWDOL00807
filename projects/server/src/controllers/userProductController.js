const { sequelize, Sequelize } = require("../models");
const { Op } = require("sequelize");

// import model
const db = require("../models/index");
const branch_stores = db.branch_stores;
const item_products = db.item_products;
const product_categories = db.product_categories;
const discounts = db.discounts;
const radians = require("../helper/radians");
const generateUrlAdmin = require("../helper/generateUrlAdmin");

module.exports = {
  listProduct: async (req, res) => {
    try {
      const { latitude, longitude } = req.query;
      const branchLocation = await branch_stores.findAll({
        attributes: ["latitude", "longitude", "name", "id"],
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

      const listProduct = await item_products.findAll({
        attributes: [
          [Sequelize.literal("branch_store.name"), "branch"],
          [Sequelize.literal("product_category.name"), "category"],
          "id",
          "name",
          "images",
          "description",
          "weight",
          "stock",
          "price",
          [Sequelize.literal("discount.cut_nominal"), "cut_nominal"],
          [
            sequelize.literal(
              "CONCAT(ROUND((discount.cut_percentage * 100),0),'%')"
            ),
            "cut_percentage",
          ],
          [
            sequelize.literal(
              "CASE WHEN discount.status = 1 THEN ROUND(item_products.price - (CASE WHEN discount.cut_percentage THEN item_products.price * discount.cut_percentage ELSE COALESCE(discount.cut_nominal,0) END),0) ELSE NULL END"
            ),
            "price_after_discount",
          ],
          [Sequelize.literal("discount.status"), "status"],
          [Sequelize.literal("discount.discount_type"), "discount_type"],
          "createdAt",
          "vouchers_id",
        ],
        include: [
          {
            model: discounts,
            as: "discount",
            attributes: [],
          },
          {
            model: product_categories,
            as: "product_category",
            attributes: [],
          },
          {
            model: branch_stores,
            as: "branch_store",
            attributes: [],
          },
        ],
        where: { branch_stores_id: closest + 1 },
      });

      listProduct.map((val) => {
        if (!val.images) {
          return null;
        } else {
          return (val.images = generateUrlAdmin(val.images));
        }
      });

      const promotion = await item_products.findAll({
        attributes: [
          [Sequelize.literal("branch_store.name"), "branch"],
          [Sequelize.literal("product_category.name"), "category"],
          "id",
          "name",
          "images",
          "description",
          "weight",
          "stock",
          "price",
          [Sequelize.literal("discount.cut_nominal"), "cut_nominal"],
          [
            sequelize.literal(
              "CONCAT(ROUND((discount.cut_percentage * 100),0),'%')"
            ),
            "cut_percentage",
          ],
          [
            sequelize.literal(
              "CASE WHEN discount.status = 1 THEN ROUND(item_products.price - (CASE WHEN discount.cut_percentage THEN item_products.price * discount.cut_percentage ELSE COALESCE(discount.cut_nominal,0) END),0) ELSE NULL END"
            ),
            "price_after_discount",
          ],
          [Sequelize.literal("discount.status"), "status"],
          [Sequelize.literal("discount.discount_type"), "discount_type"],
          "createdAt",
          "vouchers_id",
        ],
        include: [
          {
            model: discounts,
            as: "discount",
            attributes: [],
            where: { status: 1 },
          },
          {
            model: product_categories,
            as: "product_category",
            attributes: [],
          },
          {
            model: branch_stores,
            as: "branch_store",
            attributes: [],
          },
        ],
        where: { branch_stores_id: closest + 1 },
      });

      promotion.map((val) => {
        if (!val.images) {
          return null;
        } else {
          return (val.images = generateUrlAdmin(val.images));
        }
      });

      const latest = await item_products.findAll({
        attributes: [
          [Sequelize.literal("branch_store.name"), "branch"],
          [Sequelize.literal("product_category.name"), "category"],
          "id",
          "name",
          "images",
          "description",
          "weight",
          "stock",
          "price",
          [Sequelize.literal("discount.cut_nominal"), "cut_nominal"],
          [
            sequelize.literal(
              "CONCAT(ROUND((discount.cut_percentage * 100),0),'%')"
            ),
            "cut_percentage",
          ],
          [
            sequelize.literal(
              "CASE WHEN discount.status = 1 THEN ROUND(item_products.price - (CASE WHEN discount.cut_percentage THEN item_products.price * discount.cut_percentage ELSE COALESCE(discount.cut_nominal,0) END),0) ELSE NULL END"
            ),
            "price_after_discount",
          ],
          [Sequelize.literal("discount.status"), "status"],
          [Sequelize.literal("discount.discount_type"), "discount_type"],
          "createdAt",
          "vouchers_id",
        ],
        include: [
          {
            model: discounts,
            as: "discount",
            attributes: [],
          },
          {
            model: product_categories,
            as: "product_category",
            attributes: [],
          },
          {
            model: branch_stores,
            as: "branch_store",
            attributes: [],
          },
        ],
        where: { branch_stores_id: closest + 1 },
        order: [["createdAt", "DESC"]],
      });

      latest.map((val) => {
        if (!val.images) {
          return null;
        } else {
          return (val.images = generateUrlAdmin(val.images));
        }
      });

      const getDataBestSeller = await sequelize.query(
        `SELECT (td.product_name) , sum(td.qty) as qty from transactions t join transaction_details td on td.transactions_id = t.id
        where (t.status="Order Confirmed" or t.status="On Delivering" or t.status="Ongoing") AND branch_store = ?
        group by td.product_name order by sum(td.qty) desc`,

        {
          replacements: [branchLocation[closest].name],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      let dataBestSeller = getDataBestSeller.map(
        (val) => `${val.product_name}`
      );

      const productBestSeller = await item_products.findAll({
        attributes: [
          [Sequelize.literal("branch_store.name"), "branch"],
          [Sequelize.literal("product_category.name"), "category"],
          "id",
          "name",
          "images",
          "description",
          "weight",
          "stock",
          "price",
          [Sequelize.literal("discount.cut_nominal"), "cut_nominal"],
          [
            sequelize.literal(
              "CONCAT(ROUND((discount.cut_percentage * 100),0),'%')"
            ),
            "cut_percentage",
          ],
          [
            sequelize.literal(
              "CASE WHEN discount.status = 1 THEN ROUND(item_products.price - (CASE WHEN discount.cut_percentage THEN item_products.price * discount.cut_percentage ELSE COALESCE(discount.cut_nominal,0) END),0) ELSE NULL END"
            ),
            "price_after_discount",
          ],
          [Sequelize.literal("discount.status"), "status"],
          [Sequelize.literal("discount.discount_type"), "discount_type"],
          "createdAt",
          "vouchers_id",
        ],
        include: [
          {
            model: discounts,
            as: "discount",
            attributes: [],
          },
          {
            model: product_categories,
            as: "product_category",
            attributes: [],
          },
          {
            model: branch_stores,
            as: "branch_store",
            attributes: [],
          },
        ],
        where: { branch_stores_id: closest + 1, name: dataBestSeller },
      });

      productBestSeller.map((val) => {
        if (!val.images) {
          return null;
        } else {
          return (val.images = generateUrlAdmin(val.images));
        }
      });

      const category = await sequelize.query(
        `select Distinct pc.name FROM item_products ip JOIN product_categories pc ON pc.id = ip.product_categories_id where branch_stores_id =? ORDER BY pc.name ASC;`,
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
          branch_id: branchLocation[closest].id,
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

  productFilterQuery: async (req, res) => {
    try {
      const {
        branch_stores_id,
        branch_store_name,
        promotion,
        latest,
        bestSeller,
        allProduct,
        categories,
        sortBy,
        search,
      } = req.query;

      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 0;
      const offset = limit * page;

      const getDataBestSeller = await sequelize.query(
        `SELECT (td.product_name) , sum(td.qty) as qty from transactions t join transaction_details td on td.transactions_id = t.id
        where (t.status="Order Confirmed" or t.status="On Delivering" or t.status="Ongoing") AND branch_store = ?
        group by td.product_name order by sum(td.qty) desc `,

        {
          replacements: [branch_store_name],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      let dataBestSeller = getDataBestSeller.map(
        (val) => `${val.product_name}`
      );

      let inputPromotion;
      let inputLatest;
      let inputBestSeller;
      let inputCategories;
      let inputSort;
      let inputSearch;

      if (promotion) {
        inputPromotion = { status: 1 };
      }
      if (latest) {
        inputLatest = [["createdAt", "DESC"]];
      }

      if (bestSeller) {
        inputBestSeller = { branch_stores_id, name: dataBestSeller };
      } else {
        inputBestSeller = { branch_stores_id };
      }

      if (categories) {
        let newCategories = categories.split(",");
        inputCategories = { name: [...newCategories] };
      }
      if (sortBy === "highPrice") {
        inputSort = [["price_after_discount_notNull", "DESC"]];
      }
      if (sortBy === "lowestPrice") {
        inputSort = [["price_after_discount_notNull", "ASC"]];
      }
      if (sortBy === "nameAsc") {
        inputSort = [["name", "ASC"]];
      }
      if (sortBy === "nameDesc") {
        inputSort = [["name", "DESC"]];
      }
      if (search) {
        inputSearch = { name: { [Op.substring]: search } };
      }

      if (allProduct === "allProduct") {
        inputLatest = [["createdAt", "ASC"]];
      }

      let order = [];
      if (inputSort) {
        order.push(...inputSort);
      }
      if (inputLatest) {
        order.push(...inputLatest);
      }

      const { count } = await item_products.findAndCountAll({
        attributes: [
          [Sequelize.literal("branch_store.name"), "branch"],
          [Sequelize.literal("product_category.name"), "category"],
          "id",
          "name",
          "images",
          "description",
          "weight",
          "stock",
          "price",
          [Sequelize.literal("discount.cut_nominal"), "cut_nominal"],
          [
            sequelize.literal(
              "CONCAT(ROUND((discount.cut_percentage * 100),0),'%')"
            ),
            "cut_percentage",
          ],
          [
            sequelize.literal(
              "CASE WHEN discount.status = 1 THEN ROUND(item_products.price - (CASE WHEN discount.cut_percentage THEN item_products.price * discount.cut_percentage ELSE COALESCE(discount.cut_nominal,0) END),0) ELSE NULL END"
            ),
            "price_after_discount",
          ],
          [
            sequelize.literal(
              "CASE WHEN discount.status = 1 THEN ROUND(item_products.price - (CASE WHEN discount.cut_percentage THEN item_products.price * discount.cut_percentage ELSE COALESCE(discount.cut_nominal,0) END),0) ELSE item_products.price END"
            ),
            "price_after_discount_notNull",
          ],
          [Sequelize.literal("discount.status"), "status"],
          [Sequelize.literal("discount.discount_type"), "discount_type"],
          "createdAt",
          "vouchers_id",
        ],
        include: [
          {
            model: discounts,
            as: "discount",
            attributes: [],
            where: inputPromotion,
          },
          {
            model: product_categories,
            as: "product_category",
            attributes: [],
            where: inputCategories,
          },
          {
            model: branch_stores,
            as: "branch_store",
            attributes: [],
          },
        ],
        where: {
          [Op.and]: [inputBestSeller, inputSearch],
        },
        order: order,
      });

      let totalPages = Math.ceil(count / limit);

      const productList = await item_products.findAll({
        attributes: [
          [Sequelize.literal("branch_store.name"), "branch"],
          [Sequelize.literal("product_category.name"), "category"],
          "id",
          "name",
          "images",
          "description",
          "weight",
          "stock",
          "price",
          [Sequelize.literal("discount.cut_nominal"), "cut_nominal"],
          [
            sequelize.literal(
              "CONCAT(ROUND((discount.cut_percentage * 100),0),'%')"
            ),
            "cut_percentage",
          ],
          [
            sequelize.literal(
              "CASE WHEN discount.status = 1 THEN ROUND(item_products.price - (CASE WHEN discount.cut_percentage THEN item_products.price * discount.cut_percentage ELSE COALESCE(discount.cut_nominal,0) END),0) ELSE NULL END"
            ),
            "price_after_discount",
          ],
          [
            sequelize.literal(
              "CASE WHEN discount.status = 1 THEN ROUND(item_products.price - (CASE WHEN discount.cut_percentage THEN item_products.price * discount.cut_percentage ELSE COALESCE(discount.cut_nominal,0) END),0) ELSE item_products.price END"
            ),
            "price_after_discount_notNull",
          ],
          [Sequelize.literal("discount.status"), "status"],
          [Sequelize.literal("discount.discount_type"), "discount_type"],
          "createdAt",
          "vouchers_id",
        ],
        include: [
          {
            model: discounts,
            as: "discount",
            attributes: [],
            where: inputPromotion,
          },
          {
            model: product_categories,
            as: "product_category",
            attributes: [],
            where: inputCategories,
          },
          {
            model: branch_stores,
            as: "branch_store",
            attributes: [],
          },
        ],
        where: {
          [Op.and]: [inputBestSeller, inputSearch],
        },
        order: order,
        limit: limit,
        offset: offset,
      });
      productList.map((val) => {
        if (!val.images) {
          return null;
        } else {
          return (val.dataValues.images = generateUrlAdmin(val.images));
        }
      });

      res.status(200).send({
        isSuccess: true,
        message: "get list product by query success",
        data: productList,
        count,
        page,
        totalPages,
        limit,
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  productDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const { branch_id } = req.query;

      console.log(req.query);
      console.log(branch_id);
      console.log("hahah");

      const product = await item_products.findAll({
        attributes: [
          [Sequelize.literal("branch_store.name"), "branch"],
          [Sequelize.literal("product_category.name"), "category"],
          "branch_stores_id",
          "id",
          "name",
          "images",
          "description",
          "weight",
          "stock",
          "price",
          [Sequelize.literal("discount.cut_nominal"), "cut_nominal"],
          [
            sequelize.literal(
              "CONCAT(ROUND((discount.cut_percentage * 100),0),'%')"
            ),
            "cut_percentage",
          ],
          [
            sequelize.literal(
              "CASE WHEN discount.status = 1 THEN ROUND(item_products.price - (CASE WHEN discount.cut_percentage THEN item_products.price * discount.cut_percentage ELSE COALESCE(discount.cut_nominal,0) END),0) ELSE NULL END"
            ),
            "price_after_discount",
          ],
          [
            sequelize.literal(
              "CASE WHEN discount.status = 1 THEN ROUND(item_products.price - (CASE WHEN discount.cut_percentage THEN item_products.price * discount.cut_percentage ELSE COALESCE(discount.cut_nominal,0) END),0) ELSE item_products.price END"
            ),
            "price_after_discount_notNull",
          ],
          [Sequelize.literal("discount.status"), "status"],
          [Sequelize.literal("discount.discount_type"), "discount_type"],
          "createdAt",
          "vouchers_id",
        ],
        include: [
          {
            model: discounts,
            as: "discount",
            attributes: [],
          },
          {
            model: product_categories,
            as: "product_category",
            attributes: [],
          },
          {
            model: branch_stores,
            as: "branch_store",
            attributes: [],
          },
        ],

        where: { [Op.and]: [{ id }, { branch_stores_id: branch_id }] },
      });

      console.log(product);
      product.map((val) => {
        if (!val.images) {
          return null;
        } else {
          return (val.dataValues.images = generateUrlAdmin(val.images));
        }
      });

      const productRecomendation = await item_products.findAll({
        attributes: [
          [Sequelize.literal("branch_store.name"), "branch"],
          [Sequelize.literal("product_category.name"), "category"],
          "id",
          "name",
          "images",
          "description",
          "weight",
          "stock",
          "price",
          [Sequelize.literal("discount.cut_nominal"), "cut_nominal"],
          [
            sequelize.literal(
              "CONCAT(ROUND((discount.cut_percentage * 100),0),'%')"
            ),
            "cut_percentage",
          ],
          [
            sequelize.literal(
              "CASE WHEN discount.status = 1 THEN ROUND(item_products.price - (CASE WHEN discount.cut_percentage THEN item_products.price * discount.cut_percentage ELSE COALESCE(discount.cut_nominal,0) END),0) ELSE NULL END"
            ),
            "price_after_discount",
          ],
          [
            sequelize.literal(
              "CASE WHEN discount.status = 1 THEN ROUND(item_products.price - (CASE WHEN discount.cut_percentage THEN item_products.price * discount.cut_percentage ELSE COALESCE(discount.cut_nominal,0) END),0) ELSE item_products.price END"
            ),
            "price_after_discount_notNull",
          ],
          [Sequelize.literal("discount.status"), "status"],
          [Sequelize.literal("discount.discount_type"), "discount_type"],
          "createdAt",
          "vouchers_id",
        ],
        include: [
          {
            model: discounts,
            as: "discount",
            attributes: [],
          },
          {
            model: product_categories,
            as: "product_category",
            attributes: [],
            where: { name: product[0].dataValues.category },
          },
          {
            model: branch_stores,
            as: "branch_store",
            attributes: [],
          },
        ],
        where: { branch_stores_id: product[0].dataValues.branch_stores_id },
      });

      productRecomendation.map((val) => {
        if (!val.images) {
          return null;
        } else {
          return (val.dataValues.images = generateUrlAdmin(val.images));
        }
      });

      res.status(200).send({
        isSuccess: true,
        message: "get product detail success",
        data: { product: product[0], productRecomendation },
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
};

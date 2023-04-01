// import sequelize
const { sequelize, Sequelize } = require("./../models");
const { Op } = require("sequelize");
const transporter = require("../lib/nodemailer");
const handlebars = require("handlebars");
const fs = require("fs").promises;
const generateUrlAdmin = require("../helper/generateUrlAdmin");

//import env
require("dotenv").config();

// import model
const db = require("./../models/index");
const admin = db.admins;
const branch_stores = db.branch_stores;
const item_products = db.item_products;
const product_categories = db.product_categories;
const discounts = db.discounts;
const vouchers = db.vouchers;
const historyLog = db.stock_history_logs;

const deleteFiles = require("../helper/deleteFile");

module.exports = {
  getData: async (req, res) => {
    try {
      const {
        admins_id,
        name: admins_name,
        email,
        role,
        isActive,
        branch_stores_id,
      } = req.dataToken;
      console.log(admins_id, admins_name, email, role, isActive);

      if (isActive === false) {
        res.status(404).send({
          isError: true,
          messasge: "Admin is not active, please contact to super admin",
          data: null,
        });
      }
      if (role !== "admin branch") {
        res.status(404).send({
          isError: true,
          message: "Role is not permitted",
          data: null,
        });
      }
      let category = await product_categories.findAll({
        attributes: ["name"],
      });
      let dataCategory = [];
      let dataDiscountType = [];
      let dataVoucherType = [];
      category.map((value, index) => {
        dataCategory.push(value.dataValues.name);
      });
      let discountType = await discounts.findAll({
        where: {
          status: true,
        },
        attributes: ["discount_type"],
      });
      discountType.map((value, index) => {
        dataDiscountType.push(value.dataValues.discount_type);
      });
      let voucherType = await vouchers.findAll({
        where: {
          status: true,
        },
        attributes: ["voucher_type"],
      });
      voucherType.map((value, index) => {
        dataVoucherType.push(value.dataValues.voucher_type);
      });

      let dataToSend = { dataCategory, dataDiscountType, dataVoucherType };
      res.status(200).send({
        isError: false,
        message:
          "Query dataCategory,dataDiscountType & dataVoucherType successs",
        data: dataToSend,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  getProducts: async (req, res) => {
    try {
      const {
        admins_id,
        name: admins_name,
        email,
        role,
        isActive,
        branch_stores_id,
      } = req.dataToken;
      console.log(admins_id, admins_name, email, role, isActive);

      let dataToSend = {};

      if (isActive === false) {
        res.status(404).send({
          isError: true,
          messasge: "Admin is not active, please contact to super admin",
          data: null,
        });
      }
      if (role !== "admin branch") {
        res.status(404).send({
          isError: true,
          message: "Role is not permitted",
          data: null,
        });
      }

      //   console.log(branch_stores_id);
      let productList = await sequelize.query(
        `
        SELECT i.id,i.name,i.images,i.description,i.weight,pc.name as categories,i.stock,i.price,DATE_FORMAT(i.createdAt, "%d %M %Y") as createdAt, DATE_FORMAT(i.updatedAt, "%d %M %Y") as updatedAt, v.voucher_type as voucherType, d.discount_type as discountType  
FROM online_groceries.item_products i
LEFT JOIN product_categories pc ON i.product_categories_id = pc.id
LEFT JOIN vouchers v on i.vouchers_id = v.id
LEFT JOIN discounts d on i.discount_id = d.id
where branch_stores_id =?
Group by i.id;
        `,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: [branch_stores_id],
          //   limit: 2,
        }
      );
      //   console.log(productList);

      // let productId = [];
      // let productName = [];
      // let productImage = [];
      // let productDescription = [];
      // let productCategories = [];
      // let productWeight = [];
      // let productStock = [];
      // let productPrice = [];
      // let productCreatedAt = [];
      // let productUpdatedAt = [];
      // let productDiscountType = [];
      // let productVoucherType = [];
      productList.map((value, index) => {
        if (typeof value.images === "string") {
          value.images = generateUrlAdmin(value.images);
        }
      });
      // productList.map((value, index) => {
      //   productId.push(value.id);
      //   productName.push(value.name);
      //   productImage.push(value.images);
      //   productDescription.push(value.description);
      //   productWeight.push(value.weight);
      //   productCategories.push(value.categories);
      //   productStock.push(value.stock);
      //   productPrice.push(value.price);
      //   productCreatedAt.push(value.createdAt);
      //   productUpdatedAt.push(value.updatedAt);
      //   productDiscountType.push(value.discountType);
      //   productVoucherType.push(value.voucherType);
      // });

      // for (let i = 0; i < productImage.length; i++) {
      //   if (typeof productImage[i] === "string") {
      //     productImage[i] = generateUrlAdmin(productImage[i]);
      //   }
      // }
      // console.log(productImage);

      //   console.log(productId);
      //   console.log(productName);
      //   console.log(productDescription);
      //   console.log(productWeight);
      //   console.log(productCategories);
      //   console.log(productStock);
      //   console.log(productPrice);
      //   console.log(productCreatedAt);
      //   console.log(productUpdatedAt);
      //   console.log(productDiscountType);
      //   console.log(productVoucherType);

      // dataToSend = {
      //   productId,
      //   productName,
      //   productImage,
      //   productDescription,
      //   productWeight,
      //   productCategories,
      //   productStock,
      //   productPrice,
      //   productCreatedAt,
      //   productUpdatedAt,
      //   productDiscountType,
      //   productVoucherType,
      // };
      dataToSend = { productList };
      console.log(dataToSend);
      res.status(200).send({
        isError: false,
        message: "Query Data is success",
        data: dataToSend,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  getProductById: async (req, res) => {
    try {
      const {
        admins_id,
        name: admins_name,
        email,
        role,
        isActive,
        branch_stores_id,
      } = req.dataToken;
      console.log(admins_id, admins_name, email, role, isActive);
      let { id } = req.params;

      if (isActive === false) {
        res.status(404).send({
          isError: true,
          messasge: "Admin is not active, please contact to super admin",
          data: null,
        });
      }
      if (role !== "admin branch") {
        res.status(404).send({
          isError: true,
          message: "Role is not permitted",
          data: null,
        });
      }

      let dataProduct = await item_products.findOne({
        where: {
          id,
          branch_stores_id,
        },
      });
      if (!dataProduct) {
        throw {
          isError: true,
          message: "Id Product is invalid, please input valid id product",
          data: null,
        };
      }

      let getProduct = await sequelize.query(
        `
        SELECT i.id,i.name,i.images,i.description,i.weight,pc.name as categories,i.stock,i.price,DATE_FORMAT(i.createdAt, "%d %M %Y") as createdAt, DATE_FORMAT(i.updatedAt, "%d %M %Y") as updatedAt, v.voucher_type as voucherType, d.discount_type as discountType  
FROM online_groceries.item_products i
LEFT JOIN product_categories pc ON i.product_categories_id = pc.id
LEFT JOIN vouchers v on i.vouchers_id = v.id
LEFT JOIN discounts d on i.discount_id = d.id
where branch_stores_id =? and i.id=?
Group by i.id;
        `,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: [branch_stores_id, id],
          //   limit: 2,
        }
      );
      console.log(getProduct[0].images);
      if (typeof getProduct[0].images === "string") {
        getProduct[0].images = generateUrlAdmin(getProduct[0].images);
      }

      res.status(200).send({
        isError: false,
        message: "Query Product By Id is success",
        data: getProduct,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  createProduct: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      // Ambil data dari body,filesimages, dan token
      const {
        admins_id,
        name: admins_name,
        email,
        role,
        isActive,
        branch_stores_id,
      } = req.dataToken;
      let productImage = req.files.images;
      console.log(productImage);
      console.log(admins_id, admins_name, email, role, isActive);

      let {
        name,
        description,
        weight,
        stock,
        price,
        category,
        discountType,
        voucherType,
      } = req.body;
      // Validasi Admin
      if (isActive === false) {
        res.status(404).send({
          isError: true,
          messasge: "Admin is not active, please contact to super admin",
          data: null,
        });
        return;
      }
      if (role !== "admin branch") {
        res.status(404).send({
          isError: true,
          message: "Role is not permitted",
          data: null,
        });
        return;
      }

      // Validasi Input
      let checkName = await item_products.findOne({
        where: { name },
      });

      if (!name || !description || !weight || !stock || !price || !category) {
        throw {
          isError: true,
          message: "Data is incomplete, please fulfill the field",
          data: null,
        };
      }

      if (checkName) {
        throw {
          isError: true,
          message: "Your name is already registered, please try another name",
          data: null,
        };
      }

      if (weight <= 0) {
        throw {
          isError: true,
          message:
            "Weight field is invalid, please input positive integer or positive decimal",
          data: null,
        };
      }
      if (stock < 1) {
        throw {
          isError: true,
          message: "Stock field  is invalid, please input positive integer",
          data: null,
        };
      }
      if (price <= 0) {
        throw {
          isError: true,
          message: "Price field is invalid, please input positive integer",
          data: null,
        };
      }

      let productCategories = await product_categories.findOne({
        where: { name: category },
        attributes: ["name", "id"],
      });
      console.log(productCategories);
      if (productCategories == null) {
        throw {
          isError: true,
          message: "Categories is invalid, please choose the exist category",
          data: null,
        };
      }

      let product_categories_id = productCategories.dataValues.id;
      // console.log(product_categories_id);
      let voucher_id;
      let discount_id;
      if (discountType && voucherType) {
        throw {
          isError: true,
          message: "Please input voucher type or discounty type only",
          data: null,
        };
      }

      if (discountType) {
        let discountCheck = await discounts.findOne({
          where: {
            discount_type: discountType,
          },
          attributes: ["discount_type", "id"],
        });
        if (!discountCheck) {
          throw {
            isError: true,
            message:
              "Discount type is invalid , please choose the exist discount type",
            data: null,
          };
        }
        let discount_id = discountCheck.dataValues.id;
      }

      if (voucherType) {
        let voucherCheck = await vouchers.findOne({
          where: {
            voucher_type: voucherType,
          },
          attributes: ["voucher_type", "id"],
        });
        if (!voucherCheck) {
          throw {
            isError: true,
            message:
              "Voucher type is invalid, please choose the exist voucher type",
            data: null,
          };
        }
        let voucher_id = voucherCheck.dataValues.id;
      }

      if (productImage && !voucher_id && !discount_id) {
        let imagePath = productImage[0].path;
        console.log(imagePath);
        let createProduct = await item_products.create(
          {
            name,
            images: imagePath,
            description,
            weight,
            stock,
            price,
            branch_stores_id,
            product_categories_id,
          },
          { transaction: t }
        );
        await t.commit();
        res.status(200).send({
          isError: false,
          message: "Create Product is success",
          data: createProduct,
        });
      } else if (productImage && voucher_id && !discount_id) {
        let imagePath = productImage[0].path;
        let createProduct = await item_products.create(
          {
            name,
            images: imagePath,
            description,
            weight,
            stock,
            price,
            branch_stores_id,
            product_categories_id,
            voucher_id,
          },
          { transaction: t }
        );
        await t.commit();
        res.status(200).send({
          isError: false,
          message: "Create Product is success",
          data: createProduct,
        });
      } else if (productImage && !voucher_id && discount_id) {
        let imagePath = productImage[0].path;
        let createProduct = await item_products.create(
          {
            name,
            images: imagePath,
            description,
            weight,
            stock,
            price,
            branch_stores_id,
            product_categories_id,
            discount_id,
          },
          { transaction: t }
        );
        await t.commit();
        res.status(200).send({
          isError: false,
          message: "Create Product is success",
          data: createProduct,
        });
      } else if (!productImage && !voucher_id && !discount_id) {
        let createProduct = await item_products.create(
          {
            name,
            description,
            weight,
            stock,
            price,
            branch_stores_id,
            product_categories_id,
          },
          { transaction: t }
        );
        await t.commit();
        res.status(200).send({
          isError: false,
          message: "Create Product is success",
          data: createProduct,
        });
      } else if (!productImage && voucher_id && !discount_id) {
        let createProduct = await item_products.create(
          {
            name,
            description,
            weight,
            stock,
            price,
            branch_stores_id,
            product_categories_id,
            voucher_id,
          },
          { transaction: t }
        );
        await t.commit();
        res.status(200).send({
          isError: false,
          message: "Create Product is success",
          data: createProduct,
        });
      } else if (!productImage && !voucher_id && discount_id) {
        let createProduct = await item_products.create(
          {
            name,
            description,
            weight,
            stock,
            price,
            branch_stores_id,
            product_categories_id,
            voucher_id,
          },
          { transaction: t }
        );
        await t.commit();
        res.status(200).send({
          isError: false,
          message: "Create Product is success",
          data: createProduct,
        });
      }
    } catch (error) {
      await t.rollback();
      if (req.files.images) deleteFiles(req.files.images);
      console.log(error);
      res.status(500).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  updateProduct: async (req, res) => {
    const t = await sequelize.transaction();
    // Ambil data dari body,filesimages, dan token
    try {
      const {
        admins_id,
        name: admins_name,
        email,
        role,
        isActive,
        branch_stores_id,
      } = req.dataToken;
      let {
        name,
        description,
        weight,
        stock,
        price,
        category,
        discountType,
        voucherType,
      } = req.body;
      // Validasi Admin
      if (isActive === false) {
        res.status(404).send({
          isError: true,
          messasge: "Admin is not active, please contact to super admin",
          data: null,
        });
        return;
      }
      if (role !== "admin branch") {
        res.status(404).send({
          isError: true,
          message: "Role is not permitted",
          data: null,
        });
        return;
      }
      let productImage = req.files.images;
      let dataToSend = {};
      let { id } = req.params;
      // Ambil branchstore id berdasarkan admins_id

      let dataProduct = await item_products.findOne({
        where: { id, branch_stores_id },
      });
      if (!dataProduct) {
        throw {
          isError: true,
          message: "Id product invalid, please input valid id product",
          data: null,
        };
      }
      console.log(
        admins_id,
        admins_name,
        email,
        role,
        isActive,
        branch_stores_id
      );

      // Validasi Input
      if (name) {
        let checkName = await item_products.findOne({
          where: { name },
        });
        console.log(checkName);
        if (checkName) {
          throw {
            isError: true,
            message: "Your name is already registered, please try another name",
            data: null,
          };
        } else {
          await item_products.update(
            {
              name,
            },
            { where: { id, branch_stores_id } },
            { transactions: t }
          );
          dataToSend.name = name;
        }
      }

      if (description) {
        await item_products.update(
          {
            description,
          },
          { where: { id, branch_stores_id } },
          { transaction: t }
        );
        dataToSend.description = description;
      }

      if (weight) {
        if (weight <= 0) {
          throw {
            isError: true,
            message:
              "Weight field is invalid, please input positive integer or positive decimal",
            data: null,
          };
        } else {
          await item_products.update(
            {
              weight,
            },
            { where: { id, branch_stores_id } },
            { transaction: t }
          );
          dataToSend.weight = weight;
        }
      }

      if (stock) {
        if (stock < 1) {
          throw {
            isError: true,
            message: "Stock field  is invalid, please input positive integer",
            data: null,
          };
        } else {
          await item_products.update(
            {
              stock,
            },
            { where: { id, branch_stores_id } },
            { transaction: t }
          );
          dataToSend.stock = stock;
        }
      }

      if (price) {
        if (price <= 0) {
          throw {
            isError: true,
            message: "Price field is invalid, please input positive integer",
            data: null,
          };
        } else {
          await item_products.update(
            {
              price,
            },
            { where: { id, branch_stores_id } },
            { transaction: t }
          );
          dataToSend.price = price;
        }
      }

      if (category) {
        let productCategories = await product_categories.findOne({
          where: { name: category },
          attributes: ["name", "id"],
        });
        if (!productCategories) {
          throw {
            isError: true,
            message: "Categories is invalid, please choose the exist category",
            data: null,
          };
        } else {
          let product_categories_id = productCategories.dataValues.id;
          await item_products.update(
            {
              product_categories_id,
            },
            {
              where: { id, branch_stores_id },
            },
            { transaction: t }
          );
          dataToSend.product_categories_id = product_categories_id;
        }
      }
      if (discountType && voucherType) {
        throw {
          isError: true,
          message: "Please input voucher type or discounty type only",
          data: null,
        };
      }
      if (discountType) {
        let discountCheck = await discounts.findOne({
          where: {
            discount_type: discountType,
          },
          attributes: ["discount_type", "id"],
        });
        if (!discountCheck) {
          throw {
            isError: true,
            message:
              "Discount type is invalid , please choose the exist discount type",
            data: null,
          };
        }
        let discount_id = discountCheck.dataValues.id;
        await item_products.update(
          { discount_id },
          {
            where: { id, branch_stores_id },
          },
          { transaction: t }
        );
        dataToSend.discount_id = discount_id;
      }
      if (voucherType) {
        let voucherCheck = await vouchers.findOne({
          where: {
            voucher_type: voucherType,
          },
          attributes: ["voucher_type", "id"],
        });
        if (!voucherCheck) {
          throw {
            isError: true,
            message:
              "Voucher type is invalid, please choose the exist voucher type",
            data: null,
          };
        }
        let voucher_id = voucherCheck.dataValues.id;
        await item_products.update(
          { voucher_id },
          {
            where: { id, branch_stores_id },
          },
          { transaction: t }
        );
        dataToSend.voucher_id = voucher_id;
      }
      if (productImage) {
        if (dataProduct.dataValues.image) {
          await fs.unlink(dataProduct.dataValues.image);
        }
        let imagePath = productImage[0].path;
        await item_products.update(
          { images: imagePath },
          { where: { id, branch_stores_id } },
          { transaction: t }
        );

        dataToSend.imagePath = imagePath;
      }
      await t.commit();
      res.status(200).send({
        isError: false,
        message: "Update Product Success",
        data: dataToSend,
      });
    } catch (error) {
      await t.rollback();
      if (req.files.images) deleteFiles(req.files.images);
      console.log(error);
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  deleteProduct: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const {
        admins_id,
        name: admins_name,
        email,
        role,
        isActive,
        branch_stores_id,
      } = req.dataToken;
      const { id } = req.params;
      // Validasi Admin
      if (isActive === false) {
        res.status(404).send({
          isError: true,
          messasge: "Admin is not active, please contact to super admin",
          data: null,
        });
        return;
      }
      if (role !== "admin branch") {
        res.status(404).send({
          isError: true,
          message: "Role is not permitted",
          data: null,
        });
        return;
      }

      let dataProduct = await item_products.findOne({
        where: { id, branch_stores_id },
      });
      if (!dataProduct) {
        throw {
          isError: true,
          message: "Id product invalid, please input valid id product",
          data: null,
        };
      } else {
        if (dataProduct.dataValues.image) {
          await fs.unlink(dataProduct.dataValues.image);
        }
        let deletedProduct = await item_products.destroy(
          {
            where: {
              id,
              branch_stores_id,
            },
          },
          { transaction: t }
        );

        await t.commit();
        res.status(200).send({
          isError: false,
          message: `Product ID ${id} has been success deleted`,
          data: deletedProduct,
        });
      }
    } catch (error) {
      await t.rollback();
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  getProductByQuery: async (req, res) => {
    try {
      const {
        admins_id,
        name: admins_name,
        email,
        role,
        isActive,
        branch_stores_id,
      } = req.dataToken;
      // Validasi Admin
      if (isActive === false) {
        res.status(404).send({
          isError: true,
          messasge: "Admin is not active, please contact to super admin",
          data: null,
        });
        return;
      }
      if (role !== "admin branch") {
        res.status(404).send({
          isError: true,
          message: "Role is not permitted",
          data: null,
        });
        return;
      }

      const categories = req.query.categories || null;
      console.log(categories);
      const sortBy = req.query.sort;
      console.log(sortBy);
      const ascOrDesc = req.query.asc;
      console.log(ascOrDesc);

      let sort = "";
      let category;
      if (categories !== null) {
        category = categories.split(",");
      }
      if (sortBy == "id") {
        sort = "i.id" + " " + ascOrDesc;
      } else if (sortBy == "category") {
        sort = "pc.name" + " " + ascOrDesc;
      } else if (sortBy == "price") {
        sort = "i.price" + " " + ascOrDesc;
      } else {
        sort = "i.name" + " " + ascOrDesc;
      }
      console.log(sort);
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 0;
      const search = req.query.search_query || "";
      const offset = limit * page;
      let totalRows, totalPage, result;
      if (categories === null) {
        let totalRows = await sequelize.query(
          `
      SELECT count(*) as count_row
FROM online_groceries.item_products i
LEFT JOIN product_categories pc ON i.product_categories_id = pc.id
LEFT JOIN vouchers v on i.vouchers_id = v.id
LEFT JOIN discounts d on i.discount_id = d.id
where branch_stores_id = :branch_stores_id and( i.name like :search  or pc.name like :search or d.discount_type like :search or v.voucher_type like :search) and pc.name is not :categories 

`,
          {
            replacements: {
              search: "%" + search + "%",
              categories,
              branch_stores_id: branch_stores_id,
            },
            type: sequelize.QueryTypes.SELECT,
          }
        );
        let totalPage = Math.ceil(totalRows[0].count_row / limit);
        // console.log(totalPage);
        let result = await sequelize.query(
          `
      SELECT i.id,i.name,i.images,i.description,i.weight,pc.name as categories,i.stock,i.price,DATE_FORMAT(i.createdAt, "%d %M %Y") as createdAt, DATE_FORMAT(i.updatedAt, "%d %M %Y") as updatedAt, v.voucher_type as voucherType, d.discount_type as discountType  
FROM online_groceries.item_products i
LEFT JOIN product_categories pc ON i.product_categories_id = pc.id
LEFT JOIN vouchers v on i.vouchers_id = v.id
LEFT JOIN discounts d on i.discount_id = d.id
where branch_stores_id = :branch_stores_id and( i.name like :search  or pc.name like :search or d.discount_type like :search or v.voucher_type like :search) and pc.name is not :categories
group by i.id
order by ${sort}
LIMIT :limit OFFSET :offset
`,
          {
            replacements: {
              search: "%" + search + "%",
              branch_stores_id: branch_stores_id,
              categories,
              limit,
              offset,
            },
            type: sequelize.QueryTypes.SELECT,
          }
        );
        result.map((value, index) => {
          if (typeof value.images === "string") {
            value.images = generateUrlAdmin(value.images);
          }
        });
        // console.log(result);
        let dataToSend = { result, page, limit, totalRows, totalPage };
        res.status(200).send({
          isError: false,
          message: "Query Product Success",
          data: dataToSend,
        });
      } else {
        let totalRows = await sequelize.query(
          `
      SELECT count(*) as count_row
FROM online_groceries.item_products i
LEFT JOIN product_categories pc ON i.product_categories_id = pc.id
LEFT JOIN vouchers v on i.vouchers_id = v.id
LEFT JOIN discounts d on i.discount_id = d.id
where branch_stores_id = :branch_stores_id and( i.name like :search  or pc.name like :search or d.discount_type like :search or v.voucher_type like :search) and pc.name in (:category) 
`,
          {
            replacements: {
              search: "%" + search + "%",
              category,
              branch_stores_id: branch_stores_id,
            },
            type: sequelize.QueryTypes.SELECT,
          }
        );
        let totalPage = Math.ceil(totalRows[0].count_row / limit);
        // console.log(totalPage);
        let result = await sequelize.query(
          `
      SELECT i.id,i.name,i.images,i.description,i.weight,pc.name as categories,i.stock,i.price,DATE_FORMAT(i.createdAt, "%d %M %Y") as createdAt, DATE_FORMAT(i.updatedAt, "%d %M %Y") as updatedAt, v.voucher_type as voucherType, d.discount_type as discountType  
FROM online_groceries.item_products i
LEFT JOIN product_categories pc ON i.product_categories_id = pc.id
LEFT JOIN vouchers v on i.vouchers_id = v.id
LEFT JOIN discounts d on i.discount_id = d.id
where branch_stores_id = :branch_stores_id and( i.name like :search  or pc.name like :search or d.discount_type like :search or v.voucher_type like :search) and pc.name in (:category)
Group by i.id
order by ${sort}
LIMIT :limit OFFSET :offset
`,
          {
            replacements: {
              search: "%" + search + "%",
              branch_stores_id: branch_stores_id,
              category,
              limit,
              offset,
            },
            type: sequelize.QueryTypes.SELECT,
          }
        );
        // console.log(result);
        result.map((value, index) => {
          if (typeof value.images === "string") {
            value.images = generateUrlAdmin(value.images);
          }
        });
        let dataToSend = { result, page, limit, totalRows, totalPage };
        res.status(200).send({
          isError: false,
          message: "Query Product Success",
          data: dataToSend,
        });
      }
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  UpdateStockProduct: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const {
        admins_id: admin_id,
        role,
        isActive,
        branch_stores_id,
      } = req.dataToken;
      const { id } = req.params;
      const { stock, description } = req.query;

      if (role !== "admin branch" || isActive === false)
        throw { message: "Unauthorization" };

      let dataExist = await item_products.findOne({
        where: {
          [Op.and]: [{ id: id }, { branch_stores_id }],
        },
      });

      if (dataExist === null)
        throw { message: "Only the related admin can change the stock " };
      if (!stock) throw { message: " Input stock require  " };
      if (!description)
        throw { message: "Input description why you change stock require" };

      let beforeUpdated = await item_products.findAll(
        {
          attributes: [
            ["id", "id_product"],
            "name",
            "stock",
            [Sequelize.literal(`stock + ${stock}`), "new_stock"],
            [Sequelize.literal("branch_store.id"), "id_branch"],
            [Sequelize.literal("branch_store.name"), "branch"],
            [Sequelize.literal("product_category.name"), "category"],
          ],
          where: {
            id,
          },

          include: [
            {
              model: branch_stores,
              attributes: ["id"],
              include: [
                {
                  model: admin,
                  attributes: ["name", "isActive", "role"],
                },
              ],
            },
            {
              model: product_categories,
              attributes: [],
            },
          ],
        },
        { transaction: t }
      );

      let [newData] = beforeUpdated;

      if (newData.dataValues.new_stock < 0)
        throw {
          message: `Can't update stock because it makes negative, current stock ${newData.dataValues.stock}`,
        };

      const updateStock = await item_products.update(
        {
          stock: newData.dataValues.new_stock,
        },
        { where: { id } },
        { transaction: t }
      );

      await historyLog.create(
        {
          admin_name: newData.dataValues.branch_store.dataValues.admins.name,
          branch_store: newData.dataValues.branch,
          product_name: newData.dataValues.name,
          qty: stock,
          description: `Update : ${description}`,
        },
        { transaction: t }
      );

      await t.commit();
      res.status(201).send({
        isSuccess: true,
        message: "Updated stock success",
      });
    } catch (error) {
      console.log(error);
      await t.rollback();
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  deleteStock: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const {
        admins_id: admin_id,
        role,
        isActive,
        branch_stores_id,
      } = req.dataToken;
      const { id } = req.params;
      const { description } = req.query;

      if (role !== "admin branch" || isActive === false)
        throw { message: "Unauthorization" };

      let dataExist = await item_products.findOne({
        attributes: ["stock"],
        where: {
          [Op.and]: [{ id }, { branch_stores_id }],
        },
      });

      if (dataExist === null)
        throw { message: "Only the related admin can delete the stock " };

      if (!description)
        throw { message: " Input description why you delete stoct require  " };

      if (dataExist.dataValues.stock <= 0) {
        throw { message: "Cannot delete stock, because current stock 0" };
      }

      await item_products.update(
        {
          stock: 0,
        },
        { where: { id } },
        { transaction: t }
      );

      let afterDelete = await item_products.findAll(
        {
          attributes: [
            ["id", "id_product"],
            "name",
            ["stock", "stock"],
            [Sequelize.literal("branch_store.id"), "id_branch"],
            [Sequelize.literal("branch_store.name"), "branch"],
            [Sequelize.literal("product_category.name"), "category"],
          ],
          where: {
            id: id,
          },

          include: [
            {
              model: branch_stores,
              attributes: ["id"],
              include: [
                {
                  model: admin,
                  attributes: ["name", "role", "isActive"],
                },
              ],
            },
            {
              model: product_categories,
              attributes: [],
            },
          ],
        },
        { transaction: t }
      );

      let [dataWasDelete] = afterDelete;
      await historyLog.create(
        {
          admin_name:
            dataWasDelete.dataValues.branch_store.dataValues.admins.name,
          branch_store: dataWasDelete.dataValues.branch,
          product_name: dataWasDelete.dataValues.name,
          qty: dataExist.dataValues.stock,
          description: `Delete : ${description}`,
        },
        { transaction: t }
      );

      await t.commit();
      res.status(201).send({
        isSuccess: true,
        message: "Delete stock success",
      });
    } catch (error) {
      await t.rollback();

      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  getAllStockProduct: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { admins_id: admin_id, role, isActive } = req.dataToken;
      if (role !== "admin branch" || isActive === false)
        throw { message: "Unauthorization" };

      let branchId = await branch_stores.findOne({
        attributes: [
          ["id", "branch_id"],
          "name",
          [Sequelize.literal("admin.id"), "admins"],
          [Sequelize.literal("admin.name"), "names"],
        ],
        include: [
          {
            model: admin,
            attributes: [],
            where: { id: admin_id },
          },
        ],
      });

      const branch_stores_id = branchId.dataValues.branch_id;

      let getAllData = await item_products.findAll({
        attributes: ["id", "name", "stock"],
        where: { branch_stores_id },
      });

      await t.commit();
      res.status(201).send({
        isSuccess: true,
        data: getAllData,
      });
    } catch (error) {
      await t.rollback();

      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
};

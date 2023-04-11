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

module.exports = {
  // get order list for admin branch
  getOrderListByQuery: async (req, res) => {
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
      const branchStore = await branch_stores.findOne({
        where: { id: branch_stores_id },
      });
      const branchName = branchStore.dataValues.name;
      const status = req.query.status || null;
      console.log(status);
      const sortBy = req.query.sort;
      console.log(sortBy);
      const ascOrDesc = req.query.asc;
      console.log(ascOrDesc);

      let sort = "";
      let statusOrder;
      if (status !== null) {
        statusOrder = status.split(",");
      }
      if (sortBy == "id") {
        sort = "t.id" + " " + ascOrDesc;
      } else if (sortBy == "status") {
        sort = "t.status" + " " + ascOrDesc;
      } else if (sortBy == "invoice") {
        sort = "t.invoice_no" + " " + ascOrDesc;
      } else if (sortBy == "date") {
        sort = "t.createdAt" + " " + ascOrDesc;
      } else if (sortBy == "price") {
        sort = "t.total_price" + " " + ascOrDesc;
      } else if (sortBy == "expired") {
        sort = "t.expired_date" + " " + ascOrDesc;
      } else if (sortBy == "name") {
        sort = "us.name " + " " + ascOrDesc;
      }
      console.log(sort);
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 0;
      const search = req.query.search_query || "";
      const offset = limit * page;
      let totalRows, totalPage, result;

      if (status === null) {
        let totalRows = await sequelize.query(
          `
          SELECT count(*) as count_row
          FROM transactions t
          LEFT JOIN users us on t.users_id = us.id 
          where t.branch_store = :branchName and (t.branch_store like :search or t.status like :search or us.name like :search or t.invoice_no like :search or t.id like :search) and t.status is not :status
    
    `,
          {
            replacements: {
              search: "%" + search + "%",
              status,
              branchName,
            },
            type: sequelize.QueryTypes.SELECT,
          }
        );
        let totalPage = Math.ceil(totalRows[0].count_row / limit);
        // console.log(totalPage);
        let result = await sequelize.query(
          `
            SELECT t.id,t.invoice_no,t.payment_proof,DATE_FORMAT(t.expired_date, "%d %M %Y") as expired_date, t.admin_name,t.branch_store,t.total_price,t.status, us.name, t.users_id, DATE_FORMAT(t.createdAt, "%d %M %Y") as Date, DATE_FORMAT(t.updatedAt, "%d %M %Y") as updatedAt
            FROM transactions t
            JOIN transaction_details td ON td.transactions_id = t.id
            LEFT JOIN users us on t.users_id = us.id
            where t.branch_store= :branchName and (t.branch_store like :search or t.status like :search or us.name like :search or t.invoice_no like :search or t.id like :search) and t.status is not :status
            Group by t.id
    order by ${sort}
    LIMIT :limit OFFSET :offset
    `,
          {
            replacements: {
              search: "%" + search + "%",
              branchName,
              status,
              limit,
              offset,
            },
            type: sequelize.QueryTypes.SELECT,
          }
        );
        result.map((value, index) => {
          if (typeof value.payment_proof === "string") {
            value.payment_proof = generateUrlAdmin(value.payment_proof);
          }
        });

        // console.log(result);
        let dataToSend = { result, page, limit, totalRows, totalPage };
        res.status(200).send({
          isError: false,
          message: "Query Order List Success",
          data: dataToSend,
        });
      } else {
        let totalRows = await sequelize.query(
          `
            SELECT count(*) as count_row
            FROM transactions t
            LEFT JOIN users us on t.users_id = us.id 
            where t.branch_store = :branchName and (t.status like :search or us.name like :search or t.invoice_no like :search or t.id like :search) and t.status  in (:statusOrder)
    `,
          {
            replacements: {
              search: "%" + search + "%",
              statusOrder,
              branchName,
            },
            type: sequelize.QueryTypes.SELECT,
          }
        );
        let totalPage = Math.ceil(totalRows[0].count_row / limit);
        // console.log(totalPage);
        let result = await sequelize.query(
          `
            SELECT t.id,t.invoice_no,t.payment_proof,DATE_FORMAT(t.expired_date, "%d %M %Y") as expired_date, t.admin_name,t.branch_store,t.total_price,t.status, us.name, t.users_id, DATE_FORMAT(t.createdAt, "%d %M %Y") as Date, DATE_FORMAT(t.updatedAt, "%d %M %Y") as updatedAt
            FROM transactions t
            JOIN transaction_details td ON td.transactions_id = t.id
            LEFT JOIN users us on t.users_id = us.id
            where t.branch_store= :branchName and (t.status like :search or us.name like :search or t.invoice_no like :search or t.id like :search) and t.status in (:statusOrder)
            Group by t.id
    order by ${sort}
    LIMIT :limit OFFSET :offset
    `,
          {
            replacements: {
              search: "%" + search + "%",
              branchName,
              statusOrder,
              limit,
              offset,
            },
            type: sequelize.QueryTypes.SELECT,
          }
        );
        // console.log(result);
        result.map((value, index) => {
          if (typeof value.payment_proof === "string") {
            value.payment_proof = generateUrlAdmin(value.payment_proof);
          }
        });
        let dataToSend = { result, page, limit, totalRows, totalPage };
        res.status(200).send({
          isError: false,
          message: "Query Order List Success",
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

  // get detail order list for branch admin
  getDetailOrderByQuery: async (req, res) => {
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
      const branchStore = await branch_stores.findOne({
        where: { id: branch_stores_id },
      });
      const branchName = branchStore.dataValues.name;

      const sortBy = req.query.sort;
      console.log(sortBy);
      const ascOrDesc = req.query.asc;
      console.log(ascOrDesc);

      let sort = "";

      if (sortBy == "id") {
        sort = "td.id" + " " + ascOrDesc;
      } else if (sortBy == "transaction") {
        sort = "td.transactions_id" + " " + ascOrDesc;
      } else if (sortBy == "product") {
        sort = "td.product_name" + " " + ascOrDesc;
      } else if (sortBy == "qty") {
        sort = "td.qty" + " " + ascOrDesc;
      } else if (sortBy == "discount") {
        sort = "td.discount_type" + " " + ascOrDesc;
      } else if (sortBy == "voucher") {
        sort = "td.voucher_type" + " " + ascOrDesc;
      } else if (sortBy == "name") {
        sort = "us.name" + " " + ascOrDesc;
      } else if (sortBy == "price") {
        sort = "td.price_per_item" + " " + ascOrDesc;
      } else if (sortBy == "weight") {
        sort = "td.weight" + " " + ascOrDesc;
      } else if (sortBy == "percent") {
        sort = "td.cut_percentage" + " " + ascOrDesc;
      } else if (sortBy == "nominal") {
        sort = "td.cut_nominal" + " " + ascOrDesc;
      }
      console.log(sort);
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 0;
      const search = req.query.search_query || "";
      const offset = limit * page;

      let totalRows = await sequelize.query(
        `
        SELECT count(*) as count_row 
        FROM transactions t
        JOIN transaction_details td ON td.transactions_id = t.id
        LEFT JOIN users us on t.users_id = us.id
        where t.branch_store=:branchName and (td.id like :search or td.transactions_id like :search or td.product_name like :search or td.qty like :search or td.discount_type like :search or td.voucher_type like :search or us.name like :search)
    `,
        {
          replacements: {
            search: "%" + search + "%",
            branchName,
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      let totalPage = Math.ceil(totalRows[0].count_row / limit);
      // console.log(totalPage);
      let result = await sequelize.query(
        `
        SELECT td.id,td.transactions_id,td.product_name,td.qty,td.discount_type,td.voucher_type,td.price_per_item,td.weight,us.name,td.cut_percentage, td.cut_nominal, DATE_FORMAT(td.updatedAt, "%d %M %Y") as updatedAt, DATE_FORMAT(t.createdAt, "%d %M %Y") as createdAt
        FROM transactions t
        JOIN transaction_details td ON td.transactions_id = t.id
        LEFT JOIN users us on t.users_id = us.id
        where t.branch_store=:branchName and (td.id like :search or td.transactions_id like :search or td.product_name like :search or td.qty like :search or td.discount_type like :search or td.voucher_type like :search or us.name like :search)
        Group by td.id
    order by ${sort}
    LIMIT :limit OFFSET :offset
    `,
        {
          replacements: {
            search: "%" + search + "%",
            branchName,
            limit,
            offset,
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      // console.log(result);
      let dataToSend = {
        result,
        page,
        limit,
        totalRows,
        totalPage,
        branchName,
      };
      res.status(200).send({
        isError: false,
        message: "Query Detail Order List Success",
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

  // get order list for super admin
  getSuperOrderListByQuery: async (req, res) => {
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
      if (role !== "super admin") {
        res.status(404).send({
          isError: true,
          message: "Role is not permitted",
          data: null,
        });
        return;
      }

      const status = req.query.status || null;
      const sortBy = req.query.sort;
      const ascOrDesc = req.query.asc;

      let sort = "";
      let statusOrder;
      if (status !== null) {
        statusOrder = status.split(",");
      }
      if (sortBy == "id") {
        sort = "t.id" + " " + ascOrDesc;
      } else if (sortBy == "status") {
        sort = "t.status" + " " + ascOrDesc;
      } else if (sortBy == "invoice") {
        sort = "t.invoice_no" + " " + ascOrDesc;
      } else if (sortBy == "date") {
        sort = "t.createdAt" + " " + ascOrDesc;
      } else if (sortBy == "price") {
        sort = "t.total_price" + " " + ascOrDesc;
      } else if (sortBy == "expired") {
        sort = "t.expired_date" + " " + ascOrDesc;
      } else if (sortBy == "name") {
        sort = "us.name " + " " + ascOrDesc;
      }
      console.log(sort);
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 0;
      const search = req.query.search_query || "";
      const offset = limit * page;
      let totalRows, totalPage, result;

      if (status === null) {
        let totalRows = await sequelize.query(
          `
          SELECT count(*) as count_row
          FROM transactions t
          LEFT JOIN users us on t.users_id = us.id 
          where (t.branch_store like :search or t.status like :search or us.name like :search or t.invoice_no like :search or t.id like :search) and t.status is not :status
    
    `,
          {
            replacements: {
              search: "%" + search + "%",
              status,
            },
            type: sequelize.QueryTypes.SELECT,
          }
        );
        let totalPage = Math.ceil(totalRows[0].count_row / limit);
        // console.log(totalPage);
        let result = await sequelize.query(
          `
            SELECT t.id,t.invoice_no,t.payment_proof,DATE_FORMAT(t.expired_date, "%d %M %Y") as expired_date, t.admin_name,t.branch_store,t.total_price,t.status, us.name, t.users_id, DATE_FORMAT(t.createdAt, "%d %M %Y") as Date, DATE_FORMAT(t.updatedAt, "%d %M %Y") as updatedAt
            FROM transactions t
            JOIN transaction_details td ON td.transactions_id = t.id
            LEFT JOIN users us on t.users_id = us.id
            where (t.branch_store like :search or t.status like :search or us.name like :search or t.invoice_no like :search or t.id like :search) and t.status is not :status
            Group by t.id
    order by ${sort}
    LIMIT :limit OFFSET :offset
    `,
          {
            replacements: {
              search: "%" + search + "%",
              status,
              limit,
              offset,
            },
            type: sequelize.QueryTypes.SELECT,
          }
        );
        result.map((value, index) => {
          if (typeof value.payment_proof === "string") {
            value.payment_proof = generateUrlAdmin(value.payment_proof);
          }
        });

        // console.log(result);
        let dataToSend = { result, page, limit, totalRows, totalPage };
        res.status(200).send({
          isError: false,
          message: "Query Order List Success",
          data: dataToSend,
        });
      } else {
        let totalRows = await sequelize.query(
          `
            SELECT count(*) as count_row
            FROM transactions t
            LEFT JOIN users us on t.users_id = us.id 
            where (t.status like :search or us.name like :search or t.invoice_no like :search or t.id like :search) and t.status  in (:statusOrder)
    `,
          {
            replacements: {
              search: "%" + search + "%",
              statusOrder,
            },
            type: sequelize.QueryTypes.SELECT,
          }
        );
        let totalPage = Math.ceil(totalRows[0].count_row / limit);
        // console.log(totalPage);
        let result = await sequelize.query(
          `
            SELECT t.id,t.invoice_no,t.payment_proof,DATE_FORMAT(t.expired_date, "%d %M %Y") as expired_date, t.admin_name,t.branch_store,t.total_price,t.status, us.name, t.users_id, DATE_FORMAT(t.createdAt, "%d %M %Y") as Date, DATE_FORMAT(t.updatedAt, "%d %M %Y") as updatedAt
            FROM transactions t
            JOIN transaction_details td ON td.transactions_id = t.id
            LEFT JOIN users us on t.users_id = us.id
            where (t.status like :search or us.name like :search or t.invoice_no like :search or t.id like :search) and t.status in (:statusOrder)
            Group by t.id
    order by ${sort}
    LIMIT :limit OFFSET :offset
    `,
          {
            replacements: {
              search: "%" + search + "%",
              statusOrder,
              limit,
              offset,
            },
            type: sequelize.QueryTypes.SELECT,
          }
        );
        // console.log(result);
        result.map((value, index) => {
          if (typeof value.payment_proof === "string") {
            value.payment_proof = generateUrlAdmin(value.payment_proof);
          }
        });
        let dataToSend = { result, page, limit, totalRows, totalPage };
        res.status(200).send({
          isError: false,
          message: "Query Order List Success",
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


  // get detail order list for super admin
  getSuperDetailOrderByQuery: async (req, res) => {
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
      if (role !== "super admin") {
        res.status(404).send({
          isError: true,
          message: "Role is not permitted",
          data: null,
        });
        return;
      }

      const sortBy = req.query.sort;
      console.log(sortBy);
      const ascOrDesc = req.query.asc;
      console.log(ascOrDesc);

      let sort = "";

      if (sortBy == "id") {
        sort = "td.id" + " " + ascOrDesc;
      } else if (sortBy == "transaction") {
        sort = "td.transactions_id" + " " + ascOrDesc;
      } else if (sortBy == "product") {
        sort = "td.product_name" + " " + ascOrDesc;
      } else if (sortBy == "qty") {
        sort = "td.qty" + " " + ascOrDesc;
      } else if (sortBy == "discount") {
        sort = "td.discount_type" + " " + ascOrDesc;
      } else if (sortBy == "voucher") {
        sort = "td.voucher_type" + " " + ascOrDesc;
      } else if (sortBy == "name") {
        sort = "us.name" + " " + ascOrDesc;
      } else if (sortBy == "price") {
        sort = "td.price_per_item" + " " + ascOrDesc;
      } else if (sortBy == "weight") {
        sort = "td.weight" + " " + ascOrDesc;
      } else if (sortBy == "percent") {
        sort = "td.cut_percentage" + " " + ascOrDesc;
      } else if (sortBy == "nominal") {
        sort = "td.cut_nominal" + " " + ascOrDesc;
      }
      console.log(sort);
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 0;
      const search = req.query.search_query || "";
      const offset = limit * page;

      let totalRows = await sequelize.query(
        `
        SELECT count(*) as count_row 
        FROM transactions t
        JOIN transaction_details td ON td.transactions_id = t.id
        LEFT JOIN users us on t.users_id = us.id
        where (td.id like :search or td.transactions_id like :search or td.product_name like :search or td.qty like :search or td.discount_type like :search or td.voucher_type like :search or us.name like :search)
    `,
        {
          replacements: {
            search: "%" + search + "%",
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      let totalPage = Math.ceil(totalRows[0].count_row / limit);
      // console.log(totalPage);
      let result = await sequelize.query(
        `
        SELECT td.id,td.transactions_id,td.product_name,td.qty,td.discount_type,td.voucher_type,td.price_per_item,td.weight,us.name,td.cut_percentage, td.cut_nominal, DATE_FORMAT(td.updatedAt, "%d %M %Y") as updatedAt, DATE_FORMAT(t.createdAt, "%d %M %Y") as createdAt
        FROM transactions t
        JOIN transaction_details td ON td.transactions_id = t.id
        LEFT JOIN users us on t.users_id = us.id
        where (td.id like :search or td.transactions_id like :search or td.product_name like :search or td.qty like :search or td.discount_type like :search or td.voucher_type like :search or us.name like :search)
        Group by td.id
    order by ${sort}
    LIMIT :limit OFFSET :offset
    `,
        {
          replacements: {
            search: "%" + search + "%",
            limit,
            offset,
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      // console.log(result);
      let dataToSend = {
        result,
        page,
        limit,
        totalRows,
        totalPage,
      };
      res.status(200).send({
        isError: false,
        message: "Query Detail Order List Success",
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

  // get order list user
  getOrderListUserByQuery: async (req, res) => {
    try {
      const {
        id
      } = req.dataToken;

      console.log('dataToken');
      console.log(req.dataToken);

      const status = req.query.status || null;
      const sortBy = req.query.sort;
      const ascOrDesc = req.query.asc;

      let sort = "";
      let statusOrder;
      if (status !== null) {
        statusOrder = status.split(",");
      }
      if (sortBy == "id") {
        sort = "t.id" + " " + ascOrDesc;
      } else if (sortBy == "status") {
        sort = "t.status" + " " + ascOrDesc;
      } else if (sortBy == "invoice") {
        sort = "t.invoice_no" + " " + ascOrDesc;
      } else if (sortBy == "date") {
        sort = "t.createdAt" + " " + ascOrDesc;
      } else if (sortBy == "price") {
        sort = "t.total_price" + " " + ascOrDesc;
      } else if (sortBy == "expired") {
        sort = "t.expired_date" + " " + ascOrDesc;
      } else if (sortBy == "name") {
        sort = "us.name " + " " + ascOrDesc;
      }
      console.log(sort);
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 0;
      const search = req.query.search_query || "";
      const offset = limit * page;
      let totalRows, totalPage, result;

      if (status === null) {
        let totalRows = await sequelize.query(
          `
          SELECT count(*) as count_row
          FROM transactions t
          LEFT JOIN users us on t.users_id = us.id 
          where t.users_id = :id and (t.branch_store like :search or t.status like :search or t.invoice_no like :search or t.id like :search) and t.status is not :status
    `,
          {
            replacements: {
              search: "%" + search + "%",
              status,
              id,
            },
            type: sequelize.QueryTypes.SELECT,
          }
        );
        let totalPage = Math.ceil(totalRows[0].count_row / limit);
        // console.log(totalPage);
        let result = await sequelize.query(
          `
            SELECT t.id,t.invoice_no,t.payment_proof,DATE_FORMAT(t.expired_date, "%d %M %Y") as expired_date, t.admin_name,t.branch_store,t.total_price,t.status, us.name, t.users_id, DATE_FORMAT(t.createdAt, "%d %M %Y") as Date, DATE_FORMAT(t.updatedAt, "%d %M %Y") as updatedAt
            FROM transactions t
            JOIN transaction_details td ON td.transactions_id = t.id
            LEFT JOIN users us on t.users_id = us.id
            where t.users_id= :id and (t.branch_store like :search or t.status like :search or t.invoice_no like :search or t.id like :search) and t.status is not :status
            Group by t.id
    order by ${sort}
    LIMIT :limit OFFSET :offset
    `,
          {
            replacements: {
              search: "%" + search + "%",
              id,
              status,
              limit,
              offset,
            },
            type: sequelize.QueryTypes.SELECT,
          }
        );
        result.map((value, index) => {
          if (typeof value.payment_proof === "string") {
            value.payment_proof = generateUrlAdmin(value.payment_proof);
          }
        });

        // console.log(result);
        let dataToSend = { result, page, limit, totalRows, totalPage };
        res.status(200).send({
          isError: false,
          message: "Query Order List Success",
          data: dataToSend,
        });
      } else {
        let totalRows = await sequelize.query(
          `
            SELECT count(*) as count_row
            FROM transactions t
            LEFT JOIN users us on t.users_id = us.id 
            where t.users_id = :id and (t.status like :search or t.invoice_no like :search or t.id like :search) and t.status  in (:statusOrder)
    `,
          {
            replacements: {
              search: "%" + search + "%",
              statusOrder,
              id,
            },
            type: sequelize.QueryTypes.SELECT,
          }
        );
        let totalPage = Math.ceil(totalRows[0].count_row / limit);
        // console.log(totalPage);
        let result = await sequelize.query(
          `
            SELECT t.id,t.invoice_no,t.payment_proof,DATE_FORMAT(t.expired_date, "%d %M %Y") as expired_date, t.admin_name,t.branch_store,t.total_price,t.status, us.name, t.users_id, DATE_FORMAT(t.createdAt, "%d %M %Y") as Date, DATE_FORMAT(t.updatedAt, "%d %M %Y") as updatedAt
            FROM transactions t
            JOIN transaction_details td ON td.transactions_id = t.id
            LEFT JOIN users us on t.users_id = us.id
            where t.users_id= :id and (t.status like :search or us.name like :search or t.invoice_no like :search or t.id like :search) and t.status in (:statusOrder)
            Group by t.id
    order by ${sort}
    LIMIT :limit OFFSET :offset
    `,
          {
            replacements: {
              search: "%" + search + "%",
              id,
              statusOrder,
              limit,
              offset,
            },
            type: sequelize.QueryTypes.SELECT,
          }
        );
        // console.log(result);
        result.map((value, index) => {
          if (typeof value.payment_proof === "string") {
            value.payment_proof = generateUrlAdmin(value.payment_proof);
          }
        });
        let dataToSend = { result, page, limit, totalRows, totalPage };
        res.status(200).send({
          isError: false,
          message: "Query Order List Success",
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

  // get detail orderlist user by transaction id
  getDetailOrderUserByQuery: async (req, res) => {
    try {
      const {
        id
      } = req.dataToken;

      const idtrx = req.params.idtrx
      console.log(`iduser: ${id}`);
      console.log(`idtrx: ${req.params.idtrx}`);

      const sortBy = req.query.sort;
      const ascOrDesc = req.query.asc;

      let sort = "";

      if (sortBy == "id") {
        sort = "td.id" + " " + ascOrDesc;
      } else if (sortBy == "transaction") {
        sort = "td.transactions_id" + " " + ascOrDesc;
      } else if (sortBy == "product") {
        sort = "td.product_name" + " " + ascOrDesc;
      } else if (sortBy == "qty") {
        sort = "td.qty" + " " + ascOrDesc;
      } else if (sortBy == "discount") {
        sort = "td.discount_type" + " " + ascOrDesc;
      } else if (sortBy == "voucher") {
        sort = "td.voucher_type" + " " + ascOrDesc;
      } else if (sortBy == "name") {
        sort = "us.name" + " " + ascOrDesc;
      } else if (sortBy == "price") {
        sort = "td.price_per_item" + " " + ascOrDesc;
      } else if (sortBy == "weight") {
        sort = "td.weight" + " " + ascOrDesc;
      } else if (sortBy == "percent") {
        sort = "td.cut_percentage" + " " + ascOrDesc;
      } else if (sortBy == "nominal") {
        sort = "td.cut_nominal" + " " + ascOrDesc;
      }
      console.log(sort);
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 0;
      const search = req.query.search_query || "";
      const offset = limit * page;

      let totalRows = await sequelize.query(
        `
        SELECT count(*) as count_row 
        FROM transactions t
        JOIN transaction_details td ON td.transactions_id = t.id
        LEFT JOIN users us on t.users_id = us.id
        where t.users_id=:id and (td.id like :search or td.transactions_id like :search or td.product_name like :search or td.qty like :search or td.discount_type like :search or td.voucher_type like :search or us.name like :search) and t.id=:idtrx
    `,
        {
          replacements: {
            search: "%" + search + "%",
            id,
            idtrx
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      let totalPage = Math.ceil(totalRows[0].count_row / limit);
      // console.log(totalPage);
      let result = await sequelize.query(
        `
        SELECT td.id,td.transactions_id,td.product_name,td.qty,td.discount_type,td.voucher_type,td.price_per_item,td.weight,us.name,td.cut_percentage, td.cut_nominal, DATE_FORMAT(td.updatedAt, "%d %M %Y") as updatedAt, DATE_FORMAT(t.createdAt, "%d %M %Y") as createdAt
        FROM transactions t
        JOIN transaction_details td ON td.transactions_id = t.id
        LEFT JOIN users us on t.users_id = us.id
        where t.users_id=:id and (td.id like :search or td.transactions_id like :search or td.product_name like :search or td.qty like :search or td.discount_type like :search or td.voucher_type like :search or us.name like :search) and t.id=:idtrx
        Group by td.id
    order by ${sort}
    LIMIT :limit OFFSET :offset
    `,
        {
          replacements: {
            search: "%" + search + "%",
            id,
            idtrx,
            limit,
            offset,
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      // console.log(result);
      let dataToSend = {
        result,
        page,
        limit,
        totalRows,
        totalPage,
      };
      res.status(200).send({
        isError: false,
        message: "Query Detail Order List Success",
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
};

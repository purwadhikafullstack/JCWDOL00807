const { sequelize, Sequelize } = require("./../models");
const { Op } = require("sequelize");
const schedule = require("node-schedule");
const transporter = require("../lib/nodemailer");
const handlebars = require("handlebars");
const fs = require("fs").promises;
const generateUrlAdmin = require("../helper/generateUrlAdmin");

//import env
require("dotenv").config();

// import model
const db = require("./../models/index");
const { stat } = require("fs");
const admin = db.admins;
const branch_stores = db.branch_stores;
const item_products = db.item_products;
const product_categories = db.product_categories;
const discounts = db.discounts;
const vouchers = db.vouchers;
const historyLog = db.stock_history_logs;
const transaction = db.transactions;
const stock_history_logs = db.stock_history_logs;
const transaction_detail = db.transaction_details;

const jobAutoConfirm = async (id) => {
  const t = await sequelize.transaction();
  try {
    const trxid = id;
    const getTransaction = await transaction.findOne({
      where: { id: trxid },
    });

    if (getTransaction.status == "On Delivering") {
      await transaction.update(
        {
          status: "Order Confirmed",
        },
        {
          where: {
            id: {
              [Op.eq]: trxid,
            },
          },
          transaction: t,
        }
      );
      await t.commit();
      console.log("success");
    } else {
      console.log("no action");
    }
  } catch (error) {
    console.log(error);
  }
};

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

      const idtrx = req.params.idtrx;

      console.log(`id transaction: ${idtrx}`);
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
        where t.branch_store=:branchName and (td.id like :search or td.transactions_id like :search or td.product_name like :search or td.qty like :search or td.discount_type like :search or td.voucher_type like :search or us.name like :search) and t.id=:idtrx
    `,
        {
          replacements: {
            search: "%" + search + "%",
            branchName,
            idtrx,
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      let totalPage = Math.ceil(totalRows[0].count_row / limit);
      // console.log(totalPage);
      let result = await sequelize.query(
        `
        SELECT td.id,td.transactions_id,t.invoice_no,t.status,td.product_name,td.qty,td.discount_type,td.voucher_type,td.price_per_item,td.weight,us.name,td.cut_percentage, td.cut_nominal, DATE_FORMAT(td.updatedAt, "%d %M %Y") as updatedAt, DATE_FORMAT(t.createdAt, "%d %M %Y") as createdAt
        FROM transactions t
        JOIN transaction_details td ON td.transactions_id = t.id
        LEFT JOIN users us on t.users_id = us.id
        where t.branch_store=:branchName and (td.id like :search or td.transactions_id like :search or td.product_name like :search or td.qty like :search or td.discount_type like :search or td.voucher_type like :search or us.name like :search) and t.id=:idtrx
        Group by td.id
    order by ${sort}
    LIMIT :limit OFFSET :offset
    `,
        {
          replacements: {
            search: "%" + search + "%",
            branchName,
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

  // get detail order list for branch admin
  getDetailOrderAllByQuery: async (req, res) => {
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
        SELECT td.id,td.transactions_id,t.invoice_no,t.status,td.product_name,td.qty,td.discount_type,td.voucher_type,td.price_per_item,td.weight,us.name,td.cut_percentage, td.cut_nominal, DATE_FORMAT(td.updatedAt, "%d %M %Y") as updatedAt, DATE_FORMAT(t.createdAt, "%d %M %Y") as createdAt
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

      const idtrx = req.params.idtrx;

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
        where (td.id like :search or td.transactions_id like :search or td.product_name like :search or td.qty like :search or td.discount_type like :search or td.voucher_type like :search or us.name like :search) and t.id=:idtrx
    `,
        {
          replacements: {
            search: "%" + search + "%",
            idtrx,
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      let totalPage = Math.ceil(totalRows[0].count_row / limit);
      // console.log(totalPage);
      let result = await sequelize.query(
        `
        SELECT td.id,td.transactions_id,t.invoice_no,t.status,td.product_name,td.qty,td.discount_type,td.voucher_type,td.price_per_item,td.weight,us.name,td.cut_percentage, td.cut_nominal, DATE_FORMAT(td.updatedAt, "%d %M %Y") as updatedAt, DATE_FORMAT(t.createdAt, "%d %M %Y") as createdAt
        FROM transactions t
        JOIN transaction_details td ON td.transactions_id = t.id
        LEFT JOIN users us on t.users_id = us.id
        where (td.id like :search or td.transactions_id like :search or td.product_name like :search or td.qty like :search or td.discount_type like :search or td.voucher_type like :search or us.name like :search) and t.id=:idtrx
        Group by td.id
    order by ${sort}
    LIMIT :limit OFFSET :offset
    `,
        {
          replacements: {
            search: "%" + search + "%",
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

  // get order list user
  getOrderListUserByQuery: async (req, res) => {
    try {
      const { id } = req.dataToken;

      console.log("dataToken");
      console.log(req.dataToken);

      const status = req.query.status || null;
      const sortBy = req.query.sort;
      const ascOrDesc = req.query.asc;
      const branchName = req.query.branch;

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
          where t.users_id = :id and (t.branch_store like :search or t.status like :search or t.invoice_no like :search or t.id like :search) and t.status is not :status and t.branch_store = :branchName
    `,
          {
            replacements: {
              search: "%" + search + "%",
              status,
              branchName,
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
            where t.users_id= :id and (t.branch_store like :search or t.status like :search or t.invoice_no like :search or t.id like :search) and t.status is not :status and t.branch_store = :branchName
            Group by t.id
    order by ${sort}
    LIMIT :limit OFFSET :offset
    `,
          {
            replacements: {
              search: "%" + search + "%",
              id,
              status,
              branchName,
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
            where t.users_id = :id and (t.status like :search or t.invoice_no like :search or t.id like :search) and t.status  in (:statusOrder) and t.branch_store = :branchName
    `,
          {
            replacements: {
              search: "%" + search + "%",
              branchName,
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
            where t.users_id= :id and (t.status like :search or us.name like :search or t.invoice_no like :search or t.id like :search) and t.status in (:statusOrder) and t.branch_store = :branchName
            Group by t.id
    order by ${sort}
    LIMIT :limit OFFSET :offset
    `,
          {
            replacements: {
              search: "%" + search + "%",
              id,
              statusOrder,
              branchName,
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
      const { id } = req.dataToken;

      const idtrx = req.params.idtrx;
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
            idtrx,
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );
      let totalPage = Math.ceil(totalRows[0].count_row / limit);
      // console.log(totalPage);
      let result = await sequelize.query(
        `
        SELECT td.id,td.transactions_id,t.invoice_no,t.status,td.product_name,td.qty,td.discount_type,td.voucher_type,td.price_per_item,td.weight,us.name,td.cut_percentage, td.cut_nominal, DATE_FORMAT(td.updatedAt, "%d %M %Y") as updatedAt, DATE_FORMAT(t.createdAt, "%d %M %Y") as createdAt
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
  OrderUserReview: async (req, res) => {
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
      const id_transaction = req.params.id;
      const { status } = req.body;
      const allowedStatus = ["confirmed", "rejected", "canceled", "delivered"];
      const cancelNotAllowed = ["On Delivering", "Order Confirmed"];

      // Validasi Admin
      if (isActive === false)
        throw {
          isError: true,
          messasge: "Admin is not active, please contact to super admin",
        };

      if (role !== "admin branch")
        throw {
          isError: true,
          message: "Role is not permitted",
        };

      const branchStore = await branch_stores.findOne({
        where: { id: branch_stores_id },
      });
      const branchName = branchStore.dataValues.name;

      const getTransaction = await transaction.findOne({
        where: { id: id_transaction },
      });
      console.log(`status transaction: ${getTransaction.status}`);
      if (
        getTransaction.status != "Waiting For Confirmation Payment" &&
        status == "confirmed" &&
        status == "rejected"
      )
        throw {
          isError: true,
          message:
            "Sorry your transaction cannot reviewed or different status state",
        };
      if (
        cancelNotAllowed.includes(getTransaction.status) &&
        status == "canceled"
      )
        throw {
          isError: true,
          message: "Sorry your transaction cannot be cancel",
        };

      if (getTransaction.status != "Ongoing" && status == "delivered")
        throw {
          isError: true,
          message: "Sorry your transaction cannot be delivering",
        };

      if (allowedStatus.includes(status.toLowerCase())) {
        if (status == "rejected") {
          await transaction.update(
            {
              status: "Waiting For Payment",
              admin_name: admins_name,
            },
            {
              where: {
                id: {
                  [Op.eq]: id_transaction,
                },
              },
            },
            { transaction: t }
          );
          await t.commit();
          res.status(200).send({
            isError: false,
            message: "Order was rejected",
            data: await transaction.findOne({
              where: { id: { [Op.eq]: id_transaction } },
            }),
          });
        } else if (status == "confirmed") {
          await transaction.update(
            {
              status: "Ongoing",
              admin_name: admins_name,
            },
            {
              where: {
                id: {
                  [Op.eq]: id_transaction,
                },
              },
            },
            { transaction: t }
          );
          await t.commit();
          res.status(200).send({
            isError: false,
            message: "Order was confirmed",
            data: await transaction.findOne({
              where: { id: { [Op.eq]: id_transaction } },
            }),
          });
        } else if (status == "canceled") {
          await transaction.update(
            {
              status: "Canceled",
              admin_name: admins_name,
            },
            {
              where: {
                id: {
                  [Op.eq]: id_transaction,
                },
              },
            },
            { transaction: t }
          );

          const getDetail = await transaction_detail.findAll({
            where: { transactions_id: id_transaction },
          });

          for (let index = 0; index < getDetail.length; index++) {
            await item_products.update(
              {
                stock: sequelize.literal(`stock + ${getDetail[index].qty}`),
              },
              {
                where: {
                  name: {
                    [Op.eq]: getDetail[index].product_name,
                  },
                },
                transaction: t,
              }
            );
          }

          const historyStok = getDetail.map((x) => {
            return {
              admin_name: admins_name,
              branch_store: branchName,
              product_name: x.product_name,
              qty: `${x.qty}`,
              description: `Cancelled order by Admin Branch`,
            };
          });

          await stock_history_logs.bulkCreate(historyStok, {
            transaction: t,
          });

          await t.commit();
          res.status(200).send({
            isError: false,
            message: "Order was cancelled",
            data: await transaction.findOne({
              where: { id: { [Op.eq]: id_transaction } },
            }),
          });
        } else if (status == "delivered") {
          await transaction.update(
            {
              status: "On Delivering",
              admin_name: admins_name,
            },
            {
              where: {
                id: {
                  [Op.eq]: id_transaction,
                },
              },
            },
            { transaction: t }
          );

          const afterSevenDays = new Date(Date.now() + 60000 * 60 * 24 * 7);
          console.log(afterSevenDays);

          const cron = schedule.scheduleJob(afterSevenDays, function () {
            console.log(afterSevenDays);

            (async () => {
              console.log("1");
              await jobAutoConfirm(id_transaction);
              console.log("2");
            })();

            clearTimeout(cron);
          });

          await t.commit();
          res.status(200).send({
            isError: false,
            message: "Order was delivering",
            data: await transaction.findOne({
              where: { id: { [Op.eq]: id_transaction } },
            }),
          });
        }
      } else {
        res.status(404).send({
          isError: true,
          message: "Status you send not allowed",
          data: null,
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
  HistoryStockQuery: async (req, res) => {
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

      if (sortBy == "id") {
        sort = "id" + " " + ascOrDesc;
      } else if (sortBy == "admin") {
        sort = "admin_name" + " " + ascOrDesc;
      } else if (sortBy == "product") {
        sort = "product_name" + " " + ascOrDesc;
      } else if (sortBy == "branch") {
        sort = "branch_store" + " " + ascOrDesc;
      } else if (sortBy == "date") {
        sort = "createdAt" + " " + ascOrDesc;
      } else if (sortBy == "qty") {
        sort = "qty" + " " + ascOrDesc;
      }

      console.log(sort);
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 0;
      const search = req.query.search_query || "";
      const offset = limit * page;

      let totalRows = await sequelize.query(
        `
          SELECT count(*) as count_row
          FROM stock_history_logs
          where branch_store = :branchName and (id like :search or branch_store like :search or admin_name like :search or product_name like :search or qty like :search or description like :search)
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
            SELECT id, admin_name, branch_store, product_name, qty, description,DATE_FORMAT(createdAt, "%d %M %Y") as created_at, DATE_FORMAT(updatedAt, "%d %M %Y") as updated_at
            FROM stock_history_logs
            where branch_store = :branchName and (id like :search or branch_store like :search or admin_name like :search or product_name like :search or qty like :search or description like :search)
            Group by id
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
      let dataToSend = { result, page, limit, totalRows, totalPage };
      res.status(200).send({
        isError: false,
        message: "History stock List Success",
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

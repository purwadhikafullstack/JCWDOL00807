// import sequelize
const { sequelize } = require("./../models");
const { Op } = require("sequelize");
const transporter = require("../lib/nodemailer");
const handlebars = require("handlebars");
const fs = require("fs").promises;
const { createToken } = require("./../lib/jwt");

// Import hashing
const { hashPassword, hashMatch } = require("./../lib/hash");

//import env
require("dotenv").config();

// import model
const db = require("./../models/index");
const users = db.users;
const transactions = db.transactions;
const transaction_details = db.transaction_details;
const admin = db.admins;
const branch_stores = db.branch_stores;

module.exports = {
  getDataDashboard: async (req, res) => {
    try {
      const { admins_id, name, email, role, isActive } = req.dataToken;
      console.log(req.dataToken);
      let dataToSend = {};
      console.log(admins_id, name, email, role);
      if (isActive == false) {
        res.status(404).send({
          isError: true,
          message: "Admin is not active, please contact to super admin",
          data: null,
        });
        if (role !== "super admin" || role !== "admin branch") {
          res.status(404).send({
            isError: true,
            message: "Role is not permitted",
          });
        }
      }
      if (role == "super admin") {
        let topProduct = await sequelize.query(
          `
          SELECT (td.product_name) , sum(td.qty) as qty
from transactions t
join transaction_details td on td.transactions_id = t.id
where (t.status="Order Confirmed" or t.status="On Delivering" or t.status="Ongoing")
group by td.product_name
order by sum(td.qty) 
desc 
limit 3
          `,
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );
        let topBranch = await sequelize.query(
          `
          SELECT  admin_name , SUM(t.total_price) as sales 
          from transactions t
          where (t.status="Order Confirmed" or t.status="On Delivering" or t.status="Ongoing")
          group by admin_name
          order by sales
          desc
        `,
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );
        let totalStats = await sequelize.query(
          `
            Select count(distinct t.users_id) as total_users , sum(t.total_price) as total_sales , count(DISTINCT t.id) as total_order , SUM(td.qty) as total_product_sold
    FROM transactions t
    JOIN transaction_details td ON td.transactions_id = t.id
    where (t.status="Order Confirmed" or t.status="On Delivering" or t.status="Ongoing")
            `,
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );
        // console.log(totalStats)
        let dataChart = await sequelize.query(
          `
            SELECT DATE_FORMAT(t.createdAt, "%d %M %Y") as stat_day, SUM(td.qty) as total_product , SUM(t.total_price) as sales , COUNT(DISTINCT t.id) as total_order
            FROM transactions t
            JOIN transaction_details td ON td.transactions_id = t.id
            where (t.status="Order Confirmed" or t.status="On Delivering" or t.status="Ongoing")
            Group by DATE_FORMAT(t.createdAt, "%d %M %Y")
            order by stat_day  
            `,
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );
        // console.log(totalStats);
        // console.log(dataChart);
        // console.log(topProduct);
        // console.log(topBranch);
        dataToSend.totalStats = totalStats;
        dataToSend.dataChart = dataChart;
        dataToSend.topProduct = topProduct;
        dataToSend.topBranch = topBranch;
        dataToSend.branchName = "Super Admin";
        dataToSend.role = role;
        res.status(200).send({
          isError: false,
          message: "Query Data is success",
          data: dataToSend,
        });
      } else {
        let branchName = await sequelize.query(
          `
          SELECT name 
          FROM  branch_stores 
where admins_id=?
          `,
          {
            replacements: [admins_id],
            type: sequelize.QueryTypes.SELECT,
          }
        );
        let topProduct = await sequelize.query(
          `SELECT (td.product_name) , sum(td.qty) as qty
        from transactions t
        join transaction_details td on td.transactions_id = t.id
        where t.admin_name =? and (t.status="Order Confirmed" or t.status="On Delivering" or t.status="Ongoing")
        group by td.product_name
        order by sum(td.qty)
        desc
       `,
          {
            replacements: [name],
            limit: 3,
            type: sequelize.QueryTypes.SELECT,
          }
        );
        let totalStats = await sequelize.query(
          `
          Select count(distinct t.users_id) as total_users , sum(t.total_price) as total_sales , count(DISTINCT t.id) as total_order , SUM(td.qty) as total_product_sold
          FROM transactions t
          JOIN transaction_details td ON td.transactions_id = t.id
          where t.admin_name =? and (t.status="Order Confirmed" or t.status="On Delivering" or t.status="Ongoing");
        `,
          {
            replacements: [name],
            type: sequelize.QueryTypes.SELECT,
          }
        );
        let dataChart = await sequelize.query(
          `
          SELECT * FROM(
            SELECT DATE_FORMAT(t.createdAt, "%d %M %Y") as stat_day, SUM(td.qty) as total_product , SUM(t.total_price) as sales , COUNT(DISTINCT t.id) as total_order
            FROM transactions t
            JOIN transaction_details td ON td.transactions_id = t.id
            where t.admin_name = ? and (t.status="Order Confirmed" or t.status="On Delivering" or t.status="Ongoing")
            Group by DATE_FORMAT(t.createdAt, "%d %M %Y")
            order by stat_day
            DESC
            ) as sub
            order by stat_day asc;
          `,
          {
            replacements: [name],
            limit: 7,
            type: sequelize.QueryTypes.SELECT,
          }
        );
        let dataBranchTransaction = await sequelize.query(
          `
          SELECT t.id, t.admin_name,t.branch_store,t.total_price,t.status, us.name, t.users_id,group_concat(td.product_name) as purchase, DATE_FORMAT(t.createdAt, "%d %M %Y") as Date
          FROM transactions t
          JOIN transaction_details td ON td.transactions_id = t.id
          LEFT JOIN users us on t.users_id = us.id
          where t.admin_name = ?
          Group by t.id;
          `,
          {
            replacements: [name],
            limit: 10,
            type: sequelize.QueryTypes.SELECT,
          }
        );
        dataToSend.topProduct = topProduct;
        dataToSend.totalStats = totalStats;
        dataToSend.dataChart = dataChart;
        dataToSend.dataBranchTransaction = dataBranchTransaction;
        dataToSend.branchName = branchName;
        console.log(branchName);
        dataToSend.role = role;
        dataToSend.isActive = isActive;
        // console.log(totalStats, dataChart, dataBranchTransaction, topProduct);

        res.status(200).send({
          isError: false,
          message: "Query Data is success",
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

  Login: async (req, res) => {
    try {
      const { email, password } = req.query;
      const regxEmail = /\S+@\S+\.\S+/;

      if (!email || !password)
        throw {
          message: "Incomplete data. Please fill in missing information.",
        };
      if (!regxEmail.test(email))
        throw {
          message: "The email address you entered is not valid.",
        };

      const findAdmin = await admin.findOne({
        where: { email },
      });
      console.log(findAdmin.dataValues.branch_stores_id);

      if (findAdmin === null)
        throw {
          message: "Couldn't find the email you entered ",
        };
      const matchPassword = await hashMatch(
        password,
        findAdmin.dataValues.password
      );
      console.log(matchPassword);

      if (matchPassword === false)
        throw { message: "Password you entered is incorrect" };
      if (findAdmin.dataValues.isActive === false)
        throw {
          message:
            "Your account has not active. Please contact super Admin for further information",
        };

      // console.log(findAdmin.dataValues.role)

      if (
        findAdmin.dataValues.role !== "admin branch" &&
        findAdmin.dataValues.role !== "super admin"
      )
        throw {
          message:
            "Your role is not permited. Please contact super Admin for further information",
        };
      console.log(findAdmin.dataValues.role);

      let admins_id = findAdmin.dataValues.id;
      let name = findAdmin.dataValues.name;
      let role = findAdmin.dataValues.role;
      let isActive = findAdmin.dataValues.isActive;
      let branch_stores_id = findAdmin.dataValues.branch_stores_id;

      // //         const password = await bcrypt.hash("admin123", 10);
      // // console.log(password)

      let token = createToken({
        admins_id,
        name,
        email,
        role,
        isActive,
        branch_stores_id,
      });
      res.status(200).send({
        isSuccess: true,
        message: "Login success",
        token: token,
        role: role,
      });
    } catch (error) {
      res.status(404).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },

  keepLoginAdmin: async (req, res) => {
    try {
      let admins_id = req.dataToken.admins_id;
      const findAdmin = await admin.findOne({
        attributes: ["name", "email", "role", "isActive", "branch_stores_id"],
        where: {
          id: admins_id,
        },
      });

      res.status(200).send({
        isSuccess: true,
        message: "getData Admin Login Success",
        data: findAdmin.dataValues,
        role: findAdmin.role,
      });
      // console.log(findAdmin.dataValues)
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
};

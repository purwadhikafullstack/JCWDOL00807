// import sequelize
const { sequelize } = require("./../models");
const { Op } = require("sequelize");
const transporter = require("../lib/nodemailer");
const handlebars = require("handlebars");
const fs = require("fs").promises;

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
        console.log(totalStats);
        console.log(dataChart);
        console.log(topProduct);
        console.log(topBranch);
        dataToSend.totalStats = totalStats;
        dataToSend.dataChart = dataChart;
        dataToSend.topProduct = topProduct;
        dataToSend.topBranch = topBranch;
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
where admins_id=1
          `,
          {
            // replacements: [admins_id],
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
        dataToSend.role = role;
        dataToSend.isActive = isActive;
        console.log(totalStats, dataChart, dataBranchTransaction, topProduct);

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
};

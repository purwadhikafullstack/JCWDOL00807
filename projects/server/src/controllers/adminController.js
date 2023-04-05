// import sequelize
const { sequelize } = require("./../models");

const fs = require("fs").promises;
const { createToken } = require("./../lib/jwt");

// Import hashing
const { hashPassword, hashMatch } = require("./../lib/hash");

//import env
require("dotenv").config();

// import model
const db = require("./../models/index");
const { exit, off } = require("process");
const admins = require("../models/admins");
const users = db.users;
const transactions = db.transactions;
const transaction_details = db.transaction_details;
const admin = db.admins;
const branch_stores = db.branch_stores;

const getOffset = (page = 1, limit = 10) => {
  return (page - 1) * limit;
}

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
        return;
      }
      if (role !== "super admin" && role !== "admin branch") {
        res.status(404).send({
          isError: true,
          message: "Role is not permitted",
        });
        return;
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
            order by stat_day desc
            limit 7 
            `,
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );
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
          SELECT bs.name 
FROM admins a
LEFT JOIN branch_stores bs ON a.branch_stores_id = bs.id
where a.id=?
group by a.id;

          `,
          {
            replacements: [admins_id],
            type: sequelize.QueryTypes.SELECT,
          }
        );

        let branch = branchName[0].name;
        let topProduct = await sequelize.query(
          `SELECT (td.product_name) , sum(td.qty) as qty
        from transactions t
        join transaction_details td on td.transactions_id = t.id
        where t.branch_store = ? and (t.status="Order Confirmed" or t.status="On Delivering" or t.status="Ongoing")
        group by td.product_name
        order by sum(td.qty)
        desc
        limit 3
       `,
          {
            replacements: [branch],
            type: sequelize.QueryTypes.SELECT,
          }
        );
        let totalStats = await sequelize.query(
          `
          Select count(distinct t.users_id) as total_users , sum(t.total_price) as total_sales , count(DISTINCT t.id) as total_order , SUM(td.qty) as total_product_sold
          FROM transactions t
          JOIN transaction_details td ON td.transactions_id = t.id
          where t.branch_store= ? and (t.status="Order Confirmed" or t.status="On Delivering" or t.status="Ongoing");
        `,
          {
            replacements: [branch],
            type: sequelize.QueryTypes.SELECT,
          }
        );
        let dataChart = await sequelize.query(
          `
          SELECT * FROM(
            SELECT DATE_FORMAT(t.createdAt, "%d %M %Y") as stat_day, SUM(td.qty) as total_product , SUM(t.total_price) as sales , COUNT(DISTINCT t.id) as total_order
            FROM transactions t
            JOIN transaction_details td ON td.transactions_id = t.id
            where t.branch_store=? and (t.status="Order Confirmed" or t.status="On Delivering" or t.status="Ongoing")
            Group by DATE_FORMAT(t.createdAt, "%d %M %Y")
            order by stat_day
            DESC
            ) as sub
            order by stat_day desc
            limit 7;
          `,
          {
            replacements: [branch],
            type: sequelize.QueryTypes.SELECT,
          }
        );
        let dataBranchTransaction = await sequelize.query(
          `
          SELECT t.id,t.invoice_no, t.admin_name,t.branch_store,t.total_price,t.status, us.name, t.users_id,group_concat(td.product_name) as purchase, DATE_FORMAT(t.createdAt, "%d %M %Y") as Date
          FROM transactions t
          JOIN transaction_details td ON td.transactions_id = t.id
          LEFT JOIN users us on t.users_id = us.id
          where t.branch_store = ?
          Group by t.id
          order by t.id desc
          limit 10;
          `,
          {
            replacements: [branch],
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
      console.log(findAdmin);
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
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  getUserVerified: async (req, res) => {
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

      let dataUser = await users.findAll({
        where: {
          status: "verified",
        },
        attributes: ["id", "name", "email"],
      });
      if (!dataUser) {
        throw {
          isError: true,
          message: "There is no verified user ",
          data: null,
        };
      }

      res.status(200).send({
        isError: false,
        message: "Get UserVerified is success",
        data: dataUser,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },

  managementAdmin: async (req, res) => {
    try {
      let { role, _page, _limit, _search } = req.query;
      const page = parseInt(_page)
      const limit = parseInt(_limit);
      const offset = getOffset(page, limit);

      const findAdmin = await admin.findAll({
        where: {
          role: {
            [Op.eq]: role
          },
          name: {
            [Op.like]: `%${_search}%`
          },
          email: {
            [Op.like]: `%${_search}%`
          }
        },
        include: [{
          model: branch_stores,
          attributes: ['name']
        }],
        offset,
        limit,
        order: [
          ['createdAt', 'DESC']
        ]
      });

      const adminBranch = await admin.findAll({
        where: {
          role: {
            [Op.eq]: role,
          },
          name: {
            [Op.like]: `%${_search}%`
          },
          email: {
            [Op.like]: `%${_search}%`
          }
        }
      })

      res.status(200).send({
        isSuccess: true,
        message: "getData Admin Success",
        data: {
          totalRecord: adminBranch.length,
          totalReturn: findAdmin.length,
          searchText: _search,
          contents: findAdmin
        }
      });
      // console.log(findAdmin.dataValues)
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },

  getAdminByEmail: async (email) => {
    try {
      const findAdmin = await admin.findOne({
        attributes: [
          "name",
        ],
        where: {
          email,
        },
      });
      
      return true
    } catch (error) {
      return false
    }
  },

  createAdminBranch: async (req, res) => {
    let t;
    // const t = await sequelize.transaction();
    try {
      t = await sequelize.transaction();
      let { name, role, password, isActive, email, branch_stores_id } = req.body;

      console.log(req.body);
      const hashedPassword = await hashPassword(password);

      let checkEmail = await admin.findOne({
        where: { email },
        transactions : t
      });

      if (checkEmail) {
        await t.rollback();
        return res.status(401).send({
          isError: true,
          message: "Your email is already registered, please try another email",
          data: null,
        });
      }

      await admin.create(
        {
          name,
          role,
          password: hashedPassword,
          isActive,
          email,
          branch_stores_id
        },
        { transaction: t }
      );
      await t.commit();
      res.status(200).send({
        isError: false,
        message: "Create admin success",
        data: await admin.findOne({
          where: {
            email: {
              [Op.eq]: email
            },
          },
          include: [{
            model: branch_stores,
            attributes: ['name']
          }]
        }),
      });
    } catch (error) {
      await t.rollback();
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },

  getBranchStore: async (req, res) => {
    try {
      let branch_store = await branch_stores.findAll()
      console.log(branch_store)
      res.status(200).send({
        isError: false,
        message: "Create branch_stores_id success",
        data: branch_store,
      });
    } catch (error) {
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },

  updateAdminBranch: async (req, res) => {
    let t;
    try {
      t = await sequelize.transaction();
      let { name, role, password, isActive, email, branch_stores_id } = req.body;
      let { id } = req.query;
      console.log(id)

      console.log(req.body);

      const hashedPassword = await hashPassword(password);

      let checkEmail = await admin.findOne({
        where: { email, id: { [Op.ne]: id } },
        transactions: t
      });

      if (checkEmail) {
        await t.rollback();
        return res.status(401).send({
          isError: true,
          message: "Your email is already registered, please try another email",
          data: null,
        });
      }

      await admin.update(
        {
          name,
          role,
          password: hashedPassword,
          isActive,
          email,
          branch_stores_id
        },
        { where: { id },
        transaction: t
       },
      );
      await t.commit();
      res.status(200).send({
        isError: false,
        message: "Update admin success",
        data: await admin.findOne({
          where: {
            email: {
              [Op.eq]: email
            },
          },
          include: [{
            model: branch_stores,
            attributes: ['name']
          }]
        }),
      });
    } catch (error) {
      await t.rollback();
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },

  deleteAdminBranch: async (req, res) => {
    let t;
    // const t = await sequelize.transaction();
    try {
      t = await sequelize.transaction();
      let { id } = req.query;

      console.log(id);

      let getAdmin = await admin.findOne({where: {id}});

      await admin.destroy(
        {
          where: {
            id,
          },
        },
        { transaction: t }
      );
      await t.commit();
      res.status(200).send({
        isError: false,
        message: "Delete admin success",
        data: getAdmin,
      });
    } catch (error) {
      if (t) await t.rollback();
      res.status(500).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },



};

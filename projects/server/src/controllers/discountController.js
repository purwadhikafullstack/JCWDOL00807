const { sequelize } = require("../models");
const { Op } = require("sequelize");
const fs = require("fs").promises;
// import model
const db = require("../models/index");
const products_categories = db.product_categories;
const admins = db.admins;
const branch_stores = db.branch_stores;
const discounts = db.discounts;
const vouchers = db.vouchers;
const users = db.users;
const generateUrlAdmin = require("../helper/generateUrlAdmin");
//import env
require("dotenv").config();
const deleteFiles = require("../helper/deleteFile");
// // import JWT
const { createToken } = require("./../lib/jwt");

const moment = require("moment-timezone");

module.exports = {
  createReferralVoucher: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { users_id, name, email, otp } = req.dataToken;
      let voucherImage = req.files.images;
      console.log(voucherImage);
      console.log(users_id, name, email, otp);
      const checkUser = await users.findOne({
        where: { id: users_id },
      });
      if (!checkUser) {
        return res.status(404).send({
          isError: true,
          message: "User is not registered, please do the register",
          data: null,
        });
      }
      let imagePath = voucherImage[0].path;
      const expired_at = moment()
        .add(1, "weeks")
        .tz("Asia/Jakarta")
        .format("YYYY-MM-DD HH:mm:ss");
      let checkDuplicate = await vouchers.findOne({
        where: { voucher_type: "Referral Code", users_id },
      });
      if (checkDuplicate) {
        return res.status(404).send({
          isError: true,
          message: "Referral code already claimed",
          data: null,
        });
      }
      let createVoucher = await vouchers.create(
        {
          voucher_type: "Referral Code ",
          image: imagePath,
          cut_nominal: 25000,
          description: "Free 25K OFF of one transaction, Expired 7 days",
          status: true,
          users_id: users_id,
          expired_at,
        },
        { transaction: t }
      );
      let voucherId = createVoucher.id;
      console.log(voucherId);
      await sequelize.query(
        `CREATE EVENT change_status_vouchers_${voucherId} 
        ON SCHEDULE AT DATE_ADD(NOW(), INTERVAL 1 WEEK)
        DO
            UPDATE vouchers SET status = '0'
            WHERE id = ?;`,
        { replacements: [voucherId] }
      );
      await t.commit();
      res.status(200).send({
        isError: false,
        message: "Create Voucher Referral Code Success",
        data: `voucher id : ${voucherId}`,
      });
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
  getDiscountByQuery: async (req, res) => {
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
          message: "Admin is not active, please contact to super admin",
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
      // Ambil branchstore id berdasarkan admins_id

      const sortBy = req.query.sort;
      console.log(sortBy);
      const ascOrDesc = req.query.asc;
      console.log(ascOrDesc);

      let sort = "";
      if (sortBy == "id") {
        sort = "d.id" + " " + ascOrDesc;
      } else if (sortBy == "type") {
        sort = "d.discount_type" + " " + ascOrDesc;
      } else if (sortBy == "end") {
        sort = "d.end" + " " + ascOrDesc;
      } else if (sortBy == "start") {
        sort = "d.start" + " " + ascOrDesc;
      } else {
        sort = "d.status" + " " + ascOrDesc;
      }
      console.log(sort);
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 0;
      const search = req.query.search_query || "";
      const offset = limit * page;

      let totalRows = await sequelize.query(
        `
      SELECT count(*) as count_row
FROM online_groceries.discounts d
where  d.discount_type like :search  or d.status like :search 
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
      SELECT d.id,d.discount_type,d.description,d.cut_nominal,d.cut_percentage,DATE_FORMAT(d.start,"%d %M %Y") as start, DATE_FORMAT(d.end, "%d %M %Y") as end,d.status, DATE_FORMAT(d.createdAt, "%d %M %Y") as createdAt, DATE_FORMAT(d.updatedAt, "%d %M %Y") as updatedAt  
FROM online_groceries.discounts d
where d.discount_type like :search  or d.status like :search 
group by d.id
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
      console.log(result);
      let dataToSend = { result, page, limit, totalRows, totalPage };
      res.status(200).send({
        isError: false,
        message: "Query Discount List Success",
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
  getVoucherByQuery: async (req, res) => {
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
      const sortBy = req.query.sort;
      console.log(sortBy);
      const ascOrDesc = req.query.asc;
      console.log(ascOrDesc);

      let sort = "";
      if (sortBy == "id") {
        sort = "v.id" + " " + ascOrDesc;
      } else if (sortBy == "type") {
        sort = "v.voucher_type" + " " + ascOrDesc;
      } else if (sortBy == "expired") {
        sort = "v.expired_at" + " " + ascOrDesc;
      } else if (sortBy == "username") {
        sort = "us.name" + " " + ascOrDesc;
      } else {
        sort = "v.status" + " " + ascOrDesc;
      }
      console.log(sort);
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 0;
      const search = req.query.search_query || "";
      const offset = limit * page;

      let totalRows = await sequelize.query(
        `
      SELECT count(*) as count_row
FROM online_groceries.vouchers v
LEFT JOIN users us on v.users_id = us.id
where  v.voucher_type like :search  or v.status like :search or us.name like :search
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
      SELECT v.id,us.name as username,v.voucher_type,v.image,v.description,v.cut_nominal,v.cut_percentage,DATE_FORMAT(v.expired_at,"%d %M %Y") as ExpiredDate, v.status, DATE_FORMAT(v.createdAt, "%d %M %Y") as createdAt, DATE_FORMAT(v.updatedAt, "%d %M %Y") as updatedAt  
FROM online_groceries.vouchers v
LEFT JOIN users us ON v.users_id = us.id
where v.voucher_type like :search  or v.status like :search or us.name like :search
group by v.id
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
      let dataToSend = { result, page, limit, totalRows, totalPage };
      res.status(200).send({
        isError: false,
        message: "Query Voucher List Success",
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
  createDiscount: async (req, res) => {
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
      console.log(admins_id, admins_name, email, role, isActive);

      let {
        discount_type,
        description,
        start,
        end,
        cut_nominal,
        cut_percentage,
      } = req.body;
      // Validasi Admin
      if (cut_nominal) {
        cut_nominal = parseInt(cut_nominal);
        if (cut_percentage) {
          cut_percentage = parseFloat(cut_percentage);
        }
      }
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

      if (!discount_type || !description || !start || !end) {
        res.status(404).send({
          isError: true,
          message: "Data is incomplete, please fulfill the field",
          data: null,
        });
        return;
      }

      let now = new Date();

      if (start < now) {
        res.status(404).send({
          isError: true,
          message: "Data Input Start invalid, please input start date",
          data: null,
        });
        return;
      }

      if (end === start) {
        res.status(404).send({
          isError: true,
          message:
            "Start date and End date are same input , please try different date",
          data: null,
        });
        return;
      }
      if (cut_nominal) {
        if (cut_nominal <= 0) {
          res.status(404).send({
            isError: true,
            message:
              "Input cut_nominal is invalid, please input positive integer",
            data: null,
          });
          return;
        }
      }
      if (cut_percentage) {
        if (cut_percentage < 0 || cut_percentage > 1) {
          return res.status(404).send({
            isError: true,
            message: "Percentage cannot lesser than 0 and greater than 1",
            data: null,
          });
        }
      }
      if (cut_nominal && cut_percentage) {
        return res.status(404).send({
          isError: true,
          message: "Please one of two field (nominal or percentage)",
          data: null,
        });
      }
      let createDiscount;
      if (cut_nominal) {
        createDiscount = await discounts.create(
          {
            discount_type,
            description,
            start,
            end,
            cut_nominal,
          },
          { transaction: t }
        );
        let discountId = createDiscount.id;
        console.log(discountId);

        await sequelize.query(
          `CREATE EVENT change_status_start_discounts_${discountId} 
        ON SCHEDULE AT '${start}'
        DO
            UPDATE discounts SET status = '1'
            WHERE id = ?`,
          { replacements: [discountId] }
        );
        await sequelize.query(
          `CREATE EVENT change_status_end_discounts_${discountId} 
        ON SCHEDULE AT '${end}'
        DO
            UPDATE discounts SET status = '0'
            WHERE id = ?;`,
          { replacements: [discountId] }
        );

        await t.commit();
        res.status(200).send({
          isError: false,
          message: "Create Discount is success",
          data: createDiscount,
        });
      } else if (cut_percentage) {
        createDiscount = await discounts.create(
          {
            discount_type,
            description,
            start,
            end,
            cut_percentage,
          },
          { transaction: t }
        );
        let discountId = createDiscount.id;
        console.log(discountId);

        await sequelize.query(
          `CREATE EVENT change_status_start_discounts_${discountId} 
            ON SCHEDULE AT '${start}'
            DO
                UPDATE discounts SET status = '1'
                WHERE id = ?`,
          { replacements: [discountId] }
        );
        await sequelize.query(
          `CREATE EVENT change_status_end_discounts_${discountId} 
            ON SCHEDULE AT '${end}'
            DO
                UPDATE discounts SET status = '0'
                WHERE id = ?;`,
          { replacements: [discountId] }
        );

        await t.commit();
        res.status(200).send({
          isError: false,
          message: "Create Discount is success",
          data: createDiscount,
        });
      } else {
        createDiscount = await discounts.create(
          {
            discount_type,
            description,
            start,
            end,
          },
          { transaction: t }
        );
        let discountId = createDiscount.id;
        console.log(discountId);

        await sequelize.query(
          `CREATE EVENT change_status_start_discounts_${discountId} 
            ON SCHEDULE AT '${start}'
            DO
                UPDATE discounts SET status = '1'
                WHERE id = ?`,
          { replacements: [discountId] }
        );
        await sequelize.query(
          `CREATE EVENT change_status_end_discounts_${discountId} 
            ON SCHEDULE AT '${end}'
            DO
                UPDATE discounts SET status = '0'
                WHERE id = ?;`,
          { replacements: [discountId] }
        );

        await t.commit();
        res.status(200).send({
          isError: false,
          message: "Create Discount is success",
          data: createDiscount,
        });
      }
    } catch (error) {
      await t.rollback();
      console.log(error);
      res.status(500).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  createVoucher: async (req, res) => {
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
      let voucherImage = req.files.images;
      console.log(req.files.images);

      console.log(admins_id, admins_name, email, role, isActive);

      let { voucher_type, description, cut_percentage, cut_nominal, username } =
        req.body;
      if (cut_percentage) {
        cut_percentage = parseFloat(cut_percentage);
      }
      if (cut_nominal) {
        cut_nominal = parseInt(cut_nominal);
      }
      // Validasi Admin
      if (isActive === false) {
        res.status(404).send({
          isError: true,
          message: "Admin is not active, please contact to super admin",
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

      let checkUsername = await users.findOne({
        where: { name: username },
      });
      console.log(checkUsername);
      let users_id = checkUsername.dataValues.id;
      if (!checkUsername) {
        res.status(404).send({
          isError: true,
          message: "Username invalid, please try with valid username",
        });
        return;
      }
      // Validasi Input
      let checkVoucherType = await vouchers.findOne({
        where: { voucher_type, users_id },
      });
      if (checkVoucherType) {
        res.status(404).send({
          isError: true,
          message: "Voucher Type is already exist, please try another name",
          data: null,
        });
        return;
      }

      if (!voucher_type || !description || !username) {
        res.status(404).send({
          isError: true,
          message: "Data is incomplete, please fulfill the field",
          data: null,
        });
        return;
      }

      if (cut_percentage) {
        if (cut_percentage < 0 || cut_percentage >= 1) {
          res.status(404).send({
            isError: true,
            message:
              "Input cut_percentage cannot lesser than 0 and greater than 0",
            data: null,
          });
          return;
        }
      }
      if (cut_nominal) {
        if (cut_nominal < 0) {
          res.status(404).send({
            isError: true,
            message: "Input cut_nominal cannot lesser than 0",
          });
          return;
        }
      }
      const expired_at = moment()
        .add(1, "weeks")
        .tz("Asia/Jakarta")
        .format("YYYY-MM-DD HH:mm:ss");
      let createVoucher;
      let voucherId;
      if (voucherImage && cut_percentage) {
        let imagePath = voucherImage[0].path;
        createVoucher = await vouchers.create(
          {
            voucher_type,
            image: imagePath,
            cut_percentage,
            description,
            expired_at,
            status: true,
            users_id,
          },
          { transaction: t }
        );

        voucherId = createVoucher.id;
        console.log(voucherId);
        await sequelize.query(
          `CREATE EVENT change_status_vouchers_${voucherId}
          ON SCHEDULE AT DATE_ADD(NOW(), INTERVAL 1 WEEK)
          DO
              UPDATE vouchers SET status = '0'
              WHERE id = ?;`,
          { replacements: [voucherId] }
        );
        await t.commit();
        res.status(200).send({
          isError: false,
          message: "Create Voucher is success",
          data: createVoucher,
        });
      } else if (voucherImage && cut_nominal) {
        let imagePath = voucherImage[0].path;
        createVoucher = await vouchers.create(
          {
            voucher_type,
            image: imagePath,
            cut_nominal,
            description,
            expired_at,
            status: true,
            users_id,
          },
          { transaction: t }
        );
        voucherId = createVoucher.id;
        console.log(voucherId);
        await sequelize.query(
          `CREATE EVENT change_status_vouchers_${voucherId}
          ON SCHEDULE AT DATE_ADD(NOW(), INTERVAL 1 WEEK)
          DO
              UPDATE vouchers SET status = '0'
              WHERE id = ?;`,
          { replacements: [voucherId] }
        );
        await t.commit();
        res.status(200).send({
          isError: false,
          message: "Create Voucher is success",
          data: createVoucher,
        });
      } else if (!voucherImage && cut_percentage) {
        createVoucher = await vouchers.create(
          {
            voucher_type,
            cut_percentage,
            description,
            expired_at,
            status: true,
            users_id,
          },
          { transaction: t }
        );
        voucherId = createVoucher.id;
        console.log(voucherId);
        await sequelize.query(
          `CREATE EVENT change_status_vouchers_${voucherId}
          ON SCHEDULE AT DATE_ADD(NOW(), INTERVAL 1 WEEK)
          DO
              UPDATE vouchers SET status = '0'
              WHERE id = ?;`,
          { replacements: [voucherId] }
        );
        await t.commit();
        res.status(200).send({
          isError: false,
          message: "Create Voucher is success",
          data: createVoucher,
        });
      } else if (!voucherImage && cut_nominal) {
        createVoucher = await vouchers.create(
          {
            voucher_type,
            cut_nominal,
            description,
            expired_at,
            status: true,
            users_id,
          },
          { transaction: t }
        );
        voucherId = createVoucher.id;
        console.log(voucherId);
        await sequelize.query(
          `CREATE EVENT change_status_vouchers_${voucherId}
          ON SCHEDULE AT DATE_ADD(NOW(), INTERVAL 1 WEEK)
          DO
              UPDATE vouchers SET status = '0'
              WHERE id = ?;`,
          { replacements: [voucherId] }
        );
        await t.commit();
        res.status(200).send({
          isError: false,
          message: "Create Voucher is success",
          data: createVoucher,
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
  updateDiscount: async (req, res) => {
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
      console.log(admins_id, admins_name, email, role, isActive);

      let {
        discount_type,
        description,
        start,
        end,
        cut_nominal,
        cut_percentage,
      } = req.body;
      if (cut_nominal) {
        cut_nominal = parseInt(cut_nominal);
      }
      if (cut_percentage) {
        cut_percentage = parseFloat(cut_percentage);
      }
      let { id } = req.params;
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
      //Check Id Discount
      let dataDiscount = await discounts.findOne({
        where: { id },
      });
      if (!dataDiscount) {
        await t.rollback();
        res.status(404).send({
          isError: true,
          message: "Discount Id invalid, please input valid discount id",
        });
        return;
      }

      if (!discount_type || !description || !start || !end) {
        res.status(404).send({
          isError: true,
          message: "Data is incomplete, please fulfill the field",
          data: null,
        });
        return;
      }

      let now = new Date();

      if (start < now) {
        res.status(404).send({
          isError: true,
          message: "Data Input Start invalid, please input start date",
          data: null,
        });
        return;
      }

      if (end === start) {
        res.status(404).send({
          isError: true,
          message:
            "Start date and End date are same input , please try different date",
          data: null,
        });
        return;
      }
      if (cut_nominal) {
        if (cut_nominal <= 0) {
          res.status(404).send({
            isError: true,
            message:
              "Input cut_nominal is invalid, please input positive integer",
            data: null,
          });
          return;
        }
      }
      if (cut_percentage) {
        if (cut_percentage < 0 || cut_percentage > 1) {
          return res.status(404).send({
            isError: true,
            message: "Percentage cannot lesser than 0 and greater than 1",
            data: null,
          });
        }
      }

      let updateDiscount = await discounts.update(
        {
          discount_type,
          description,
          start,
          end,
          cut_nominal,
          cut_percentage,
        },
        { where: { id } },
        { transaction: t }
      );
      console.log(updateDiscount);
      const eventNames = [
        `change_status_start_discounts_${id}`,
        `change_status_end_discounts_${id}`,
      ];
      await sequelize.query(`
      DROP EVENT IF EXISTS ${eventNames[0]}
      `);
      await sequelize.query(`
      DROP EVENT IF EXISTS ${eventNames[1]}
      `);

      await sequelize.query(
        `CREATE EVENT change_status_start_discounts_${id} 
        ON SCHEDULE AT '${start}'
        DO
            UPDATE discounts SET status = '1'
            WHERE id = ?;`,
        { replacements: [id] }
      );
      await sequelize.query(
        `CREATE EVENT change_status_end_discounts_${id} 
        ON SCHEDULE AT '${end}'
        DO
            UPDATE discounts SET status = '0'
            WHERE id = ?;`,
        { replacements: [id] }
      );

      await t.commit();
      res.status(200).send({
        isError: false,
        message: `Update Discount id : ${id} is success`,
        data: null,
      });
    } catch (error) {
      await t.rollback();
      console.log(error);
      res.status(500).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  updateVoucher: async (req, res) => {
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
      let voucherImage = req.files.images;
      let { id } = req.params;
      console.log(voucherImage);
      console.log(admins_id, admins_name, email, role, isActive);

      let { voucher_type, description, cut_percentage, cut_nominal, username } =
        req.body;
      let { id: voucherId } = req.params;
      if (cut_percentage) {
        cut_percentage = parseFloat(cut_percentage);
      }
      if (cut_nominal) {
        cut_nominal = parseInt(cut_nominal);
      }
      // Validasi Admin
      if (isActive === false) {
        if (req.files.images) deleteFiles(req.files.images);
        res.status(404).send({
          isError: true,
          message: "Admin is not active, please contact to super admin",
          data: null,
        });
        return;
      }
      if (role !== "admin branch") {
        if (req.files.images) deleteFiles(req.files.images);
        res.status(404).send({
          isError: true,
          message: "Role is not permitted",
          data: null,
        });
        return;
      }

      let dataVoucher = await vouchers.findOne({
        where: { id },
      });
      if (!dataVoucher) {
        if (req.files.images) deleteFiles(req.files.images);
        res.status(404).send({
          isError: true,
          message: "Voucher id invalid, please input valid voucher id",
        });
        return;
      }
      let checkUsername = await users.findOne({
        where: { name: username },
      });
      let users_id;
      if (checkUsername) {
        users_id = checkUsername.dataValues.id;
      }
      if (!checkUsername) {
        if (req.files.images) deleteFiles(req.files.images);
        res.status(404).send({
          isError: true,
          message: "Username invalid, please try with valid username",
        });
        return;
      }
      // Validasi Input
      let checkVoucherType = await vouchers.findAll({
        where: { voucher_type, users_id },
      });
      if (checkVoucherType.length >= 2) {
        if (req.files.images) deleteFiles(req.files.images);
        res.status(404).send({
          isError: true,
          message: "Voucher Type is already exist, please try another name",
          data: null,
        });
        return;
      }

      if (!voucher_type || !description || !username) {
        if (req.files.images) deleteFiles(req.files.images);
        res.status(404).send({
          isError: true,
          message: "Data is incomplete, please fulfill the field",
          data: null,
        });
        return;
      }

      if (cut_percentage) {
        if (cut_percentage < 0 || cut_percentage >= 1) {
          if (req.files.images) deleteFiles(req.files.images);
          res.status(404).send({
            isError: true,
            message:
              "Input cut_percentage cannot lesser than 0 and greater than 0",
            data: null,
          });
          return;
        }
      }
      if (cut_nominal) {
        if (cut_nominal < 0) {
          if (req.files.images) deleteFiles(req.files.images);
          res.status(404).send({
            isError: true,
            message: "Input cut_nominal cannot lesser than 0",
          });
          return;
        }
      }
      const expired_at = moment()
        .add(1, "weeks")
        .tz("Asia/Jakarta")
        .format("YYYY-MM-DD HH:mm:ss");
      let updateVoucher;
      if (voucherImage && cut_percentage) {
        if (dataVoucher.dataValues.image) {
          await fs.unlink(dataVoucher.dataValues.image);
        }
        let imagePath = voucherImage[0].path;
        updateVoucher = await vouchers.update(
          {
            voucher_type,
            image: imagePath,
            cut_percentage,
            description,
            expired_at,
            status: true,
            users_id,
          },
          { where: { id } },
          { transaction: t }
        );

        await sequelize.query(`
        DROP EVENT IF EXISTS change_status_vouchers_${id}`);

        await sequelize.query(
          `CREATE EVENT change_status_vouchers_${id} 
        ON SCHEDULE AT DATE_ADD(NOW(), INTERVAL 1 WEEK)
        DO
            UPDATE vouchers SET status = '0'
            WHERE id = ?;`,
          { replacements: [id] }
        );
        await t.commit();
        res.status(200).send({
          isError: false,
          message: `Edit Voucher id : ${id} is success`,
          data: updateVoucher,
        });
      } else if (voucherImage && cut_nominal) {
        if (dataVoucher.dataValues.image) {
          await fs.unlink(dataVoucher.dataValues.image);
        }
        let imagePath = voucherImage[0].path;
        updateVoucher = await vouchers.update(
          {
            voucher_type,
            image: imagePath,
            cut_nominal,
            description,
            expired_at,
            status: true,
            users_id,
          },
          { where: { id } },
          { transaction: t }
        );

        await sequelize.query(`
        DROP EVENT IF EXISTS change_status_vouchers_${voucherId}`);

        await sequelize.query(
          `CREATE EVENT change_status_vouchers_${voucherId} 
        ON SCHEDULE AT DATE_ADD(NOW(), INTERVAL 1 WEEK)
        DO
            UPDATE vouchers SET status = '0'
            WHERE id = ?;`,
          { replacements: [voucherId] }
        );
        await t.commit();
        res.status(200).send({
          isError: false,
          message: `Edit Voucher id : ${voucherId} is success`,
          data: updateVoucher,
        });
      } else if (!voucherImage && cut_percentage) {
        updateVoucher = await vouchers.update(
          {
            voucher_type,
            cut_percentage,
            description,
            expired_at,
            status: true,
            users_id,
          },
          { where: { id } },
          { transaction: t }
        );

        await sequelize.query(`
        DROP EVENT IF EXISTS change_status_vouchers_${id}`);

        await sequelize.query(
          `CREATE EVENT change_status_vouchers_${id} 
        ON SCHEDULE AT DATE_ADD(NOW(), INTERVAL 1 WEEK)
        DO
            UPDATE vouchers SET status = '0'
            WHERE id = ?;`,
          { replacements: [id] }
        );
        await t.commit();
        res.status(200).send({
          isError: false,
          message: `Edit Voucher id : ${id} is success`,
          data: updateVoucher,
        });
      } else if (!voucherImage && cut_nominal) {
        updateVoucher = await vouchers.update(
          {
            voucher_type,
            cut_nominal,
            description,
            expired_at,
            status: true,
            users_id,
          },
          { where: { id } },
          { transaction: t }
        );

        await sequelize.query(`
        DROP EVENT IF EXISTS change_status_vouchers_${id}`);

        await sequelize.query(
          `CREATE EVENT change_status_vouchers_${id} 
        ON SCHEDULE AT DATE_ADD(NOW(), INTERVAL 1 WEEK)
        DO
            UPDATE vouchers SET status = '0'
            WHERE id = ?;`,
          { replacements: [id] }
        );
        await t.commit();
        res.status(200).send({
          isError: false,
          message: `Edit Voucher id : ${id} is success`,
          data: updateVoucher,
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
  deleteDiscount: async (req, res) => {
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

      let dataDiscount = await discounts.findOne({
        where: { id },
      });
      if (!dataDiscount) {
        res.status(404).send({
          isError: true,
          message: "Discount ID invalid, please input valid discount id",
          data: null,
        });
        return;
      }
      let deletedDiscount = await discounts.destroy(
        {
          where: { id },
        },
        { transaction: t }
      );
      await t.commit();
      res.status(200).send({
        isError: false,
        message: `Discount id : ${id} has been success deleted`,
        data: deletedDiscount,
      });
    } catch (error) {
      await t.rollback();
      res.status(500).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  deleteVoucher: async (req, res) => {
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
      let dataVoucher = await vouchers.findOne({
        where: { id },
      });
      if (!dataVoucher) {
        res.status(404).send({
          isError: true,
          message: "Voucher ID invalid, please input valid discount id",
          data: null,
        });
        return;
      }
      if (dataVoucher.dataValues.image) {
        await fs.unlink(dataVoucher.dataValues.image);
      }
      let deletedVoucher = await vouchers.destroy(
        {
          where: { id },
        },
        { transaction: t }
      );
      await t.commit();
      res.status(200).send({
        isError: false,
        message: `Voucher id : ${id} has been success deleted`,
        data: deletedVoucher,
      });
    } catch (error) {
      await t.rollback();
      res.status(500).send({
        isError: true,
        message: error.messadge,
        data: null,
      });
    }
  },
  getDiscountById: async (req, res) => {
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

      let dataDiscount = await discounts.findOne({
        where: {
          id,
        },
      });
      if (!dataDiscount) {
        throw {
          isError: true,
          message: "Id Discount is invalid, please input valid id",
          data: null,
        };
      }

      let getDiscount = await sequelize.query(
        `
        SELECT d.id,d.discount_type,d.description,d.start,d.end,d.cut_nominal,d.cut_percentage  
FROM online_groceries.discounts d
where d.id=?
Group by d.id;
        `,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: [id],
          //   limit: 2,
        }
      );

      res.status(200).send({
        isError: false,
        message: "Query Discount by Id is success",
        data: getDiscount,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  getVoucherById: async (req, res) => {
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

      let dataVoucher = await vouchers.findOne({
        where: {
          id,
        },
      });
      if (!dataVoucher) {
        throw {
          isError: true,
          message: "Id Voucher is invalid, please input valid id",
          data: null,
        };
      }

      let getVoucher = await sequelize.query(
        `
        SELECT v.id,v.voucher_type,v.image,v.description,v.expired_at,v.cut_nominal,v.cut_percentage,us.name as Username  
FROM online_groceries.vouchers v
LEFT JOIN users us ON v.users_id = us.id
where v.id=?
Group by v.id;
        `,
        {
          type: sequelize.QueryTypes.SELECT,
          replacements: [id],
          //   limit: 2,
        }
      );
      console.log(getVoucher[0].image);
      if (typeof getVoucher[0].image === "string") {
        getVoucher[0].image = generateUrlAdmin(getVoucher[0].image);
      }
      res.status(200).send({
        isError: false,
        message: "Query Voucher by Id is success",
        data: getVoucher,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  getUser: async (req, res) => {
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
        message: "Query Voucher by Id is success",
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
};

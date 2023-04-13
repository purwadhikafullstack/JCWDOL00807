const { sequelize } = require("../models");
const { Op } = require("sequelize");

// import model
const db = require("./../models/index");
const users = db.users;
const carts = db.carts;
const branch_stores = db.branch_stores;
const item_products = db.item_products;

module.exports = {
  cart: async (req, res) => {
    try {
      const userid = req.dataToken.id;
      const branch_id = req.params.brid;
      if (!userid)
        throw {
          message:
            "Unauthorization, please register or login for continue see your cart",
        };
      const userExist = await users.findOne({
        where: { id: userid },
      });

      if (userExist === null)
        throw {
          message:
            "Unauthorization, please register or login for continue see your cart",
        };

      // nanti nulis code lanjutannya disini yaa  terus buat response si successnya bisa di ubah ya kalo responnya error nya mah gapapa gitu aja juga
      let sum = await sequelize.query(
        `
        SELECT SUM(c.qty) as total
        FROM carts c
        LEFT JOIN users u ON c.users_id = u.id
        LEFT JOIN branch_stores bs ON c.branch_stores_id = bs.id
        LEFT JOIN item_products ip ON c.item_products_id = ip.id
        WHERE c.users_id=:userid AND c.branch_stores_id=:branch_id
        ORDER BY c.id DESC
      `,
        {
          replacements: {
            userid,
            branch_id
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      let cartList = await sequelize.query(
        `
        SELECT c.*, u.name as user_name, bs.name as branch_stores_name, ip.name as product_name, ip.images as product_image, ip.stock as product_stock, ip.price 
        FROM carts c
        LEFT JOIN users u ON c.users_id = u.id
        LEFT JOIN branch_stores bs ON c.branch_stores_id = bs.id
        LEFT JOIN item_products ip ON c.item_products_id = ip.id
        WHERE c.users_id=:userid AND c.branch_stores_id=:branch_id
        ORDER BY c.id DESC
      `,
        {
          replacements: {
            userid,
            branch_id
          },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      res.status(200).send({
        isSuccess: true,
        message: "Cart List",
        data: {
          carts: cartList,
          count: sum[0]?.total || 0,
        },
      });
    } catch (error) {
      res.status(404).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },

  addToCart: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const userid = req.dataToken.id;
      const { product_id, qty, branch_id } = req.body;
      console.log(`product_id ${product_id}`);
      if (!userid)
        throw {
          message:
            "Unauthorization, please register or login for continue see your cart",
        };
      const userExist = await users.findOne({
        where: { id: userid },

      });

      if (userExist === null)
        throw {
          message:
            "Unauthorization, please register or login for continue see your cart",
        };

      const productItem = await item_products.findOne({
        where: {
          id: {
            [Op.eq]: product_id,
          },
          branch_stores_id: {
            [Op.eq]: branch_id,
          },
        },
      });

      const cartBy = await carts.findOne({
        where: {
          users_id: {
            [Op.eq]: userid,
          },
          item_products_id: {
            [Op.eq]: product_id,
          },
          branch_stores_id: {
            [Op.eq]: branch_id,
          },
        },
      });

      const stock = productItem.stock;
      if (stock == 0)
        throw {
          message: "Product is out of stock",
        };

      if (cartBy) {
        console.log("update cart");
        const prevQty = cartBy.qty;
        const newQty = prevQty + parseInt(qty);

        await carts.update(
          {
            qty: newQty,
          },
          {
            where: {
              users_id: {
                [Op.eq]: userid,
              },
              item_products_id: {
                [Op.eq]: product_id,
              },
              branch_stores_id: {
                [Op.eq]: branch_id,
              },
            },
            transaction: t,
          }
        );
        await t.commit();
        res.status(200).send({
          isSuccess: true,
          message: "Add to cart is success",
          data: await carts.findOne({
            where: {
              users_id: {
                [Op.eq]: userid,
              },
              item_products_id: {
                [Op.eq]: product_id,
              },
              branch_stores_id: {
                [Op.eq]: branch_id,
              },
            },
          }),
        });
      } else {
        console.log("insert cart");

        const dataInsert = {
          qty,
          item_products_id: productItem.id,
          branch_stores_id: branch_id,
          users_id: userid,
        };

        const insert = await carts.create(dataInsert, { transaction: t });
        await t.commit();
        res.status(200).send({
          isSuccess: true,
          message: "Add to cart is success",
          data: insert,
        });
      }
    } catch (error) {
      res.status(404).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },

  cartUpdateQty: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const userid = req.dataToken.id;
      const { product_id, qty, branch_id } = req.body;
      console.log(`product_id ${product_id}`);
      if (!userid)
        throw {
          message:
            "Unauthorization, please register or login for continue see your cart",
        };
      const userExist = await users.findOne({
        where: { id: userid },
      });

      if (userExist === null)
        throw {
          message:
            "Unauthorization, please register or login for continue see your cart",
        };

      await carts.update(
        {
          qty,
        },
        {
          where: {
            users_id: {
              [Op.eq]: userid,
            },
            item_products_id: {
              [Op.eq]: product_id,
            },
            branch_stores_id: {
              [Op.eq]: branch_id,
            },
          },
          transaction: t,
        }
      );

      await t.commit();
      res.status(200).send({
        isSuccess: true,
        message: "Update cart",
        data: await carts.findOne({
          where: {
            users_id: {
              [Op.eq]: userid,
            },
            item_products_id: {
              [Op.eq]: product_id,
            },
            branch_stores_id: {
              [Op.eq]: branch_id,
            },
          },
        }),
      });
    } catch (error) {
      res.status(404).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },

  cartDeleteQty: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const userid = req.dataToken.id;
      const { product_id, branch_id } = req.body;
      console.log(`product_id ${product_id}`);
      if (!userid)
        throw {
          message:
            "Unauthorization, please register or login for continue see your cart",
        };
      const userExist = await users.findOne({
        where: { id: userid },
      });
  
      if (userExist === null)
        throw {
          message:
            "Unauthorization, please register or login for continue see your cart",
        };
  
      const cartBy = await carts.findOne({
        where: {
          users_id: {
            [Op.eq]: userid,
          },
          item_products_id: {
            [Op.eq]: product_id,
          },
          branch_stores_id: {
            [Op.eq]: branch_id,
          },
        },
      });
  
      if (!cartBy)
        throw {
          message: "Product is not found in your cart",
        };
  
  
      await carts.destroy({
        where: {
          users_id: {
            [Op.eq]: userid,
          },
          item_products_id: {
            [Op.eq]: product_id,
          },
          branch_stores_id: {
            [Op.eq]: branch_id,
          },
        },
        transaction: t,
      });
  
      await t.commit();
      res.status(200).send({
        isSuccess: true,
        message: "Delete item from cart is success",
        data: cartBy,
      });
    } catch (error) {
      await t.rollback();
      res.status(404).send({
        isSuccess: false,
        message: error.message,
      });
    }
  },
  


  // cartDeleteQty: async (req, res) => {
  //   const t = await sequelize.transaction();
  //   try {
  //     const userid = req.dataToken.id;
  //     const { product_id, qty } = req.body;
  //     console.log(`product_id ${product_id}`);
  //     if (!userid)
  //       throw {
  //         message:
  //           "Unauthorization, please register or login for continue see your cart",
  //       };
  //     const userExist = await users.findOne({
  //       where: { id: userid },
  //     });

  //     if (userExist === null)
  //       throw {
  //         message:
  //           "Unauthorization, please register or login for continue see your cart",
  //       };

  //     const cartBy = await carts.findOne({
  //       where: {
  //         users_id: {
  //           [Op.eq]: userid,
  //         },
  //         item_products_id: {
  //           [Op.eq]: product_id,
  //         },
  //       },
  //     });

  //     if (!cartBy)
  //       throw {
  //         message: "Product is not found in your cart",
  //       };

  //     await carts.destroy({
  //       where: {
  //         users_id: {
  //           [Op.eq]: userid,
  //         },
  //         item_products_id: {
  //           [Op.eq]: product_id,
  //         },
  //       },
  //       transaction: t,
  //     });

  //     await t.commit();
  //     res.status(200).send({
  //       isSuccess: true,
  //       message: "Delete item from cart is success",
  //       data: cartBy,
  //     });
  //   } catch (error) {
  //     await t.rollback();
  //     res.status(404).send({
  //       isSuccess: false,
  //       message: error.message,
  //     });
  //   }
  // },
};

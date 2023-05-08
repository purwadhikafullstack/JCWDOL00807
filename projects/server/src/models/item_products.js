"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class item_products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.branch_stores, {
        foreignKey: "branch_stores_id",
      }),
        this.belongsTo(models.product_categories, {
          foreignKey: "product_categories_id",
        }),
        this.hasMany(models.carts, {
          foreignKey: "item_products_id",
        }),
        this.belongsTo(models.discounts, {
          foreignKey: "discount_id",
        }),
        this.belongsTo(models.vouchers, {
          foreignKey: "vouchers_id",
        });
    }
  }
  item_products.init(
    {
      name: DataTypes.STRING,
      images: DataTypes.STRING,
      description: DataTypes.STRING,
      weight: DataTypes.FLOAT,
      stock: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "item_products",
    }
  );
  return item_products;
};

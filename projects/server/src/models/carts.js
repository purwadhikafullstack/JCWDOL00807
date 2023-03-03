"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class carts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.users, {
        foreignKey: "users_id",
      }),
        this.belongsTo(models.branch_stores, {
          foreignKey: "branch_stores_id",
        }),
        this.belongsTo(models.item_products, {
          foreignKey: "item_products_id",
        });
    }
  }
  carts.init(
    {
      qty: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "carts",
    }
  );
  return carts;
};

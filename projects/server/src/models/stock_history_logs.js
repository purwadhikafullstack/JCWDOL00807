"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class stock_history_logs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  stock_history_logs.init(
    {
      admin_name: DataTypes.STRING,
      branch_store: DataTypes.STRING,
      product_name: DataTypes.STRING,
      qty: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "stock_history_logs",
    }
  );
  return stock_history_logs;
};

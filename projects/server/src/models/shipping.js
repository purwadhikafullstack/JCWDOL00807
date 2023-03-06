"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class shipping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.transactions, {
        foreignKey: "transactions_id",
      });
    }
  }
  shipping.init(
    {
      courier_name: DataTypes.STRING,
      delivery_option: DataTypes.STRING,
      branch_store_address: DataTypes.STRING,
      user_address: DataTypes.STRING,
      price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "shipping",
    }
  );
  return shipping;
};

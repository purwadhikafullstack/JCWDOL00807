"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaction_details extends Model {
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
  transaction_details.init(
    {
      product_name: DataTypes.STRING,
      qty: DataTypes.INTEGER,
      discount_type: DataTypes.STRING,
      voucher_type: DataTypes.STRING,
      price_per_item: DataTypes.INTEGER,
      weight: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "transaction_details",
    }
  );
  return transaction_details;
};

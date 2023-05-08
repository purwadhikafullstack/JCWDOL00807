"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
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
        this.hasOne(models.shipping, {
          foreignKey: "transactions_id",
        }),
        this.hasMany(models.transaction_details, {
          foreignKey: "transactions_id",
        });
    }
  }
  transactions.init(
    {
      admin_name: DataTypes.STRING,
      invoice_no: DataTypes.STRING,
      branch_store: DataTypes.STRING,
      total_price: DataTypes.INTEGER,
      status: {
        type: DataTypes.STRING,
        defaultValue: "Waiting For Payment",
      },
      cancellation_reasons: DataTypes.STRING,
      payment_proof: DataTypes.STRING,
      expired_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "transactions",
    }
  );
  return transactions;
};

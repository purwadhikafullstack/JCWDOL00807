"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class vouchers extends Model {
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
        this.hasMany(models.item_products, {
          foreignKey: "vouchers_id",
        });
    }
  }
  vouchers.init(
    {
      voucher_type: DataTypes.STRING,
      image: DataTypes.STRING,
      cut_percentage: DataTypes.FLOAT,
      cut_nominal: DataTypes.INTEGER,
      description: DataTypes.STRING,
      expired_at: DataTypes.DATE,
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "vouchers",
    }
  );
  return vouchers;
};

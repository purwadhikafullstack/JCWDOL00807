"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class discounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.item_products, {
        foreignKey: "discount_id",
      });
    }
  }
  discounts.init(
    {
      discount_type: DataTypes.STRING,
      description: DataTypes.STRING,
      start: DataTypes.DATE,
      end: DataTypes.DATE,
      cut_nominal: DataTypes.INTEGER,
      cut_percentage: DataTypes.FLOAT,
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "discounts",
    }
  );
  return discounts;
};

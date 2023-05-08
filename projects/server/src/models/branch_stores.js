"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class branch_stores extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.admins, {
        foreignKey: "branch_stores_id",
      }),
        this.hasMany(models.item_products, {
          foreignKey: "branch_stores_id",
        }),
        this.hasMany(models.carts, {
          foreignKey: "branch_stores_id",
        });
    }
  }
  branch_stores.init(
    {
      name: DataTypes.STRING,
      street: DataTypes.STRING,
      city: DataTypes.STRING,
      province: DataTypes.STRING,
      postal_code: DataTypes.INTEGER,
      country: DataTypes.STRING,
      latitude: DataTypes.STRING,
      longitude: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "branch_stores",
    }
  );
  return branch_stores;
};

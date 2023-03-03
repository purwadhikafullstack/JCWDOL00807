"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class admins extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.branch_stores, {
        foreignKey: "admins_id",
      });
    }
  }
  admins.init(
    {
      name: DataTypes.STRING,
      role: DataTypes.STRING,
      password: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: { msg: "Email Not Valid" },
        },
        unique: true,
      },
      access: {
        type: DataTypes.STRING,
        defaultValue: "Enabled",
      },
    },
    {
      sequelize,
      modelName: "admins",
    }
  );
  return admins;
};

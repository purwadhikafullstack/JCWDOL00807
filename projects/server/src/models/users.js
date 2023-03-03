"use strict";
const { Model } = require("sequelize");
const { UUIDV4 } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.user_profile, {
        foreignKey: "users_id",
      });
      this.hasMany(models.user_address, {
        foreignKey: "users_id",
      }),
        this.hasMany(models.vouchers, {
          foreignKey: "users_id",
        }),
        this.hasMany(models.transactions, {
          foreignKey: "users_id",
        }),
        this.hasMany(models.carts, {
          foreignKey: "users_id",
        });
    }
  }
  users.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
      },
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: { msg: "Email Not Valid" },
        },
        unique: true,
      },
      password: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      status: {
        type: DataTypes.STRING,
        defaultValue: "Unverified",
      },
      otp: DataTypes.STRING,
      referral_code: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};

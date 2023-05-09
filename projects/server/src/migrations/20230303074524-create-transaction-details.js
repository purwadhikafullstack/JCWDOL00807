"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transaction_details", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      product_name: {
        type: Sequelize.STRING,
      },
      qty: {
        type: Sequelize.INTEGER,
      },
      discount_type: {
        type: Sequelize.STRING,
      },
      voucher_type: {
        type: Sequelize.STRING,
      },
      cut_nominal: {
        type: Sequelize.INTEGER,
      },
      cut_percentage: {
        type: Sequelize.FLOAT,
      },
      price_per_item: {
        type: Sequelize.INTEGER,
      },
      weight: {
        type: Sequelize.FLOAT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("transaction_details");
  },
};

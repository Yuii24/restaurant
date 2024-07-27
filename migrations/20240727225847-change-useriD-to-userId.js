'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn("restaurants", "useriD", "userId")
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn("restaurants", "userId", "useriD")
  }
};

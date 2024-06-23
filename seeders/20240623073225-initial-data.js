'use strict';

const fs = require("fs");
const path = require("path")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const dataJ = JSON.parse(fs.readFileSync('E:/AC_C4/restaurant-test/public/restaurant.json', 'utf8'));
      const dataJR = dataJ.results;
      await queryInterface.bulkInsert('restaurants',
        Array.from({ length: dataJR.length }).map((_, i) =>
        ({
          id: `${dataJR[i].id}`,
          name: `${dataJR[i].name}`,
          name_en: `${dataJR[i].name_en}`,
          category: `${dataJR[i].category}`,
          image: `${dataJR[i].image}`,
          location: `${dataJR[i].location}`,
          phone: `${dataJR[i].phone}`,
          google_map: `${dataJR[i].google_map}`,
          description: `${dataJR[i].description}`
        }), {})
      );
      console.log('Data has been successfully inserted.');
    } catch (error) {
      console.error('Error inserting data:', error);
      throw error; // Re-throw the error to ensure the migration fails
    }
  },
  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkDelete('restaurants', null, {});
      console.log('Data has been successfully deleted.');
    } catch (error) {
      console.error('Error deleting data:', error);
      throw error; // Re-throw the error to ensure the migration fails
    }
  }
};

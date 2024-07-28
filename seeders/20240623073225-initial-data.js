'use strict';

const fs = require("fs");
const path = require("path")
const bcrypt = require("bcryptjs")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let transaction

    try {
      transaction = await queryInterface.sequelize.transaction()

      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash("12345678", salt)


      const dataJ = JSON.parse(fs.readFileSync('E:/AC_C4/restaurant-test/public/restaurant.json', 'utf8'));
      const dataJR = dataJ.results;

      const restaurants = dataJR.map((restaurant, i) => {
        let userId = 0;
        if ([1, 2, 3, 7, 8].includes(i + 1)) { // 检查索引+1是否在指定的数组中
          userId = 1;
        } else if ([4, 5, 6].includes(i + 1)) {
          userId = 2;
        }
        return {
          id: restaurant.id,
          name: restaurant.name,
          name_en: restaurant.name_en,
          category: restaurant.category,
          image: restaurant.image,
          location: restaurant.location,
          phone: restaurant.phone,
          google_map: restaurant.google_map,
          description: restaurant.description,
          rating: restaurant.rating,
          userId: userId
        };
      });

      await queryInterface.bulkInsert("users", [
        {
          id: 1,
          name: "user1",
          email: "user1@example.com",
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          name: "user2",
          email: "user2@example.com",
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction })

      console.log('Users inserted');

      await queryInterface.bulkInsert('restaurants', restaurants, { transaction })
      console.log('Data has been successfully inserted.');

      await transaction.commit();
    } catch (error) {
      console.error('Error inserting data:', error);
      throw error; // Re-throw the error to ensure the migration fails
    }
  },



  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkDelete('users', null, {});
      console.log('Data has been successfully deleted.');
    } catch (error) {
      console.error('Error deleting data:', error);
      throw error; // Re-throw the error to ensure the migration fails
    }
  }
};

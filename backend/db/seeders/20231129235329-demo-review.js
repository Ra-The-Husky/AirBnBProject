"use strict";
const { Review } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Review.bulkCreate(
        // options,
        [
          {
            spotId: 1,
            userId: 1,
            review: "This place was ok at best and bareable at worst. Strange noise above my bed at night. Asked about it, and got looked at like I had multiple heads. Plus a weird smell in the bathroom that I couldn't find the source of. Ugh",
            stars: 3,
          },
          {
            spotId: 2,
            userId: 2,
            review: "Leaving a review just cuz.",
            stars: 4,
          },
          {
            spotId: 3,
            userId: 3,
            review: "My rating tells you enough.",
            stars: 2,
          },
          {
            spotId: 4,
            userId: 4,
            review: "Smh, this place was trash tier lolz wast of money bro. Dont go heere lmao",
            stars: 1,
          },
          {
            spotId: 1,
            userId: 2,
            review: "pics tell a differnt story. Got there and the rooms were still dirty from last renters? It was hard for me to sleep with all the weird noise in attic",
            stars: 1,
          },
          {
            spotId: 2,
            userId: 3,
            review: "it was aight ig",
            stars: 4,
          },
        ],
        { validate: true }
      );
    } catch (error) {
      console.log(error);
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2, 3, 4] },
      },
      {}
    );
  },
};

"use strict";
const { Review } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate(
      options,
      [
        {
          spotId: 1,
          userId: 1,
          review: "This fake spot deserves a fake review!",
          stars: 3,
        },
        {
          spotId: 2,
          userId: 2,
          review: "I can't review this spot, it's still unknown.",
          stars: 1,
        },
        {
          spotId: 3,
          userId: 3,
          review: "This spot is hot, Hot, HOTTT!!!",
          stars: 5,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};

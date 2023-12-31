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
            review: "This fake spot deserves a fake review!",
            stars: 3,
          },
          {
            spotId: 2,
            userId: 2,
            review: "I can't review this spot, it's still unknown.",
            stars: 2,
          },
          {
            spotId: 3,
            userId: 3,
            review: "This spot is hot, Hot, HOTTT!!!",
            stars: 5,
          },
          {
            spotId: 3,
            userId: 2,
            review: "This spot is too hot for me D:",
            stars: 1,
          },
          {
            spotId: 4,
            userId: 1,
            review: "I almost couldn't find my way back to reality",
            stars: 1,
          },
          {
            spotId: 4,
            userId: 3,
            review: "Very quiet space outside of time. Great for when you REALLY need to get away.",
            stars: 3,
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

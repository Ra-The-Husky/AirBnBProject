"use strict";
const { Booking } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Booking.bulkCreate(
        [
          {
            spotId: 1,
            userId: 1,
            startDate: "10-1-2023",
            endDate: "10-5-2023",
          },
          {
            spotId: 2,
            userId: 2,
            startDate: "11-5-2023",
            endDate: "11-10-2023",
          },
          {
            spotId: 3,
            userId: 3,
            startDate: "11-25-2023",
            endDate: "11-30-2023",
          },
        ],
        { validate: true }
      );
    } catch (error) {
      console.log(error);
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Booking";
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

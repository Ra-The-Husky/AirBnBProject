"use strict";
const { Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate(
      [
        {
          ownerId: 1,
          address: "123 Fake Address Ln",
          city: "Fake City",
          state: "NY",
          country: "United States",
          lat: 4.5,
          lng: 5.5,
          name: "Fake-spot",
          description: "This is a description for a fake spot",
          price: 300,
        },
        {
          ownerId: 2,
          address: "456 Unknown Drive",
          city: "Falseton",
          state: "CT",
          country: "United States",
          lat: 65.3,
          lng: 99.7,
          name: "Unknown-Joint",
          description: "This spot is unknown so this description is a warning",
          price: 1.00,
        },
        {
          ownerId: 3,
          address: "789 Fakest Ave",
          city: "Fake City",
          state: "NY",
          country: "United States",
          name: "Hot-Fake-Spot",
          description: "This spot isn't real but is HOT, somehow.",
          price: 6000.50,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: { [Op.in]: ["Fake-Spot", "Unknown-Joint", "Hot-Fake-Spot"] },
      },
      {}
    );
  },
};

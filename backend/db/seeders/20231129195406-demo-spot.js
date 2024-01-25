"use strict";
const { Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Spot.bulkCreate(
        // options,
        [
          {
            ownerId: 1,
            address: "123 Fake Ln",
            city: "False City",
            state: "NY",
            country: "United States",
            lat: Math.random() * 1000,
            lng: Math.random() * -1000,
            name: "Fake-spot",
            description: "Temporary description necessary to pass validations.",
            price: Math.round(Math.random() * 450),
          },
          {
            ownerId: 2,
            address: "456 Unknown Drive",
            city: "Falseholm",
            state: "CT",
            country: "United States",
            lat: Math.random() * 1000,
            lng: Math.random() * -1000,
            name: "Unknown-Joint",
            description:
            "Fake description necessary to pass validations.",
            price: Math.round(Math.random() * 450),
          },
          {
            ownerId: 3,
            address: "789 Fakest Ave",
            city: "Not Realton",
            state: "CA",
            country: "United States",
            lat: Math.random() * 1000,
            lng: Math.random() * -1000,
            name: "Hot-Fake-Spot",
            description: "Made this description just to pass validations.",
            price: Math.round(Math.random() * 450),
          },
          {
            ownerId: 4,
            address: "000 Void St",
            city: "Unrealdom",
            state: "AZ",
            country: "United States",
            lat: Math.random() * 1000,
            lng: Math.random() * -1000,
            name: "Some Void Place",
            description:
            "A description because validations suck.",
            price: Math.round(Math.random() * 450),
          },
        ],
        { validate: true }
      );
    } catch (error) {
      console.log(error);
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: {
          [Op.in]: [
            "Fake-Spot",
            "Unknown-Joint",
            "Hot-Fake-Spot",
            "Some Void Place",
          ],
        },
      },
      {}
    );
  },
};

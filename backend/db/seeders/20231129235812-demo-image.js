"use strict";
const { Image } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Image.bulkCreate(
      options,
      [
        {
          imageableId: 1,
          imageabletype: "Spot",
        },
        {
          imageableId: 1,
          imageabletype: "Review",
        },
        {
          imageableId: 2,
          imageabletype: "Spot",
        },
        {
          imageableId: 2,
          imageabletype: "Review",
        },
        {
          imageableId: 3,
          imageabletype: "Spot",
        },
        {
          imageableId: 3,
          imageabletype: "Review",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Images";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        imageableId: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};

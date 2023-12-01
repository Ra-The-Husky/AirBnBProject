"use strict";
const { Image } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Image.bulkCreate(
      // options,
      [
        {
          imageableId: 1,
          imageableType: 'Spot'
        },
        {
          imageableId: 1,
          imageableType: 'Review'
        },
        {
          imageableId: 2,
          imageableType: 'Spot'
        },
        {
          imageableId: 2,
          imageableType: 'Review'
        },
        {
          imageableId: 3,
          imageableType: 'Spot'
        },
        {
          imageableId: 3,
          imageableType: 'Review'
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

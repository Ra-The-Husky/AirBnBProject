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
          imageableType: 'Spot',
          imagePreview: true
        },
        {
          imageableId: 1,
          imageableType: 'Review',
          imagePreview: true
        },
        {
          imageableId: 2,
          imageableType: 'Spot',
          imagePreview: false
        },
        {
          imageableId: 2,
          imageableType: 'Review',
          imagePreview: false
        },
        {
          imageableId: 3,
          imageableType: 'Spot',
          imagePreview: true
        },
        {
          imageableId: 3,
          imageableType: 'Review',
          imagePreview: false
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

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
          preview: true,
          url: "https://t4.ftcdn.net/jpg/01/15/20/75/360_F_115207580_US2etunH78I7iMYHOoNVvxQTCIdoPdRj.jpg"
        },
        {
          imageableId: 1,
          imageableType: 'Review',
          preview: true,
          url: "https://media.tenor.com/MFE6UiMEpRoAAAAC/math-zack-galifianakis.gif"
        },
        {
          imageableId: 2,
          imageableType: 'Spot',
          preview: false
        },
        {
          imageableId: 2,
          imageableType: 'Review',
          preview: false
        },
        {
          imageableId: 3,
          imageableType: 'Spot',
          preview: true,
          url: "https://t4.ftcdn.net/jpg/01/15/20/75/360_F_115207580_US2etunH78I7iMYHOoNVvxQTCIdoPdRj.jpg"
        },
        {
          imageableId: 3,
          imageableType: 'Review',
          preview: false
        },
        {
          imageableId: 4,
          imageableType: 'Spot',
          preview: false,
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
        imageableId: { [Op.in]: [1, 2, 3, 4] },
      },
      {}
    );
  },
};

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
          url: "https://i.pinimg.com/550x/98/37/48/983748e060db43a78e6258ca0f29aa33.jpg"
        },
        {
          imageableId: 2,
          imageableType: 'Spot',
          preview: true,
          url: 'https://st.hzcdn.com/simgs/pictures/exteriors/french-city-house-bba-architects-img~f851ad7f01cc4c72_4-7397-1-35e0fe2.jpg'
        },
        {
          imageableId: 3,
          imageableType: 'Spot',
          preview: true,
          url: "https://www.trulia.com/pictures/thumbs_4/zillowstatic/fp/c3c57f43db368092c34fc51bd67a9c12-full.jpg"
        },
        {
          imageableId: 4,
          imageableType: 'Spot',
          preview: true,
          url: "https://saterdesign.com/cdn/shop/articles/bicYNooDCfCQAbvnQ8Xf0FjmW5nfKtOX1669132421_894x.jpg?v=1669242585"
        },
        {
          imageableId: 1,
          imageableType: 'Review',
          preview: true,
          url: "https://media.tenor.com/MFE6UiMEpRoAAAAC/math-zack-galifianakis.gif"
        },
        {
          imageableId: 2,
          imageableType: 'Review',
          preview: true,
          url: "https://media.tenor.com/MFE6UiMEpRoAAAAC/math-zack-galifianakis.gif"
        },
        {
          imageableId: 3,
          imageableType: 'Review',
          preview: true,
          url: "https://media.tenor.com/MFE6UiMEpRoAAAAC/math-zack-galifianakis.gif"
        },
        {
          imageableId: 4,
          imageableType: 'Review',
          preview: true,
          url: "https://media.tenor.com/MFE6UiMEpRoAAAAC/math-zack-galifianakis.gif"
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

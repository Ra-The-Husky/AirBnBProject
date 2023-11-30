"use strict";
const { Image } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Image.bulkCreate(
      [
        {
          imageableId: 1,
          imageabletype: 'Spot'
        },
        {
          imageableId: 1,
          imageabletype: 'Review'
        },
        {
          imageableId: 2,
          imageabletype: 'Spot'
        },
        {
          imageableId: 2,
          imageabletype: 'Review'
        },
        {
          imageableId: 3,
          imageabletype: 'Spot'
        },
        {
          imageableId: 3,
          imageabletype: 'Review'
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};

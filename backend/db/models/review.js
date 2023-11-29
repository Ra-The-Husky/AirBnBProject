"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.hasMany(models.Image, {
        foreignKey: 'imageableId',
        constraints: false,
        scope: {
          imageableType: 'Review'
        }
      })
    }
  }
  Review.init(
    {
      spotId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      review: {
        type: DataTypes.STRING,
        validate: {
          len: [10, 10000],
        },
      },
      stars: {
        type: DataTypes.INTEGER,
        validate: {
          isNumeric: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};

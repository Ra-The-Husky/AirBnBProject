"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      Spots.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Spot.init(
    {
      userId: DataTypes.INTEGER,
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        validate: {
          isAlpha: true,
        },
      },
      country: DataTypes.STRING,
      lat: {
        type: DataTypes.FLOAT,
        validate: {
          isNumeric: true,
        },
      },
      lng: {
        type: DataTypes.FLOAT,
        validate: {
          isNumeric: true,
        },
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Spot",
    }
  );
  return Spot;
};

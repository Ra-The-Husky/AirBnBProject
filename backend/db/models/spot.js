"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      Spot.belongsTo(models.User, { foreignKey: "ownerId" });
      Spot.belongsToMany(models.User, {
        through: models.Booking,
        foreignKey: "spotId",
        otherKey: "userId",
      });
      Spot.belongsToMany(models.User, {
        through: models.Review,
        foreignKey: "spotId",
        otherKey: "userId",
      });
      Spot.hasMany(models.Image, {
        foreignKey: "imageableId",
        constraints: false,
        scope: {
          imageableType: "Spot",
        },
      });
      Spot.hasMany(models.Review, { foreignKey: "spotId" });
    }
  }
  Spot.init(
    {
      ownerId: DataTypes.INTEGER,
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate: {
        //   isAlpha: true,
        // },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate: {
        //   isAlpha: true,
        // },
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate: {
        //   isAlpha: true,
        // },
      },
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
        validate: {
          len: [1, 500],
        },
      },
      price: {
        type: DataTypes.DECIMAL,
        validate: {
          isNumeric: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Spot",
    }
  );
  return Spot;
};

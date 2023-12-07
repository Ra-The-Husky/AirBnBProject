"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.Spot, {
        foreignKey: "spotId",
      });
      Booking.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Booking.init(
    {
      id: { type: DataTypes, primaryKey: true, autoIncrement: true },
      spotId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      startDate: {
        type: DataTypes.DATE,
        validate: {
          isDate: true,
        },
      },
      endDate: {
        type: DataTypes.DATE,
        validate: {
          isDate: true,

          notEarlierThanStart(date) {
            if (date <= this.startDate) {
              throw new Error("endDate cannot be on or before startDate");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};

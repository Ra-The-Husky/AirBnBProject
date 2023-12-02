const express = require("express");
const { Spot, Review, Image } = require("../../db/models");
const { Op } = require("sequelize");
const router = express.Router();
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const spot = require("../../db/models/spot");

router.get("/", async (req, res, next) => {
  const allSpots = await Spot.findAll({
    include: [
      {
        model: Review,
      },
      {
        model: Image,
      },
    ],
  });
  let spotsList = [];
  allSpots.forEach((spot) => {
    spotsList.push(spot.toJSON());
  });
  // Calculates Average Rating
  spotsList.forEach((spot) => {
    if (spot.Reviews) {
      let starSum = 0;
      spot.Reviews.forEach((review) => {
        // console.log(review.stars)
        if (review.stars) {
          starSum += review.stars;
        }
        spot.avgRating = starSum / spot.Reviews.length;
      });
      delete spot.Reviews;
    }
  });

  // Shows preview images or says there is none.
  spotsList.forEach((spot) => {
    spot.Images.forEach((image) => {
      if (image.imagePreview === true) {
        spot.previewImage = image.url;
      } else {
        spot.previewImage = "No preview image available.";
      }
    });
    delete spot.Images;
  });

  res.json({
    Spots: spotsList,
  });
});

module.exports = router;

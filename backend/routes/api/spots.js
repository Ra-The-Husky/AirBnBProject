const express = require("express");
const { Spot, Review, Image, User } = require("../../db/models");
const { Op } = require("sequelize");
const router = express.Router();
const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth");

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

//Get details of a spot by its id
router.get("/:spotId", async (req, res) => {
  const spotId = req.params.spotId;
  const spot = await Spot.findByPk(spotId, {
    include: [
      {
        model: Review,
      },
      {
        model: Image,
        attributes: ["id", "url", "preview"],
      },
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  });

  if (!spot) {
    res.status(404);
    res.json({
      message: "Spot couldn't be found",
    });
  } else {
    //Counts spot's reviews
    const numReviews = await Review.count({
      where: {
        spotId: spot.id,
      },
    });
    //Adds spot's review's stars
    const sumStars = await Review.sum("stars", {
      where: {
        spotId: spot.id,
      },
    });
    //Calculates spot's average stars
    const avgStars = sumStars / numReviews;

    const data = {};
    data.spot = {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      numReviews: numReviews,
      avgStarRating: avgStars,
      SpotImages: spot.Images,
      Owner: spot.User,
    };
    res.json(data);
  }
});

module.exports = router;

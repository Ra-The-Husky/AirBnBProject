const express = require("express");
const { Spot, Review, Image, User } = require("../../db/models");
const { Op } = require("sequelize");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

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

const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city")
    .exists({ checkFalsy: true })
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
    check("lat")
    .exists({ checkFalsy: true })
    .withMessage("Latitude is not valid"),
    check("lng")
    .exists({ checkFalsy: true })
    .withMessage("Longitude is not valid"),
    check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
    check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
    check("price")
    .exists({ checkFalsy: true })
    .withMessage("Price per day is required"),
  handleValidationErrors,
];

// Create a new spot if user is fully authorized
router.post("/", requireAuth, validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  if (req.user) {
    const newSpot = Spot.build({
      address: address,
      city: city,
      state: state,
      country: country,
      lat: lat,
      lng: lng,
      name: name,
      description: description,
      price: price,
    });
    await newSpot.save();
    res.status(201)
    res.json(newSpot);
  } else {
    
  }
});
module.exports = router;

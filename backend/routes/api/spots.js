const express = require("express");
const { Spot, Review, Image, User, Booking } = require("../../db/models");
const { Op } = require("sequelize");
const router = express.Router();
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
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

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .isFloat({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

function newKeyName(arr, oldKey, newKey) {
  const newArr = arr.map((obj) => {
    const newObj = { ...obj, [newKey]: obj[oldKey] };
    if (oldKey !== newKey) {
      delete newObj[oldKey];
    }
    return newObj;
  });
  return newArr;
}

// Get all spots
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

// Get spot details
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

// Get a spot's reviews
router.get("/:spotId/reviews", async (req, res) => {
  const spotId = req.params.spotId;
  const findSpot = await Spot.findOne({
    where: { id: spotId },
  });

  if (!findSpot) {
    res.status(404);
    res.json({
      message: "Spot couldn't be found",
    });
  } else {
    const spotReviews = await Review.findAll({
      where: {
        spotId: spotId,
      },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Image,
          attributes: ["id", "url"],
        },
      ],
    });

    let reviewsList = [];
    spotReviews.forEach((review) => {
      reviewsList.push(review.toJSON());
    });
    const completeReviews = newKeyName(reviewsList, "Images", "ReviewImages");

    res.json({ Reviews: completeReviews });
  }
});

// Creates a new spot with auth user
router.post("/", requireAuth, validateSpot, async (req, res) => {
  const userId = req.user.id;
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const newSpot = Spot.build({
    ownerId: userId,
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
  res.status(201);
  res.json(newSpot);
});

// Create a booking for a spot
router.post("/:spotId/bookings", requireAuth, async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;
    const spotId = req.params.spotId;

    const spot = await Spot.findOne({
      where: { id: spotId },
    });

    const bookings = await Booking.findAll({
      where: {
        spotId: spotId,
      },
    });

    if (!spot) {
      res.status(404);
      return res.json({
        message: "Spot couldn't be found",
      });
    }
    if (spot.ownerId === req.user.id) {
      res.status(403);
      return res.json({
        message: "Forbidden",
      });
    } else {
      const bookingInfo = [];
      bookings.forEach((booking) => {
        bookingInfo.push(booking.toJSON());
      });
      for (let i = 0; i < bookingInfo.length; i++) {
        const booking = bookingInfo[i];
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (
          start >= new Date(booking.startDate) &&
          start <= new Date(booking.endDate)
        ) {
          res.status(403);
          return res.json({
            message:
              "Sorry, this spot is already booked for the specified dates",
            errors: {
              startDate: "Start date conflicts with an existing booking",
            },
          });
        } else if (
          end >= new Date(booking.startDate) &&
          end <= new Date(booking.endDate)
        ) {
          res.status(403);
          return res.json({
            message:
              "Sorry, this spot is already booked for the specified dates",
            errors: {
              endDate: "End date conflicts with an existing booking",
            },
          });
        } else if (end <= start) {
          res.status(400);
          return res.json({
            message: "Bad Request",
            errors: {
              endDate: "endDate cannot be on or before startDate",
            },
          });
        }
      }
      const newBooking = Booking.build({
        spotId: Number(spotId),
        userId: req.user.id,
        startDate: startDate,
        endDate: endDate,
      });
      await newBooking.save()
      res.json(newBooking)
    }
  } catch (error) {
    console.log(error);
  }
});

// Create a review for a spot
router.post("/:spotId", requireAuth, validateReview, async (req, res) => {
  try {
    const { review, stars } = req.body;
    const spotId = req.params.spotId;

    const findSpot = await Spot.findOne({
      where: { id: spotId },
    });

    const findReview = await Review.findOne({
      where: {
        spotId: spotId,
        userId: req.user.id,
      },
    });

    if (!findSpot) {
      res.status(404);
      res.json({
        message: "Spot couldn't be found",
      });
    } else if (findReview) {
      res.status(500);
      res.json({
        message: "User already has a review for this spot",
      });
    } else {
      const newReview = Review.build({
        userId: Number(req.user.id),
        spotId: Number(spotId),
        review: review,
        stars: stars,
      });
      await newReview.save();
      res.status(201);
      res.json(newReview);
    }
  } catch (error) {
    console.log(error);
  }
});

// Adds an image to a spot
router.post("/:spotId/images", requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const { url, preview } = req.body;
  const findSpot = await Spot.findOne({
    where: { id: spotId },
  });

  if (!findSpot) {
    res.status(404);
    res.json({
      message: "Spot couldn't be found",
    });
  } else if (findSpot.ownerId === req.user.id) {
    const newSpotImage = Image.build({
      url: url,
      preview: preview,
    });
    await newSpotImage.save();
    res.status(201);
    res.json(newSpotImage);
  } else {
    res.status(403);
    res.json({
      message: "Forbidden",
    });
  }
});

// Edit current user's spot
router.put("/:spotId", requireAuth, validateSpot, async (req, res) => {
  const spotId = req.params.spotId;

  const {
    id,
    ownerId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  } = req.body;

  const updateSpot = await Spot.findOne({
    where: { id: spotId },
  });

  if (!updateSpot) {
    res.status(404);
    res.json({
      message: "Spot couldn't be found",
    });
  } else if (updateSpot.ownerId === req.user.id) {
    updateSpot.set({
      ownerId: ownerId,
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
    await updateSpot.save();
    res.json(updateSpot);
  } else {
    res.status(403);
    res.json({
      message: "Forbidden",
    });
  }
});

// Deletes current user's spots
router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const spotId = req.params.spotId;
  const deleteSpot = await Spot.findOne({
    where: { id: spotId },
  });
  if (!deleteSpot) {
    res.status(404);
    res.json({
      message: "Spot couldn't be found",
    });
  } else if (deleteSpot.ownerId === req.user.id) {
    await deleteSpot.destroy();
    res.json({
      message: "Successfully deleted",
    });
  } else {
    res.status(403);
    res.json({
      message: "Forbidden",
    });
  }
});

// Deletes a spot's image
router.delete(
  "/:spotId/images/:imageId",
  requireAuth,
  async (req, res, next) => {
    const spotId = req.params.spotId;
    const imageId = req.params.imageId;
    const deleteImage = await Image.findOne({
      where: { imageableId: spotId, id: imageId, imageableType: "Spot" },
    });
    const ownerSpot = await Spot.findOne({
      where: { id: spotId, ownerid: req.user.id },
    });
    if (!deleteImage) {
      res.status(404);
      res.json({
        message: "Spot Image couldn't be found",
      });
    } else if (ownerSpot) {
      await deleteImage.destroy();
      res.json({
        message: "Successfully deleted",
      });
    } else {
      res.status(403);
      res.json({
        message: "Forbidden",
      });
    }
  }
);

module.exports = router;

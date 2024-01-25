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
    .withMessage("Name is required")
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .isLength({ min: 30 })
    .withMessage("Description needs a minimum of 30 characters"),
  check("price")
    .exists({ checkFalsy: true })
    .isNumeric({ gt: 0 })
    .withMessage("Price per day must be a positive number"),
  handleValidationErrors,
];

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

const validQueries = [
  check("page")
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage("Page must be greater than or equal to 1"),
  check("size")
    .optional()
    .isFloat({ min: 1, max: 20 })
    .withMessage("Size must be greater than or equal to 1"),
  check("maxLat")
    .optional()
    .isFloat({ max: 90 })
    .withMessage("Maximum latitude is invalid"),
  check("minLat")
    .optional()
    .isFloat({ min: -90 })
    .withMessage("Minimum latitude is invalid"),
  check("maxLng")
    .optional()
    .isFloat({ max: 180 })
    .withMessage("Maximum longitude is invalid"),
  check("minLng")
    .optional()
    .isFloat({ min: -180 })
    .withMessage("Minimum longitude is invalid"),
  check("minPrice")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0"),
  check("maxPrice")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Minimum price must be greater than or equal to 0"),
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
router.get("/", validQueries, async (req, res, next) => {
  let { page, size } = req.query;
  let allSpots;
  const where = {};

  page = !page ? 1 : parseInt(page);
  size = !size ? 20 : parseInt(size);
  let pagination = {};

  if (page >= 1 && size >= 1) {
    if (page > 10) {
      pagination.limit = 10;
    } else {
      pagination.limit = size;
    }
    if (size > 20) {
      pagination.offset = 20 * (page - 1);
    } else {
      pagination.offset = size * (page - 1);
    }
  }

  if (req.query) {
    if (req.query.minLat) {
      where.lat = {
        [Op.gte]: req.query.minLat,
      };
    }
    if (req.query.maxLat) {
      where.lat = {
        [Op.lte]: req.query.maxLat,
      };
    }
    if (req.query.minLat && req.query.maxLat) {
      where.lng = {
        [Op.between]: [req.query.minLat, req.query.maxLat],
      };
    }
    if (req.query.minLng) {
      where.lng = {
        [Op.gte]: req.query.minLng,
      };
    }
    if (req.query.maxLng) {
      where.lng = {
        [Op.lte]: req.query.maxLng,
      };
    }
    if (req.query.minLng && req.query.maxLng) {
      where.lng = {
        [Op.between]: [req.query.minLng, req.query.maxLng],
      };
    }
    if (req.query.maxPrice) {
      where.price = {
        [Op.lte]: req.query.maxPrice,
      };
    }
    if (req.query.minPrice) {
      where.price = {
        [Op.gte]: req.query.minPrice,
      };
    }
    if (req.query.minPrice && req.query.maxPrice) {
      where.lng = {
        [Op.between]: [req.query.minPrice, req.query.maxPrice],
      };
    }
    allSpots = await Spot.findAll({
      where,
      include: [{ model: Review }, { model: Image }],
      ...pagination,
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
        if (image.preview === true) {
          spot.previewImage = image.url;
        } else {
          spot.previewImage = "No preview image available.";
        }
      });
      delete spot.Images;
    });

    return res.json({
      Spots: spotsList,
      page,
      size,
    });
  } else {
    allSpots = await Spot.findAll({
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

    return res.json({
      Spots: spotsList,
      page,
      size,
    });
  }
});

// Get current user's spots
router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;
  let userSpots = await Spot.findAll({
    where: {
      ownerId: userId,
    },
    include: [
      {
        model: Review,
      },
      {
        model: Image,
      },
    ],
  });
  // if (userSpots.length >= 1) {
  let usersList = [];
  userSpots.forEach((spot) => {
    usersList.push(spot.toJSON());
  });
  // Calculates Average Rating
  usersList.forEach((spot) => {
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
  usersList.forEach((spot) => {
    spot.Images.forEach((image) => {
      if (image.preview === true) {
        spot.previewImage = image.url;
      } else {
        spot.previewImage = "No preview image available.";
      }
    });
    delete spot.Images;
  });

  return res.json({
    Spots: usersList,
  });
  // }
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
    return res.json({
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
    return res.json(data);
  }
});

//Get a spot's bookings
router.get("/:spotId/bookings", async (req, res) => {
  const spotId = req.params.spotId;
  const spot = await Spot.findOne({
    where: { id: spotId },
  });

  if (!spot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found",
    });
  } else {
    const bookings = await Booking.findAll({
      where: {
        spotId: spotId,
      },
      include: {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
    });
    if (spot.ownerId !== req.user.id) {
      const newData = {
        spotId: bookings[0].spotId,
        startDate: bookings[0].startDate,
        endDate: bookings[0].endDate,
      };
      return res.json({ Bookings: newData });
    } else {
      return res.json({ Bookings: bookings });
    }
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
    return res.json({
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

    return res.json({ Reviews: completeReviews });
  }
});

// Creates a new spot with auth user
router.post("/", requireAuth, validateSpot, async (req, res) => {
  const userId = req.user.id;
  const {
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
    previewImage,
  } = req.body;

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
    previewImage: previewImage,
  });
  await newSpot.save();
  res.status(201);
  return res.json(newSpot);
});

// Create a booking for a spot
router.post("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const { startDate, endDate } = req.body;
  const spotId = req.params.spotId;
  const now = new Date();
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
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            startDate: "Start date conflicts with an existing booking",
          },
        });
      }
      if (
        end >= new Date(booking.startDate) &&
        end <= new Date(booking.endDate)
      ) {
        res.status(403);
        return res.json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            endDate: "End date conflicts with an existing booking",
          },
        });
      }
      if (end <= start) {
        res.status(400);
        return res.json({
          message: "Bad Request",
          errors: {
            endDate: "endDate cannot be on or before startDate",
          },
        });
      }
      if (start < now) {
        res.status(400);
        return res.json({
          message: "Bad Request",
          errors: {
            startDate: "startDate cannot be in the past",
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
    await newBooking.save();
    return res.json(newBooking);
  }
});

// Create a review for a spot
router.post(
  "/:spotId/reviews",
  requireAuth,
  validateReview,
  async (req, res) => {
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
      return res.json({
        message: "Spot couldn't be found",
      });
    }
    if (findReview) {
      res.status(500);
      return res.json({
        message: "User already has a review for this spot",
      });
    }

    const newReview = Review.build({
      userId: Number(req.user.id),
      spotId: Number(spotId),
      review: review,
      stars: stars,
    });
    await newReview.save();
    res.status(201);
    return res.json(newReview);
  }
);

// Adds an image to a spot
router.post("/:spotId/images", requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const { url, preview } = req.body;
  const findSpot = await Spot.findOne({
    where: { id: spotId },
  });

  if (!findSpot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found",
    });
  } else if (findSpot.ownerId === req.user.id) {
    const newSpotImage = Image.build({
      url: url,
      imageableId: spotId,
      imageableType: "Spot",
      preview: preview,
    });
    await newSpotImage.save();
    return res.json(newSpotImage);
  } else {
    res.status(403);
    return res.json({
      message: "Forbidden",
    });
  }
});

// Edit current user's spot
router.put("/:spotId", requireAuth, validateSpot, async (req, res) => {
  const spotId = req.params.spotId;

  const {
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
    return res.json({
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
    return res.json(updateSpot);
  } else {
    res.status(403);
    return res.json({
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
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
  if (deleteSpot.ownerId !== req.user.id) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }
  await deleteSpot.destroy();
  return res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;

// backend/routes/api/users.js
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const { User, Spot, Image, Review, Booking } = require("../../db/models");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email"),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Username is required"),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
    check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("First Name is required"),
    check("LastName")
    .exists({ checkFalsy: true })
    .withMessage("Last Name is required"),
  handleValidationErrors,
];

//Changes object key's name to a different
//key name without changing any of the values within the array of object
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

// Get current user's spots
router.get("/:userId/spots", requireAuth, async (req, res) => {
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

  if (userSpots.length >= 1) {
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

    res.json({
      Spots: usersList,
    });
  }
});

// Get current user's bookings
router.get("/:userId/bookings", requireAuth, async (req, res) => {
  const userId = req.user.id;
  let bookings = await Booking.findAll({
    where: {
      userId: userId,
    },
    include: [
      {
        model: Spot,
        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "lat",
          "lng",
          "name",
          "price",
        ],
        include: {
          model: Image,
        },
      },
    ],
  });
  let bookingInfo = [];
  bookings.forEach((booking) => {
    bookingInfo.push(booking.toJSON());
  });

  bookingInfo.forEach((booking) => {
    booking.Spot.Images.forEach((image) => {
      if (image.preview === true) {
        booking.Spot.previewImage = image.url;
      } else {
        booking.Spot.previewImage = "No preview image";
      }
    });
    delete booking.Spot.Images;
  });
  res.json({ Bookings: bookingInfo });
});

// Get current user's reviews
router.get("/:userId/reviews", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const userReviews = await Review.findAll({
    where: {
      userId: userId,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Spot,
        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "lat",
          "lng",
          "name",
          "price",
        ],
        include: { model: Image },
      },
      {
        model: Image,
        attributes: ["id", "url"],
      },
    ],
  });
  let reviewsList = [];
  userReviews.forEach((review) => {
    reviewsList.push(review.toJSON());
  });
  reviewsList.forEach((review) => {
    review.Spot.Images.forEach((spot) => {
      if (spot.preview === true) {
        review.Spot.previewImage = spot.url;
      } else {
        review.Spot.previewImage = "No preview image available.";
      }
    });
    delete review.Spot.Images;
  });

  const completeReviews = newKeyName(reviewsList, "Images", "ReviewImages");

  res.json({ Reviews: completeReviews });
});

// Sign up
router.post("/", validateSignup, async (req, res) => {
  const { firstName, lastName, email, password, username } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({
    firstName,
    lastName,
    email,
    username,
    hashedPassword,
  });

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});

module.exports = router;

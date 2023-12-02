// backend/routes/api/users.js
const express = require("express");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, Image, Review } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const review = require("../../db/models/review");

const router = express.Router();

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

// Get all current user's spots
router.get("/:userId/spots", async (req, res, next) => {
  const userId = req.params.userId;

  let userSpots = await Spot.findAll({
    where: {
      ownerId: userId,
    },
    include: [
      {
        model: Review,
      },
      { model: Image },
    ],
  });

  if (userSpots) {
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
        if (image.imagePreview === true) {
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

const express = require("express");
const router = express.Router();

const { Review, User, Image, Spot } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

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

// Get current user's reviews
router.get("/current", requireAuth, async (req, res) => {
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

  return res.json({ Reviews: completeReviews });
});

// Adds an image to a review
router.post("/:reviewId/images", requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const { url } = req.body;
  const findReview = await Review.findOne({
    where: { id: reviewId },
    include: [
      {
        model: Image,
      },
    ],
  });

  if (!findReview) {
    res.status(404);
    res.json({
      message: "Review couldn't be found",
    });
  } else {
    const reviewImageList = [];
    findReview.Images.forEach((image) => {
      reviewImageList.push(image.toJSON());
    });

    if (reviewImageList.length === 10) {
      res.status(403);
      res.json({
        message: "Maximum number of images for this resource was reached",
      });
    } else if (findReview.userId === req.user.id) {
      const newReviewImage = Image.build({
        url: url,
        imageableId: reviewId,
        imageableType: "Review",
      });
      await newReviewImage.save();
      const nri = newReviewImage.toJSON();

      delete nri.imageableType;
      delete nri.imageableId;
      delete nri.createdAt;
      delete nri.updatedAt;

      // console.log(findReview);
      res.status(201);
      return res.json(nri);
    } else {
      res.status(403);
      return res.json({
        message: "Forbidden",
      });
    }
  }
});

// Edit user's reviews
router.put("/:reviewId", requireAuth, validateReview, async (req, res) => {
  const { review, stars } = req.body;
  const reviewId = req.params.reviewId;
  const updateReview = await Review.findOne({
    where: {
      id: reviewId,
    },
  });
  if (!updateReview) {
    res.status(404);
    res.json({
      message: "Review couldn't be found",
    });
  } else if (updateReview.userId === req.user.id) {
    updateReview.set({
      review: review,
      stars: stars,
    });
    await updateReview.save();
    res.json(updateReview);
  } else {
    res.status(403);
    res.json({
      message: "Forbidden",
    });
  }
});

// Delete a user's review
router.delete("/:reviewId", requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const deleteReview = await Review.findOne({
    where: {
      id: +reviewId,
    },
  });
  if (!deleteReview) {
    res.status(404);
    return res.json({
      message: "Review couldn't be found",
    });
  }
  if (deleteReview.userId !== req.user.id) {
    res.status(403);
    return res.json({
      message: "Forbidden",
    });
  }
  deleteReview.destroy();
  return res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;

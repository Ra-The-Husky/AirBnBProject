const express = require("express");
const router = express.Router();

const { Review, Image } = require("../../db/models");
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

// Adds an image to a review
router.post("/:reviewId/images", requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const { url } = req.body;
  const findReview = await Review.findOne({
    where: { id: reviewId, userId: req.user.id },
  });
  const reviewImageList = []
  reviewImageList.push(findReview.toJSON())

  if (!findReview) {
    res.status(404);
    res.json({
      message: "Review couldn't be found",
    });
  } else if (reviewImageList.length === 10) {
    res.status(403);
    res.json({
      message: "Maximum number of images for this resource was reached",
    });
  } else if (findReview.userId === req.user.id) {
    const newReviewImage = Image.build({
      url: url,
    });
    await newReviewImage.save();
    res.status(201);
    res.json(newReviewImage);
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

  if (updateReview && updateReview.userId === req.user.id) {
    updateReview.set({
      review: review,
      stars: stars,
    });
    await updateReview.save();
    res.json(updateReview);
  } else {
    res.status(404);
    res.json({
      message: "Review couldn't be found",
    });
  }
});

// Delete a user's review
router.delete("/:reviewId", async (req, res) => {
  const reviewId = req.params.reviewId;
  const deleteReview = await Review.findOne({
    where: {
      id: reviewId,
    },
  });
  if (req.user) {
    if (deleteReview && deleteReview.userId === req.user.id) {
      deleteReview.destroy();
      res.json({
        message: "Successfully deleted",
      });
    } else {
      res.status(404);
      res.json({
        message: "Review couldn't be found",
      });
    }
  }
});

module.exports = router;

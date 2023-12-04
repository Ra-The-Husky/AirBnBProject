const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const { Review } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .exists({ checkFalsy: true })
    .isFloat({ min: 1, max: 5})
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

// Edit user's reviews
router.put("/:reviewId", requireAuth, validateReview, async (req, res) => {
  try {
    const { review, stars } = req.body;
    const reviewId = req.params.reviewId;
    const updateReview = await Review.findOne({
      where: {
        id: reviewId,
      },
    });
    if (req.user) {
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
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

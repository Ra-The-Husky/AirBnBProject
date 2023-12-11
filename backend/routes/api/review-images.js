const express = require("express");
const router = express.Router();

const { Review, Image } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

// Deletes a review's image
router.delete("/:imageId", requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const imageId = req.params.imageId;
  const deleteImage = await Image.findOne({
    where: { imageableId: reviewId, id: imageId, imageableType: "Review" },
  });
  const ownerReview = await Review.findOne({
    where: { id: reviewId },
  });

  if (!deleteImage) {
    res.status(404);
    return res.json({
      message: "Review Image couldn't be found",
    });
  } else if (ownerReview && ownerReview.userId === req.user.id) {
    await deleteImage.destroy();
    return res.json({
      message: "Successfully deleted",
    });
  } else {
    res.status(403);
    return res.json({
      message: "Forbidden",
    });
  }
});

module.exports = router;

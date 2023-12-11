const express = require("express");
const router = express.Router();

const { Review, Image } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

// Deletes a review's image
router.delete("/:imageId", requireAuth, async (req, res) => {
  const imageId = req.params.imageId;
  const deleteImage = await Image.findOne({
    where: { id: imageId, imageableType: "Review" },
    include: { model: Review },
  });

  if (!deleteImage) {
    res.status(404);
    return res.json({
      message: "Review Image couldn't be found",
    });
  }
  if (deleteImage.Review.userId !== req.user.id) {
    res.status(403);
    return res.json({
      message: "Forbidden",
    });
  }
  await deleteImage.destroy();
  return res.json({
    message: "Successfully deleted",
  });
});

// Deletes a spot's image
router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const imageId = req.params.imageId;
  const deleteImage = await Image.findOne({
    where: { id: imageId, imageableType: "Spot" },
    include: { model: Spot },
  });
  if (!deleteImage) {
    res.status(404);
    return res.json({
      message: "Spot Image couldn't be found",
    });
  }
  if (deleteImage.Spot.ownerId !== req.user.id) {
    res.status(403);
    return res.json({
      message: "Forbidden",
    });
  }

  await deleteImage.destroy();
  return res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;

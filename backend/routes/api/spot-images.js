const express = require("express");
const router = express.Router();
const { Spot, Image } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

// Deletes a spot's image
router.delete("/:imageId", requireAuth, async (req, res, next) => {

  const imageId = req.params.imageId;
    const deleteImage = await Image.findOne({
        where: { id: imageId, imageableType: "Spot" },
        include : { model: Spot}
    });
    if (!deleteImage) {
       return res.status(404).json({
            message: "Spot Image couldn't be found",
        });
    }
    if (deleteImage.Spot.ownerId !== req.user.id) {
     return res.status(403).json({
        message: "Forbidden",
      });
    }

    await deleteImage.destroy();
    return res.json({
      message: "Successfully deleted",
    });
});

module.exports = router;

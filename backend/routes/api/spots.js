const express = require("express");
const { Spot, Review, Image } = require("../../db/models");
const { Op } = require("sequelize");
const router = express.Router();
const { setTokenCookie, restoreUser } = require("../../utils/auth");

router.get("/", async (req, res, next) => {
  let allSpots = [];

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
  res.status(200);
  res.json(allSpots);
});

module.exports = router;

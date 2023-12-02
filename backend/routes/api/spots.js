const express = require("express");
const { Spot, Review, Image, User } = require("../../db/models");
const { Op } = require("sequelize");
const router = express.Router();
const { setTokenCookie, restoreUser } = require("../../utils/auth");

router.get("/", async (req, res, next) => {
  const allSpots = await Spot.findAll({
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

  res.json({
    Spots: spotsList,
  });
});

//Get details of a spot by its id
router.get("/:spotId", async (req, res) => {
  const spotId = req.params.spotId;
  const findSpot = await Spot.findByPk(spotId, {
    include: [
      {
        model: Review,
      },
      {
        model: Image,
      },
      {
        model: User,
      },
    ],
  });
  console.log(findSpot);
  res.json(findSpot);
});
// let spotDeets = [];
// findSpot.forEach((spot) => {
//   spotDeets.push(spot.toJSON());
//   console.log(spotDeets);
//   res.json(spotDeets);
// });
// } else {
//   res.status(404);
//   res.json({
//     message: "Spot couldn't be found",
//   });
// }
//   let spotsList = [];
//   allSpots.forEach((spot) => {
//     spotsList.push(spot.toJSON());
//   });
//   // Calculates Average Rating
//   spotsList.forEach((spot) => {
//     if (spot.Reviews) {
//       let starSum = 0;
//       spot.Reviews.forEach((review) => {
//         // console.log(review.stars)
//         if (review.stars) {
//           starSum += review.stars;
//         }
//         spot.avgRating = starSum / spot.Reviews.length;
//       });
//       delete spot.Reviews;
//     }
//   });

//   // Shows preview images or says there is none.
//   spotsList.forEach((spot) => {
//     spot.Images.forEach((image) => {
//       if (image.imagePreview === true) {
//         spot.previewImage = image.url;
//       } else {
//         spot.previewImage = "No preview image available.";
//       }
//     });
//     delete spot.Images;
//   });

//   res.json({
//     Spots: spotsList,
//   });

module.exports = router;

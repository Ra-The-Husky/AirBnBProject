const express = require("express");
const router = express.Router();
const { Booking, Spot, Image } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

// Get current user's bookings
router.get("/current", requireAuth, async (req, res) => {
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
  return res.json({ Bookings: bookingInfo });
});

// Edits a user's booking
router.put("/:bookingId", requireAuth, async (req, res, next) => {
  const bookingId = req.params.bookingId;
  const { startDate, endDate } = req.body;
  const now = new Date();

  const booking = await Booking.findOne({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    res.status(404);
    return res.json({
      message: "Booking couldn't be found",
    });
  }

  if (booking.userId !== req.user.id) {
    res.status(403);
    return res.json({
      message: "Forbidden",
    });
  } else if (booking.endDate < now) {
    res.status(403);
    return res.json({
      message: "Past bookings can't be modified",
    });
  } else {
    const bookings = await Booking.findAll({
      where: {
        spotId: booking.spotId,
      },
    });

    const allBookings = [];
    bookings.forEach((booking) => {
      allBookings.push(booking.toJSON());
    });
    for (let i = 0; i < allBookings.length; i++) {
      const booking = allBookings[i];
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start >= booking.startDate && start <= booking.endDate) {
        res.status(403);
        return res.json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            startDate: "Start date conflicts with an existing booking",
          },
        });
      } else if (end >= booking.startDate && end <= booking.endDate) {
        return res.status(403).json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            endDate: "End date conflicts with an existing booking",
          },
        });
      } else if (end < start) {
        res.status(400);
        return res.json({
          message: "Bad Request",
          errors: {
            endDate: "endDate cannot come before startDate",
          },
        });
      } else if (start < now) {
        res.status(400);
        return res.json({
          message: "Bad Request",
          errors: {
            startDate: "startDate cannot be in the past",
          },
        });
      }
    }
  }
  let updatedBooking = await Booking.update(
    {
      startDate,
      endDate,
    },
    {
      where: {
        id: bookingId,
      },
    }
  );
  const newBooking = await Booking.findByPk(bookingId);
  return res.json(newBooking);
});

// Deletes a user's bookinh
router.delete("/:bookingId", requireAuth, async (req, res, next) => {
  const bookingId = req.params.bookingId;
  const now = new Date();

  const booking = await Booking.findOne({
    where: {
      id: bookingId,
    },
    include: [
      {
        model: Spot,
      },
    ],
  });

  if (!booking) {
    res.status(404);
    return res.json({
      message: "Booking couldn't be found",
    });
  }
  if (booking.startDate <= now) {
    res.status(403);
    return res.json({
      message: "Bookings that have been started can't be deleted",
    });
  } else if (+booking.Spot.ownerId === +req.user.id) {
    await booking.destroy();
    return res.json({
      message: "Successfully deleted",
    });
  } else if (booking.userId !== +req.user.id) {
    res.status(403);
    return res.json({
      message: "Forbidden",
    });
  } else {
    await booking.destroy();
    return res.json({
      message: "Successfully deleted",
    });
  }
});

module.exports = router;

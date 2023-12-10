const express = require("express");
const router = express.Router();
const { Booking, User, Spot } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

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

  const bookings = await Booking.findAll({
    where: {
      spotId: booking.spotId,
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
  } else if (
    booking.Spot.ownerId !== +req.user.id ||
    booking.userId !== +req.user.id
  ) {
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

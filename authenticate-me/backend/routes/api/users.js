// backend/routes/api/users.js
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const { User } = require("../../db/models");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email"),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Username is required"),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
    check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("First Name is required"),
    check("lastName")
    .exists({ checkFalsy: true })
    .withMessage("Last Name is required"),
  handleValidationErrors,
];

//Changes object key's name to a different
//key name without changing any of the values within the array of object
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

// Sign up
router.post("/", validateSignup, async (req, res) => {
  const { firstName, lastName, email, password, username } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({
    firstName,
    lastName,
    email,
    username,
    hashedPassword,
  });

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});

module.exports = router;

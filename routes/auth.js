const express = require("express");
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post(
  "/",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 character").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, password, email } = req.body;
      const isUserExist = await User.findOne({ email });

      if (isUserExist)
        return res
          .status(400)
          .json({ error: "User with this email already exists!!" });

      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(password, salt);
      const user = await User.create({
        name,
        password: securePassword,
        email,
      });

      const data = {
        user: {
          id: user.id,
          email,
        }
      }
      const authToken = jwt.sign(data, process.env.JWT_SECRET);

      res.status(201).json({ message: "User created successfully!",  authToken });
    } catch (error) {
      res.status(500).send("Something is wrong!");
    }
  },
);

module.exports = router;

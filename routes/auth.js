const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const authentication = require("../middleware/authentication");
const router = express.Router();

router.post(
  "/signup",
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
        return res.status(400).json({ success:false, error: errors.array()[0].msg });
      }

      const { name, password, email } = req.body;
      const isUserExist = await User.findOne({ email });

      if (isUserExist)
        return res
          .status(400)
          .json({ success:false, error: "User with this email already exists!!" });

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
        },
      };
      const authToken = jwt.sign(data, process.env.JWT_SECRET);

      res
        .status(201)
        .json({ success: true, message: "User created successfully!", token: authToken });
    } catch (error) {
      console.log(error)
      res.status(500).json({ success:false, error: "Something is wrong!" });
    }
  },
);

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      let isUserExist = await User.findOne({ email });

      if (!isUserExist)
        return res
          .status(400)
          .json({ success: false, error: "Invalid Credentials!" });

      const isPasswordMatch = await bcrypt.compare(
        password,
        isUserExist.password,
      );

      if (!isPasswordMatch)
        return res
          .status(400)
          .json({ success: false, error: "Invalid Credentials!" });

      const data = {
        user: { id: isUserExist.id, email },
      };
      
      if (!process.env.JWT_SECRET)
        throw new Error(
          "JWT_SECRET environment variable is missing on the server.",
        );

      const authToken = jwt.sign(data, process.env.JWT_SECRET);

      res
        .status(200)
        .json({ success: true, message: "Login Successfully!", authToken });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, error: "Internal Server Error!" });
    }
  },
);

router.get("/getUser", authentication, async (req, res) => {
  try {
    const { email, id } = req.user;
    const user = await User.findOne({ _id: id });
    res.status(200).json({ data: user });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something is wrong!");
  }
});

module.exports = router;

const express = require("express");
const authentication = require("../middleware/authentication");
const Notes = require("../models/Notes");
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.get("/fetchallnotes", authentication, async (req, res) => {
  try {
    const { id } = req.user;
    const notes = await Notes.find({ user: id });
    res.json({ notes });
  } catch (error) {
    res.status(500).send("Something is wrong!");
  }
});

router.post(
  "/addnote",
  authentication,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  },
);
module.exports = router;

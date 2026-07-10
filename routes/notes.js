const express = require('express');
const authentication = require("../middleware/authentication");
const Notes = require('../models/Notes');

const router = express.Router();

router.get('/fetchallnotes', authentication, async (req, res) => {
  try {
    const { id } = req.user;
    const notes = await Notes.find({ user: id });
    res.json({ notes })
  } catch (error) {
    res.status(500).send("Something is wrong!");
  }
});


module.exports = router;
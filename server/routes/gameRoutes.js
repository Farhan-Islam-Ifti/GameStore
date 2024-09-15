const express = require('express');
const router = express.Router();
const Game = require('../model/gameModel');
const multer = require('multer');
const path = require('path');

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) // Appending extension
  }
});

const upload = multer({ storage: storage });

// GET route to fetch games
router.get('/games', async (req, res) => {
    try {
        const games = await Game.find({}).limit(10);
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST route to add a new game
router.post('/games', upload.single('image'), async (req, res) => {
  try {
    const gameData = req.body;

    // Handle image upload or URL
    if (req.file) {
      gameData.imageFileName = req.file.filename;
    } else if (req.body.imageUrl) {
      gameData.imageUrl = req.body.imageUrl;
    } else {
      return res.status(400).json({ message: 'Either an image file or image URL is required' });
    }

    // Parse array fields
    ['platform', 'tags'].forEach(field => {
      if (typeof gameData[field] === 'string') {
        gameData[field] = JSON.parse(gameData[field]);
      }
    });

    // Create new game
    const game = new Game(gameData);
    const newGame = await game.save();
    res.status(201).json(newGame);
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(400).json({ message: 'Error creating game', error: error.message });
  }
});

module.exports = router;
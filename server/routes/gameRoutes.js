const express = require('express');
const multer = require('multer');
const Game = require('../model/gameModel');
const router = express.Router();

// Multer setup for handling file uploads
const storage = multer.memoryStorage(); // Store in memory for saving in MongoDB
const upload = multer({ storage: storage });

// Fetch all games (for the product page)
router.get('/games', async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// Fetch game by ID (for game details or single product view)
router.get('/games/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.status(200).json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

router.get('/images/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game || !game.image || !game.image.data) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.set('Content-Type', game.image.contentType);
    res.send(game.image.data);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

// Add a new game with image upload
router.post('/games', upload.single('image'), async (req, res) => {
  try {
    const gameData = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      genre: req.body.genre,
      platform: JSON.parse(req.body.platform),
      developer: req.body.developer,
      publisher: req.body.publisher,
      releaseDate: req.body.releaseDate,
      rating: req.body.rating,
      tags: JSON.parse(req.body.tags),
      inStock: req.body.inStock === 'true',
      discountPercentage: req.body.discountPercentage,
    };

    // Save the uploaded image as binary in MongoDB
    if (req.file) {
      gameData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const newGame = new Game(gameData);
    await newGame.save();
    res.status(201).json({ message: 'Game added successfully!', game: newGame });
  } catch (error) {
    console.error('Error adding game:', error);
    res.status(500).json({ error: 'Failed to add game' });
  }
});

// Update a game (with optional image upload)
router.put('/games/:id', upload.single('image'), async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Update game fields
    game.title = req.body.title || game.title;
    game.description = req.body.description || game.description;
    game.price = req.body.price || game.price;
    game.genre = req.body.genre || game.genre;
    game.platform = JSON.parse(req.body.platform || JSON.stringify(game.platform));
    game.developer = req.body.developer || game.developer;
    game.publisher = req.body.publisher || game.publisher;
    game.releaseDate = req.body.releaseDate || game.releaseDate;
    game.rating = req.body.rating || game.rating;
    game.tags = JSON.parse(req.body.tags || JSON.stringify(game.tags));
    game.inStock = req.body.inStock === 'true' || game.inStock;
    game.discountPercentage = req.body.discountPercentage || game.discountPercentage;

    // Update image if new image is uploaded
    if (req.file) {
      game.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await game.save();
    res.status(200).json({ message: 'Game updated successfully!', game });
  } catch (error) {
    console.error('Error updating game:', error);
    res.status(500).json({ error: 'Failed to update game' });
  }
});

// Delete a game by ID
router.delete('/games/:id', async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.status(200).json({ message: 'Game deleted successfully!' });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ error: 'Failed to delete game' });
  }
});

module.exports = router;

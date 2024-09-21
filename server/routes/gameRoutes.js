const express = require('express');
const multer = require('multer');
const Game = require('../model/gameModel');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middlewares/verifyJWT');

// Multer setup for handling file uploads
const storage = multer.memoryStorage(); // Store in memory for saving in MongoDB
const upload = multer({ storage: storage });

// Helper function to process game image data (either as base64 or image URL)
const processGameImage = (game) => {
  if (game.image && game.image.data) {
    const imageBase64 = `data:${game.image.contentType};base64,${game.image.data.toString('base64')}`;
    return {
      ...game._doc,
      image: imageBase64, // Attach the base64-encoded image
    };
  } else if (game.imageUrl) {
    return {
      ...game._doc,
      image: game.imageUrl, // Attach the image URL
    };
  } else {
    return {
      ...game._doc,
      image: null, // No image found, return null or a placeholder
    };
  }
};

// Fetch all games (for the product page)
router.get('/games', async (req, res) => {
  try {
    const games = await Game.find();

    // Process each game to return the image (either as base64 or as imageUrl)
    const gamesWithImages = games.map(game => {
      if (game.image && game.image.data) {
        // Convert binary image to base64
        const imageBase64 = `data:${game.image.contentType};base64,${game.image.data.toString('base64')}`;
        return {
          ...game._doc, // Spread all other properties of the game
          imageUrl: imageBase64, // Use base64 as imageUrl
        };
      } else if (game.imageUrl) {
        // If image URL is present, send it
        return {
          ...game._doc,
          imageUrl: game.imageUrl, // Use imageUrl directly
        };
      } else {
        // If no image is found, leave the image property empty or assign a default placeholder
        return {
          ...game._doc,
          imageUrl: 'default-image.jpg', // Placeholder URL for games without an image
        };
      }
    });

    res.status(200).json(gamesWithImages);
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

    const gameWithImage = processGameImage(game);
    res.status(200).json(gameWithImage);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

// Fetch image by game ID
router.get('/images/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    if (game.image && game.image.data) {
      res.set('Content-Type', game.image.contentType);
      res.send(game.image.data);
    } else if (game.imageUrl) {
      res.redirect(game.imageUrl); // Redirect to image URL if present
    } else {
      return res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

// Add a new game with image upload or URL
router.post('/games', upload.single('image'), async (req, res) => {
  try {
    const {
      title, description, price, genre, developer,
      publisher, releaseDate, rating, inStock,
      discountPercentage, platform, tags
    } = req.body;

    const gameData = {
      title,
      description,
      price,
      genre,
      platform: JSON.parse(platform),
      developer,
      publisher,
      releaseDate,
      rating,
      tags: JSON.parse(tags),
      inStock: inStock === 'true',
      discountPercentage,
    };

    // Handle image or URL
    if (req.file) {
      gameData.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    } else if (req.body.imageUrl) {
      gameData.imageUrl = req.body.imageUrl;
    }

    const newGame = new Game(gameData);
    await newGame.save();
    res.status(201).json({ message: 'Game added successfully!', game: newGame });
  } catch (error) {
    console.error('Error adding game:', error);
    res.status(500).json({ error: 'Failed to add game' });
  }
});

// Update a game with optional image upload or URL
router.put('/games/:id',upload.single('image'), async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const {
      title, description, price, genre, developer,
      publisher, releaseDate, rating, inStock,
      discountPercentage, platform, tags, imageUrl
    } = req.body;

    // Update game fields
    game.title = title || game.title;
    game.description = description || game.description;
    game.price = price || game.price;
    game.genre = genre || game.genre;
    game.developer = developer || game.developer;
    game.publisher = publisher || game.publisher;
    game.releaseDate = releaseDate || game.releaseDate;
    game.rating = rating || game.rating;
    game.inStock = inStock === 'true' || game.inStock;
    game.discountPercentage = discountPercentage || game.discountPercentage;
    game.platform = platform ? JSON.parse(platform) : game.platform;
    game.tags = tags ? JSON.parse(tags) : game.tags;

    // Update image or URL
    if (req.file) {
      game.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
      game.imageUrl = undefined; // Clear URL if binary image is updated
    } else if (imageUrl) {
      game.imageUrl = imageUrl;
      game.image = undefined; // Remove binary image if a URL is provided
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

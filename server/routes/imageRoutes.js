const express = require('express');
const router = express.Router();
const Game = require('../model/gameModel');

// GET route to fetch images
router.get('/images/:filename', async (req, res) => {
  const { filename } = req.params;

  try {
    // Fetch the game document where imageFileName matches the requested filename
    const game = await Game.findOne({ imageFileName: filename }).exec();
    
    if (!game || !game.image) {
      return res.status(404).send('Image not found');
    }

    // Set the correct content type and send the image data
    res.set('Content-Type', game.image.contentType);
    res.send(game.image.data);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

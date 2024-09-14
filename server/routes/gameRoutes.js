const express = require('express');
const router = express.Router();
const Game = require('../model/gameModel');

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
router.post('/games', async (req, res) => {
    const game = new Game(req.body);
    try {
        const newGame = await game.save();
        res.status(201).json(newGame);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
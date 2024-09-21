const express = require('express');
const router = express.Router();
const User = require('../model/user'); // Adjust the path as needed
const authMiddleware = require('../middlewares/verifyJWT'); // Your authentication middleware

// Sync product history to the database
router.post('/history/sync', authMiddleware, async (req, res) => {
  try {
    console.log('History sync route hit');
    const { orders } = req.body;
    const userId = req.user.id; // Assuming your auth middleware attaches the user to the request

    // Update the user's product history in the database
    await User.findByIdAndUpdate(userId, { orders: orders });


    res.status(200).json({ message: 'Product history synced successfully' });
  } catch (error) {
    console.error('Error syncing product history:', error);
    res.status(500).json({ error: 'An error occurred while syncing the product history' });
  }
});

// Retrieve product history from the database
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Should be set by authMiddleware
    
    // Fetch user's product history
    const user = await User.findById(userId).select('orders').lean();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user.orders || []);
  } catch (error) {
    console.error('Error retrieving product history:', error);
    res.status(500).json({ error: 'An error occurred while retrieving the product history' });
  }
});

module.exports = router;

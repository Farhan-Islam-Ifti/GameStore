const express = require('express');
const router = express.Router();
const User = require('../model/user'); // Adjust the path as needed
const {authMiddleware} = require('../middlewares/verifyJWT'); // Your authentication middleware

router.post('/cart/sync', authMiddleware, async (req, res) => {
  try {
    const { cart } = req.body;
    const userId = req.user.id; // Assuming your auth middleware attaches the user to the request

    // Update the user's cart in the database
    await User.findByIdAndUpdate(userId, { cart: cart });

    res.status(200).json({ message: 'Cart synced successfully' });
  } catch (error) {
    console.error('Error syncing cart:', error);
    res.status(500).json({ error: 'An error occurred while syncing the cart' });
  }
});

module.exports = router;

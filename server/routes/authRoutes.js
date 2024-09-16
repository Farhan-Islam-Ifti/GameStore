const express = require('express');
const router = express.Router();
const cors = require('cors');
const {
  test,
  registerUser,
  loginUser,
  getProfile,
  refreshToken,
  logout
} = require('../controllers/authController');

// Middleware
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
    })
)

router.get('/', test);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getProfile);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

module.exports = router;

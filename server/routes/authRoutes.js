const express = require('express');
const router = express.Router();
const cors = require('cors');
const {test , registerUser, loginUser}= require('../controllers/authController')

//middleware  
router.use(
    cors({
        credentials: true,
        origin: 'https://game-store-client.vercel.app'
    })
)

router.get('/', test)
router.post('/register', registerUser)
router.post('/login', loginUser)


module.exports =router

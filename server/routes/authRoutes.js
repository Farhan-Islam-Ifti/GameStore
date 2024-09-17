const express = require('express');
const router = express.Router();
const cors = require('cors');
const {test , registerUser, loginUser}= require('../controllers/authController')
const loginLimiter = require('../middlewares/loginLimiter');
const verifyJWT = require('../middlewares/verifyJWT')
const authController = require('../controllers/authController')

//middleware  
router.use(cors({
    credentials: true,
    origin: "https://game-store-client.vercel.app" 
}));
//router.use(verifyJWT)

router.get('/', test)
router.post('/register', registerUser)
router.post( '/login',loginUser)
//router.use(verifyJWT)
router.route('/refresh')
    .get(authController.refresh)

router.route('/logout')
 .post(authController.logout)



module.exports =router

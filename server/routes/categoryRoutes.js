const express = require('express');
const verifyJWT = require('../middlewares/verifyJWT.js');
const { createCategoryController } = require('../controllers/categoryController.js');

const router = express.Router();

router.post('/create-category', createCategoryController);

module.exports = router;
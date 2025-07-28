const express = require('express');
const router = express.Router();
const VStokvelsController = require('../Controllers/VStokvelsController');

router.post('/check-user', VStokvelsController.checkUserByEmail);

module.exports = router;

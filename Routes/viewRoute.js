const express = require('express');
const router = express.Router();
const VStokvelsController = require('../Controllers/VStokvelsController');

router.post('/check-user', VStokvelsController.checkUserByEmail);
router.get('/details/:id', VStokvelsController.getStokvelsForUser);


module.exports = router;

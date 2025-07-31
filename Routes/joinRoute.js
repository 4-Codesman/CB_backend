const express = require('express');
const router = express.Router();
const JStokvelController = require('../Controllers/JStokvelController');

router.post('/confirm-user', JStokvelController.checkRequestsByEmail);

module.exports = router;

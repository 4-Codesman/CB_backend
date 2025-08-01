const express = require('express');
const router = express.Router();
const JStokvelController = require('../Controllers/JStokvelController');

router.post('/confirm-user', JStokvelController.checkRequestsByEmail);
router.post('/join-response', JStokvelController.InviteResponse);
router.get('/details/:stokvelId', JStokvelController.getStokvelDetails);

module.exports = router;

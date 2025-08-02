const express = require('express');
const router = express.Router();
const JStokvelController = require('../Controllers/JStokvelController');

router.post('/confirm-user', JStokvelController.checkRequestsByEmail);
router.post('/join-response', JStokvelController.InviteResponse);
router.get('/details/:stokvelId', JStokvelController.getStokvelDetails);

router.get('/test', (req, res) => {
    console.log('Join route test hit!');
    res.send('Test route works');
  });
  

module.exports = router;

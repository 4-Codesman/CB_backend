const express = require('express');
const router = express.Router();
const Stokvel= require('../Controllers/CStokvelController');

router.post('/create', Stokvel.createStokvel);

module.exports = router;


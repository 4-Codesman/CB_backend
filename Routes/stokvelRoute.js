const express = require('express');
const router = express.Router();
const Stokvel= require('../Controllers/CStokvelController');
const JStokvel=require('../Controllers/JStokvelController');

router.post('/create', Stokvel.createStokvel);
router.get('/details/:id', JStokvel.getStokvelDetails);

module.exports = router;


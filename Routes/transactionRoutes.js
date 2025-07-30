const express = require('express');
const router = express.Router();

const{
    IncomingTransaction
} = require('../Controllers/transactionControllers.js');

router.post('/incoming', IncomingTransaction);

module.exports = router;
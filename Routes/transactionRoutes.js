const express = require('express');
const router = express.Router();

const{
    IncomingTransaction,
    GetUserTransactions
} = require('../Controllers/transactionControllers.js');

router.post('/incoming', IncomingTransaction);
router.get('/user', GetUserTransactions);

module.exports = router;
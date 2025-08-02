const express = require('express');
const router = express.Router();

const{
    IncomingTransaction,
    GetUserTransactions,
    StokvelPayment,
    StokvelWithdrawal
} = require('../Controllers/transactionControllers.js');

router.post('/incoming', IncomingTransaction);
router.get('/:uID', GetUserTransactions);
router.post('/stokvel-payment', StokvelPayment);
router.post('/stokvel-withdrawal', StokvelWithdrawal);

module.exports = router;
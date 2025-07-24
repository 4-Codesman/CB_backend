const express = require('express');
const router = express.Router();

const {
    testServer
} = require('../Controllers/testController.js');

router.get('/', testServer);

module.exports = router;
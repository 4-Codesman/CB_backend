const express = require('express');
const router = express.Router();

const {
    AddUserToMongo
} = require('../Controllers/userController.js');

router.post('/login', AddUserToMongo);

module.exports = router;
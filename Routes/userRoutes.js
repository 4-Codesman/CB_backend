const express = require('express');
const router = express.Router();

const {AddUserToMongo} = require('../Controllers/userController.js');
const userController = require('../Controllers/userController.js');

router.post('/login', AddUserToMongo);
router.patch('/update-progress/:userID', userController.updatePersonalGoalProgress);


module.exports = router;
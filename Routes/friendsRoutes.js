const express = require('express');
const router = express.Router();
const controller = require('../Controllers/friendsController');

router.post('/add', controller.addFriend);
router.get('/requests/:uid', controller.getFriendRequests);
router.post('/respond', controller.respondToRequest);
router.get('/list/:uid', controller.getFriendsList);
router.post('/remove', controller.removeFriend);
router.get('/PairFriend/:uid', controller.getPairFriend);
router.post('/generate-monthly-pairs', controller.generateMonthlyPairs);

module.exports = router;

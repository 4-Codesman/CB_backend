const express = require('express');
const router = express.Router();
const User = require('../Models/userModel.js');

const { AddUserToMongo } = require('../Controllers/userController.js');
const userController = require('../Controllers/userController.js');

// Login route
router.post('/login', AddUserToMongo);

// Update personal goal progress route
router.patch('/update-progress/:userID', userController.updatePersonalGoalProgress);

router.get('/emails', async (req, res) => {
  console.log('Fetching emails');
  try {
    const users = await User.find({}, 'userEmail -_id');
    const emailList = users.map(u => u.userEmail);
    res.json(emailList);
  } catch (err) {
    console.error('Error fetching emails:', err);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

router.get('/:uid', userController.getUserByUID);

router.post('/getUserIdsByEmail', async (req, res) => {
  try {
    const { emails } = req.body;
    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: 'Invalid Array' });
    }
    const users = await User.find({ userEmail: { $in: emails } }, 'userEmail userID');
    const ans = users.map(user => ({ email: user.userEmail, userID: user.userID }));
    res.json(ans);
  } catch (err) {
    console.error('Error fetching IDs:', err);
    res.status(500).json({ error: 'Failed to fetch IDs' });
  }
});

module.exports = router;

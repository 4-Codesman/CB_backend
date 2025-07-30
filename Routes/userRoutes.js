const express = require('express');
const router = express.Router();
const User = require('../Models/userModel.js');

const {
    AddUserToMongo
} = require('../Controllers/userController.js');

router.post('/login', AddUserToMongo);

router.get('/emails', async (req, res) => {
    try {
      const users = await User.find({}, 'userEmail -_id');
      const emailList = users.map(u => u.userEmail);
  
      res.json(emailList);
    } catch (err) {
      console.error('Error fetching emails:', err);
      res.status(500).json({ error: 'Failed to fetch emails' });
    }
  });

module.exports = router;
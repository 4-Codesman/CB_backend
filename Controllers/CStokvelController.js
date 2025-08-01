const mongoose = require('mongoose');
const Stokvel = require('../Models/stokvelModel');
const StokvelUser = require('../Models/StokvelUserModel');
const User = require('../Models/userModel');

exports.createStokvel = async (req, res) => {
  try {
    const { name, type, amount, period, date, members } = req.body;

    if (!name || type === undefined || !amount || !period || !date || !members || !Array.isArray(members) || members.length < 1) {
      return res.status(400).json({ error: 'All fields are required and members must be a non-empty array' });
    }
    const newStokvel = new Stokvel({
      name,
      type,
      amount,
      period,
      date,
      status: 0
    });

    await newStokvel.save();

    const users = await User.find({ userEmail: { $in: members } }, 'userEmail userID');

    const emailToIdMap = {};
    users.forEach(user => {emailToIdMap[user.userEmail]=user.userID;});

    const shuffledEmails = [...members].sort(()=> 0.5- Math.random());

    const stokvelUsers = shuffledEmails.map((email, index) => ({
      sv_id: newStokvel._id,
      user_id: emailToIdMap[email],
      user_email: email,
      status: email === members[members.length - 1] ? 1 : 0,
      position: index
    }));

    await StokvelUser.insertMany(stokvelUsers);

    res.status(201).json({ message: 'Stokvel created successfully', stokvel: newStokvel });

  } catch (err) {
    console.error('Error creating stokvel:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const mongoose = require('mongoose');
const Stokvel = require('../Models/stokvelModel');

exports.createStokvel = async (req, res) => {
  try {
    const { name, type, amount, period, date, members } = req.body;

    if (!name || type === undefined || !amount || !period || !date || !members) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const stokvelType = Number(type);

    const newStokvel = new Stokvel({
      name,
      type: stokvelType,
      amount,
      period,
      date,
      members,
      status: 'pending'
    });

    await newStokvel.save();
    res.status(201).json({ message: 'Stokvel created successfully', stokvel: newStokvel });
  } catch (err) {
    console.error('Error creating stokvel:', err.message);
    console.error(err.stack);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

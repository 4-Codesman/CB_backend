const mongoose = require('mongoose');
const SavingLeague = require('../Models/savingLeagueModel');
const SavingLeagueUser = require('../Models/savingLeagueUserModel');

exports.createSavingLeague = async (req, res) => {
  try {
    const {
      name,
      description,
      status,
      dueDate,
      startDate,
      maxMembers,
      creatorUid
    } = req.body;

    // Validate required fields
    if (!name || !dueDate || !startDate || !maxMembers || !creatorUid) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new Saving League
    const newLeague = new SavingLeague({
      _id: new mongoose.Types.ObjectId(),
      name,
      description,
      status,
      dueDate: new Date(dueDate),
      startDate: new Date(startDate),
      maxMembers,
      creatorUid
    });

    await newLeague.save();
    res.status(201).json({ message: 'Saving League created successfully', league: newLeague });
  } catch (error) {
    console.error('Error creating saving league:', error);
    res.status(500).json({ error: 'Server error while creating saving league' });
  }
};

exports.getSavingLeagues = async (req, res) => {
  try {
    const leagues = await SavingLeague.find();
    res.status(200).json(leagues);
  } catch (error) {
    console.error('Error fetching saving leagues:', error);
    res.status(500).json({ error: 'Server error while fetching saving leagues' });
  }
};
/*
exports.getSavingLeagueByUID = async (req, res) => {
  const { uID } = req.params;

  try {
      const league_user = await SavingLeagueUser.findOne({ creatorUid: uID });

      if (!league_user) {
          return res.status(404).json({ message: 'Saving League not found for this user' });
      }

      const league = await SavingLeague.findById(league_user.svl_id);
      if (!league) {  
          return res.status(404).json({ message: 'Saving League not found' });
      }
  } 
}*/
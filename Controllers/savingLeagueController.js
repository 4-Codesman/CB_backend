const mongoose = require('mongoose');
const SavingLeague = require('../Models/savingLeagueModel');
const SavingLeagueUser = require('../Models/savingLeagueUserModel');

// ✅ CREATE a new Saving League and add creator to SavingLeagueUsers
exports.createSavingLeague = async (req, res) => {
  console.log('⚙️ createSavingLeague controller was called');
  try {
    const {
      name,
      description,
      status,
      dueDate,
      startDate,
      maxMembers,
      creatorUid,
      creatorGoal
    } = req.body;

    // Validate required fields
    if (!name || !dueDate || !startDate || !maxMembers || !creatorUid || !creatorGoal) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1. Create the league
    const newLeague = new SavingLeague({
      _id: new mongoose.Types.ObjectId(),
      name,
      description,
      status: status || 'open',
      dueDate: new Date(dueDate),
      startDate: new Date(startDate),
      maxMembers,
      creatorUid
    });

    await newLeague.save();
    console.log(`✅ League created: ${newLeague._id}`);

    

    // 2. Create user entry
    const newUserEntry = new SavingLeagueUser({
      svl_id: newLeague._id,
      user_id: creatorUid,
      goal: creatorGoal
    });

    await newUserEntry.save();
    console.log(`✅ Creator added to SavingLeagueUsers: ${creatorUid}`);

    res.status(201).json({
      message: 'Saving League created and user added successfully',
      league: newLeague
    });
  } catch (error) {
    console.error('❌ Error in createSavingLeague:', error);
    res.status(500).json({ error: 'Server error while creating saving league' });
  }
};

// ✅ GET all saving leagues
exports.getSavingLeagues = async (req, res) => {
  try {
    const leagues = await SavingLeague.find();
    res.status(200).json(leagues);
  } catch (error) {
    console.error('❌ Error fetching saving leagues:', error);
    res.status(500).json({ error: 'Server error while fetching saving leagues' });
  }
};

/*
// ⛔️ OLD (COMMENTED) GET Saving League by UID - keep as is
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
}
*/

// ✅ GET Saving League by League ID
exports.getSavingLeagueById = async (req, res) => {
  const { leagueId } = req.params;

  try {
    const league = await SavingLeague.findById(leagueId);
    if (!league) {
      return res.status(404).json({ error: 'Saving League not found' });
    }

    res.status(200).json(league);
  } catch (error) {
    console.error('Error fetching saving league by ID:', error);
    res.status(500).json({ error: 'Server error while fetching saving league' });
  }   
};

// ✅ JOIN an existing Saving League
exports.joinSavingLeague = async (req, res) => {
  const { leagueId } = req.params;
  const { uid, goal } = req.body;

  if (!uid || !goal) {
    return res.status(400).json({ error: 'Missing uid or goal' });
  }

  try {
    const league = await SavingLeague.findById(leagueId);
    if (!league) return res.status(404).json({ error: 'League not found' });

    if (league.status !== 'open') {
      return res.status(403).json({ error: 'League is not open to join' });
    }

    const currentCount = await SavingLeagueUser.countDocuments({ svl_id: leagueId });
    if (currentCount >= league.maxMembers) {
      league.status = 'full';
      await league.save();
      return res.status(403).json({ error: 'League is full' });
    }

    const alreadyJoined = await SavingLeagueUser.findOne({ svl_id: leagueId, user_id: uid });
    if (alreadyJoined) {
      return res.status(409).json({ error: 'User already joined this league' });
    }

    const newEntry = new SavingLeagueUser({
      svl_id: league._id,
      user_id: uid,
      goal
    });

    await newEntry.save();

    const updatedCount = currentCount + 1;
    if (updatedCount >= league.maxMembers) {
      league.status = 'full';
      await league.save();
    }

 
    res.status(201).json({ message: 'Successfully joined the league and earned 10 points!' });
  } catch (err) {
    console.error('❌ Error joining league:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ GET all open and joinable Saving Leagues
exports.getOpenSavingLeagues = async (req, res) => {
  try {
    const openLeagues = await SavingLeague.find({ status: 'open' });
    console.log('📂 Open leagues found:', openLeagues);

    const joinableLeagues = [];

    for (const league of openLeagues) {
      try {
        const count = await SavingLeagueUser.countDocuments({ svl_id: league._id });
        console.log(`📊 League ${league.name} has ${count}/${league.maxMembers} members`);

        // ✅ Defensive type check
        const max = Number(league.maxMembers);
        if (!isNaN(max) && count < max) {
          joinableLeagues.push(league);
        } else {
          console.warn(`⚠️ Skipping league ${league.name} due to invalid maxMembers:`, league.maxMembers);
        }

      } catch (innerErr) {
        console.error(`❌ Error counting users for league ${league._id}:`, innerErr);
      }
    }

    res.status(200).json(joinableLeagues);
  } catch (error) {
    console.error('❌ Error fetching open leagues:', error);
    res.status(500).json({ error: 'Server error while fetching open leagues' });
  }
};


// ✅ GET all leagues a user has joined
exports.getUserLeagues = async (req, res) => {
  const { uID } = req.params;
  console.log('🔍 Searching for user:', uID);

  try {
    // Fetch memberships for the user
    const memberships = await SavingLeagueUser.find({ user_id: uID });
    console.log('📋 Found memberships:', memberships);

    if (memberships.length === 0) {
      return res.status(200).json([]);
    }

    const leagueIds = memberships.map(m => m.svl_id); // No need to convert since it's already ObjectId
    console.log('🏷️ League IDs:', leagueIds);

    // Fetch leagues using the IDs
    const userLeagues = await SavingLeague.find({ _id: { $in: leagueIds } });
    console.log('🎯 Found leagues:', userLeagues);

    res.status(200).json(userLeagues);
  } catch (error) {
    console.error('❌ Error fetching user leagues:', error);
    res.status(500).json({ error: 'Server error fetching user leagues' });
  }
};


// ✅ GET all users in a specific Saving League
exports.getUsersInSavingLeague = async (req, res) => {
  const { leagueId } = req.params;  // Changed from _id to leagueId to match route parameter
  console.log('🔍 Searching for league with ID:', leagueId);

  try {
    // 1. Validate that the league exists
    const league = await SavingLeague.findById(leagueId);
    console.log('📋 Found league:', league);

    if (!league) {
      return res.status(404).json({ error: 'Saving League not found' });
    }

    // 2. Fetch all users in this league
    const users = await SavingLeagueUser.find({ svl_id: leagueId }); // Changed _id to svl_id
    console.log('👥 Found users:', users);

    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Error fetching users in saving league:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid league ID format' });
    }
    res.status(500).json({ error: 'Server error while fetching users in league' });
  }
};

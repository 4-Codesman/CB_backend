const User = require('../Models/userModel');
const MonthlyPair = require('../Models/monthlyPairModel');
const moment = require('moment'); // install with npm if needed

// POST /add
exports.addFriend = async (req, res) => {
  const { code, senderUID } = req.body;

  try {
    const receiver = await User.findOne({ userID: code });
    const sender = await User.findOne({ userID: senderUID });

    if (!receiver || !sender) return res.status(404).json({ message: "User not found" });

    if (receiver.pendingRequests.includes(senderUID) || receiver.friends.includes(senderUID)) {
      return res.status(400).json({ message: "Request already sent or already friends" });
    }

    receiver.pendingRequests.push(senderUID);
    sender.sentRequests.push(receiver.userID);

    await receiver.save();
    await sender.save();

    res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /requests/:uid
exports.getFriendRequests = async (req, res) => {
  try {
    const user = await User.findOne({ userID: req.params.uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    const requests = await User.find({ userID: { $in: user.pendingRequests } });
    res.status(200).json(requests.map(u => ({ uid: u.userID, name: u.userName })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /respond
exports.respondToRequest = async (req, res) => {
  const { uid, friendId, accepted } = req.body;

  try {
    const user = await User.findOne({ userID: uid });
    const friend = await User.findOne({ userID: friendId });

    if (!user || !friend) return res.status(404).json({ message: "User not found" });

    user.pendingRequests = user.pendingRequests.filter(id => id !== friendId);
    friend.sentRequests = friend.sentRequests.filter(id => id !== uid);

    if (accepted) {
      user.friends.push(friendId);
      friend.friends.push(uid);
    }

    await user.save();
    await friend.save();

    res.status(200).json({ message: accepted ? "Friend added" : "Request rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /list/:uid
exports.getFriendsList = async (req, res) => {
  try {
    const user = await User.findOne({ userID: req.params.uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    const friends = await User.find({ userID: { $in: user.friends } });
    res.status(200).json(friends.map(f => ({
      uid: f.userID,
      name: f.userName
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /remove
exports.removeFriend = async (req, res) => {
  const { uid, friendId } = req.body;

  try {
    const user = await User.findOne({ userID: uid });
    const friend = await User.findOne({ userID: friendId });

    if (!user || !friend) return res.status(404).json({ message: "User not found" });

    user.friends = user.friends.filter(id => id !== friendId);
    friend.friends = friend.friends.filter(id => id !== uid);

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /PairFriend/:uid
exports.getPairFriend = async (req, res) => {
  const uid = req.params.uid;
  const currentMonth = moment().format('YYYY-MM');

  try {
    // Check if user is already in a pair for this month
    const pair = await MonthlyPair.findOne({
      month: currentMonth,
      $or: [{ userA_ID: uid }, { userB_ID: uid }]
    });

    if (!pair) return res.status(404).json({ message: "No pair found this month" });

    const friend =
      pair.userA_ID === uid
        ? { uid: pair.userB_ID, name: pair.userB_Name }
        : { uid: pair.userA_ID, name: pair.userA_Name };

    res.status(200).json({
      friend,
      sharedGoal: pair.sharedGoal,
      progress: pair.progress
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//POST / generate-monthly-pairs
exports.generateMonthlyPairs = async (req, res) => {
  const currentMonth = moment().format('YYYY-MM');

  try {
    // ❌ 1. Prevent duplicate monthly pairings
    const alreadyExists = await MonthlyPair.findOne({ month: currentMonth });
    if (alreadyExists) {
      return res.status(400).json({ message: `Pairs for ${currentMonth} already exist.` });
    }

    // ✅ 2. Load all users
    const allUsers = await User.find();
    const userMap = new Map(allUsers.map(user => [user.userID, user]));
    const paired = new Set();
    const pairsToCreate = [];

    for (const user of allUsers) {
      const uid = user.userID;
      if (paired.has(uid)) continue;

      // 🔍 Filter eligible unpaired mutual friends
      const unpairedFriends = user.friends.filter(fid => {
        return (
          !paired.has(fid) &&
          userMap.has(fid) &&
          userMap.get(fid).friends.includes(uid) // ensure mutual friendship
        );
      });

      if (unpairedFriends.length === 0) continue;

      // 🎲 Pick a random mutual friend
      const partnerId = unpairedFriends[Math.floor(Math.random() * unpairedFriends.length)];
      const partner = userMap.get(partnerId);

      const pairID = `${uid}-${partnerId}-${currentMonth}`;
      const sharedGoal = 100; // You can randomize or vary this

      // ✅ Create monthly pair entry
      pairsToCreate.push(new MonthlyPair({
        pairID,
        userA_ID: uid,
        userA_Name: user.userName,
        userB_ID: partnerId,
        userB_Name: partner.userName,
        month: currentMonth,
        sharedGoal,
        progress: 0
      }));

      paired.add(uid);
      paired.add(partnerId);
    }

    // 📝 Insert all pairs at once
    await MonthlyPair.insertMany(pairsToCreate);

    res.status(201).json({
      message: `${pairsToCreate.length} pairs created for ${currentMonth}`,
      pairs: pairsToCreate
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
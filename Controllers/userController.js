const User = require('../Models/userModel');

// Add user from firebase after authentication to mongoDB
exports.AddUserToMongo = async(req, res) => {
    const {uID, uEmail, uName} = req.body;

    try {
        const newUser = new User({
            userID: uID,
            userEmail: uEmail,  
            userName: uName,
            lastLogin: new Date()
        });

        if (!uID || !uEmail || !uName) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        if (await User.exists({ userID: uID })) {
            return res.status(201).json({ message: 'User already exists' });
        }else {
            await newUser.save();
            return res.status(201).json({ message: 'User added successfully' });
        }

    } catch (error) {
        console.error('Error adding user to MongoDB:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.updatePersonalGoalProgress = async (req, res) => {
  const { userID } = req.params;

  try {
    const user = await User.findOne({ userID });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.personalGoal || user.personalGoal === 0) {
      return res.status(400).json({ message: 'Personal goal not set' });
    }

    // ✅ Calculate progress
    const progress = Math.min(
      100,
      Math.round((user.accBalance / user.personalGoal) * 100)
    );

    user.personalGoalProgress = progress;

    await user.save();

    res.status(200).json({
      message: 'Progress updated',
      userID: user.userID,
      progress: user.personalGoalProgress
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

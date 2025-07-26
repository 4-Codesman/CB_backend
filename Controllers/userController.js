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
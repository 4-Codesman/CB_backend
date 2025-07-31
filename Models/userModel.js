const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userID: { type: String, required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    createdAt: {type: Date,default: Date.now},
    lastLogin:{type: Date},
    
    //fields for friends page
    friends: [String], // Array of uids
    pendingRequests: [String],
    sentRequests: [String],
    
    //additional fields for leaderboard (and other features)
    accBalance: {type: Number,default: 0},
    accPoints: {type: Number, default: 0},
    personalGoal: {type: Number,default: 0},
    goalCreatedAt: { type: Date}

});

const User = mongoose.model('User', userSchema, 'Users');
module.exports = User;
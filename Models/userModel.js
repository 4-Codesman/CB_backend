const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userID: { type: String, required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    Account_Balance: { // all the money you have in discovery Collab Banking
        type: Number,
        default: 0
    },
    SavingsLeague_Balance:{
        type: Number,
        default: 0  
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin:{
        type: Date
    }
});

const User = mongoose.model('User', userSchema, 'Users');
module.exports = User;
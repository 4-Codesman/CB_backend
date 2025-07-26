const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userID: { type: String, required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
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
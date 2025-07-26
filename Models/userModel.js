const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userID: String,
    userEmail: String,
    userName: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin:{
        type: Date
    }
});

const User = mongoose.model('User', userSchema, 'Users');
model.exports = User;
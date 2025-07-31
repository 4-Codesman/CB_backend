const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    userID: {type: String, ref: 'User', required: true},
    Amount: {type: Number, required: true},
    tag: {type: String, required: true}, // 'SavingsLeague' or 'Account'
    date: {
        type: Date,
        default: Date.now
    }

});    

const Transaction = mongoose.model('Transaction', userSchema, 'Transactions');
module.exports = Transaction;
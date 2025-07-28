const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stokvelSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String, required: true,
    type: Number, required: true, // 0 for savings, 1 for investment
    amount: Number, required: true,
    period: String, required: true,
    date: Date, required: true
})

const Stokvel = mongoose.model('Stokvel', stokvelSchema, 'Stokvels');
module.exports = Stokvel;
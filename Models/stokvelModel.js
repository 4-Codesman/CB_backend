const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stokvelSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    type: { type: Number, required: true }, //0 =traditional, 1=interest
    amount: { type: Number, required: true },
    period: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Stokvel', stokvelSchema, 'Stokvels');
